"use client"

import { Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSocket } from "../context/SocketContext"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopNavigation } from "@/components/top-navigation"

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
  id: number;
  senderId: string | "me";
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
  // Add other JWT payload fields as needed
}

interface FollowingResponse {
  success: boolean;
  message: string;
  following: Array<{
    following: User;
  }>;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { socket } = useSocket()

  // Get userId from cookies on component mount
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

  // Fetch following users from API
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3001/api/following/${userId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar contatos')
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
          
          setContacts(formattedContacts)
        }
      } catch (error) {
        console.error('Erro ao buscar contatos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowing()
  }, [userId])

  // WebSocket setup
  useEffect(() => {
    if (!socket || !userId) return

    // Add current user to online users list
    socket.emit('add_user', userId)

    // Listen for incoming messages
    socket.on('receive_message', (data: { senderId: string, text: string }) => {
      if (selectedChat && data.senderId === selectedChat) {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          senderId: data.senderId,
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      }
    })

    return () => {
      socket.off('receive_message')
    }
  }, [socket, userId, selectedChat])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat && socket && userId) {
      // Send message via WebSocket
      socket.emit('send_message', {
        senderId: userId,
        receiverId: selectedChat,
        text: messageText
      })

      // Add message locally
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        senderId: "me",
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])

      // Update last contact
      setContacts(prev => 
        prev.map(contact =>
          contact.id === selectedChat 
            ? { ...contact, lastMessage: messageText, time: "now", unread: false }
            : contact
        )
      )

      setMessageText("")
    }
  }

  const selectedContact = contacts.find((contact) => contact.id === selectedChat)

  return (
    <div className="min-h-screen bg-[#222325] text-white">
      <TopNavigation />
      <div className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-1 gap-0 p-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="border-r border-gray-800 pr-4 md:col-span-1">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          {loading ? (
            <div className="flex justify-center p-4">
              <p>Carregando contatos...</p>
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
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-xs text-gray-400">{contact.time}</span>
                      </div>
                      <p className="line-clamp-1 text-sm text-gray-400">{contact.lastMessage}</p>
                    </div>
                    {contact.unread && <div className="h-2 w-2 rounded-full bg-[#01dafd]" aria-hidden="true" />}
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
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedContact.name}</h2>
                  <p className="text-xs text-gray-400">@{selectedContact.username}</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.senderId === "me" ? "bg-[#01dafd] text-black" : "bg-[#2a2b2d] text-white"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="mt-1 text-right text-xs opacity-70">{message.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    className="bg-[#2a2b2d] text-white placeholder:text-gray-400 focus-visible:ring-[#01dafd]"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="bg-[#01dafd] text-black hover:bg-[#01dafd]/90"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {loading ? 'Carregando...' : 'Select a conversation'}
                </h3>
                <p className="text-gray-400">
                  {contacts.length === 0 && !loading 
                    ? 'Você não está seguindo ninguém ainda' 
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