"use client"

import { Send } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSocket } from "../context/SocketContext"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopNavigation } from "@/components/top-navigation"
import ReactMarkdown from "react-markdown"

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unread?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
}

interface JwtPayload {
  userId: string;
}

interface FollowingResponse {
  success: boolean;
  message: string;
  following: Array<{
    following: User;
  }>;
}
interface ApiMessageResponse {
  success: boolean;
  message: string;
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;

}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        setUserId(decoded.userId)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/following/${userId}`)
        
        if (!response.ok) {
          throw new Error('Error fetching contacts')
        }

        const data: FollowingResponse = await response.json()
        
        if (data.success && data.following) {
          const formattedContacts = data.following.map((item) => ({
            id: item.following._id,
            name: item.following.name,
            username: item.following.username,
            avatar: item.following.profilePicture || '/placeholder.svg?height=40&width=40',
            lastMessage: "",
            time: "",
            unread: false
          }))
          
          const geminiContact: Contact = {
            id: "gemini-ai",
            name: "Gemini AI",
            username: "gemini",
            avatar: "/gemini-avatar.png", // Pode colocar um ícone ou imagem
            lastMessage: "",
            time: "",
            unread: false
          }
          
          setContacts([geminiContact, ...formattedContacts])
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowing()
  }, [userId])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !selectedChat) return
      
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/messages/${userId}/${selectedChat}`)
        
        if (!response.ok) {
          throw new Error('Error fetching messages')
        }

        const data = await response.json()
        
        if (data.success && data.messages) {
          const formattedMessages = data.messages.map((msg:ApiMessageResponse ) => ({
            id: msg._id,
            senderId: msg.senderId === userId ? "me" : msg.senderId,
            receiverId: msg.receiverId,
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
          
          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedChat) {
      fetchMessages()
    }
  }, [selectedChat, userId])

  useEffect(() => {
    if (!socket || !userId) return

    socket.emit('add_user', userId)

    socket.on('get_users', (users: string[]) => {
      setOnlineUsers(users)
    })

    socket.on('receive_message', (data: Message) => {
      if (selectedChat && data.senderId === selectedChat) {
        setMessages(prev => [...prev, {
          ...data,
          senderId: selectedChat,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      } 
      else {
        setContacts(prev => 
          prev.map(contact =>
            contact.id === data.senderId 
              ? { 
                  ...contact, 
                  lastMessage: data.text, 
                  time: "now", 
                  unread: true 
                }
              : contact
          )
        )
      }
    })

    return () => {
      socket.off('receive_message')
      socket.off('get_users')
    }
  }, [socket, userId, selectedChat, contacts])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5)
  }

  const handleSendMessage = useCallback(async () => {
    if (messageText.trim() && selectedChat && userId && isConnected) {
      const messageId = generateMessageId()
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
      const messageData = {
        id: messageId,
        senderId: userId,
        receiverId: selectedChat,
        text: messageText,
        time: timestamp
      }
  
      if (selectedChat === "gemini-ai") {
        setMessages(prev => [...prev, {
          ...messageData,
          senderId: "me",
        }])
  
        setMessageText("")
  
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/ai`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: messageText })
          })
  
          const data = await response.json()
          if (data.success) {
            const aiMessage = {
              id: generateMessageId(),
              senderId: "gemini-ai",
              receiverId: userId,
              text: data.response,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
  
            setMessages(prev => [...prev, aiMessage])
          } else {
            console.error("Erro da IA:", data.message)
          }
        } catch (error) {
          console.error("Erro ao buscar resposta da IA:", error)
        }
  
        return
      }
  
      if (socket) {
        socket.emit('send_message', messageData)
      }
  
      setMessages(prev => [...prev, {
        ...messageData,
        senderId: "me",
      }])
  
      setContacts(prev => 
        prev.map(contact =>
          contact.id === selectedChat 
            ? { ...contact, lastMessage: messageText, time: "now" }
            : contact
        )
      )
  
      setMessageText("")
    } else if (!isConnected) {
      return
    }
  }, [messageText, selectedChat, socket, userId, isConnected])
  

  const selectedContact = contacts.find((contact) => contact.id === selectedChat)

  return (
    <div className="min-h-screen bg-[#222325] text-white">
      <TopNavigation />
      <div className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-1 gap-0 p-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="border-r border-gray-800 pr-4 md:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          {loading && contacts.length === 0 ? (
            <div className="flex justify-center p-4">
              <p>Loading contacts...</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2 pr-4">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#2a2b2d] ${
                      selectedChat === contact.id ? "bg-[#2a2b2d]" : ""
                    }`}
                    onClick={() => {
                      setSelectedChat(contact.id)
                      // Mark as read when selected
                      setContacts(prev => 
                        prev.map(c => 
                          c.id === contact.id ? { ...c, unread: false } : c
                        )
                      )
                    }}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      {onlineUsers.includes(contact.id) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#222325]"></span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-xs text-gray-400">{contact.time}</span>
                      </div>
                      <p className="line-clamp-1 text-sm text-gray-400">{contact.lastMessage}</p>
                    </div>
                    {contact.unread && <div className="h-2 w-2 rounded-full bg-[#4B7CCC]" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {selectedContact ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-800 p-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(selectedContact.id) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#222325]"></span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedContact.name}</h2>
                  <p className="text-xs text-gray-400">@{selectedContact.username}</p>
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  {onlineUsers.includes(selectedContact.id) ? 'Online' : 'Offline'}
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex h-32 items-center justify-center">
                      <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.senderId === "me" ? "bg-[#4B7CCC] text-black" : "bg-[#2a2b2d] text-white"
                          }`}
                        >
                         <ReactMarkdown>
                            {message.text}
                        </ReactMarkdown>
                          <p className="mt-1 text-right text-xs opacity-70">{message.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    className="bg-[#2a2b2d] text-white placeholder:text-gray-400 focus-visible:ring-[#4B7CCC]"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={!isConnected}
                  />
                  <Button
                    size="icon"
                    className="bg-[#4B7CCC] text-black hover:bg-[#4B7CCC]/90"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || !isConnected}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
                {!isConnected && (
                  <p className="mt-2 text-center text-xs text-red-400">
                    You are currently offline. Messages will be sent when you reconnect.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {loading ? 'Loading...' : 'Select a conversation'}
                </h3>
                <p className="text-gray-400">
                  {contacts.length === 0 && !loading 
                    ? 'You are not following anyone yet' 
                    : 'Choose a contact to start messaging'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}