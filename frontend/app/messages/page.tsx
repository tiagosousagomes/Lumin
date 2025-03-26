"use client"

import { Send } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopNavigation } from "@/components/top-navigation"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [messageText, setMessageText] = useState("")

  const contacts = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, how's your project coming along?",
      time: "2m",
      unread: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The design looks great! I'll send feedback tomorrow.",
      time: "1h",
      unread: false,
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Are we still meeting at 3pm?",
      time: "3h",
      unread: false,
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help yesterday!",
      time: "1d",
      unread: false,
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 1,
      text: "Hey, how's your project coming along?",
      time: "10:30 AM",
    },
    {
      id: 2,
      senderId: "me",
      text: "It's going well! I'm just finishing up the UI design for the dashboard.",
      time: "10:32 AM",
    },
    {
      id: 3,
      senderId: 1,
      text: "That sounds great! Can you share a preview when you're done?",
      time: "10:33 AM",
    },
    {
      id: 4,
      senderId: "me",
      text: "Sure thing! I'll send it over by end of day.",
      time: "10:35 AM",
    },
    {
      id: 5,
      senderId: 1,
      text: "Perfect, looking forward to it. By the way, did you see the new design system updates?",
      time: "10:36 AM",
    },
    {
      id: 6,
      senderId: "me",
      text: "Not yet, I'll check them out right now. Thanks for the heads up!",
      time: "10:38 AM",
    },
  ]

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would add the message to the messages array
      // and send it to the server
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
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2 pr-4">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#2a2b2d] ${
                    selectedChat === contact.id ? "bg-[#2a2b2d]" : ""
                  }`}
                  onClick={() => setSelectedChat(contact.id)}
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
                  <p className="text-xs text-gray-400">Online</p>
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
                <h3 className="text-xl font-semibold">Select a conversation</h3>
                <p className="text-gray-400">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

