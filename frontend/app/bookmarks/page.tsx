"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, Share, Bookmark } from "lucide-react"
import Image from "next/image"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { cn } from "@/lib/utils"

interface User {
  _id: string
  name: string
  username: string
  email: string
  profilePicture?: string
}

interface Comment {
  _id: string
  content: string
  author: User | string
  post: string
  createdAt: Date
  updatedAt: Date
}

interface Post {
  _id: string
  content: string
  author: User
  likes: string[]
  comments: Comment[]
  image?: {
    data: Buffer
    contentType: string
  }
}

interface JwtPayload {
  userId: string
}

export default function MarcacoesPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token)
        setCurrentUserId(decoded.userId)
      } catch (error) {
        console.error("Erro ao decodificar token:", error)
      }
    }
  }, [])

  useEffect(() => {
    fetchBookmarkedPosts()
  }, [currentUserId])

  const fetchBookmarkedPosts = async () => {
    if (!currentUserId) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${currentUserId}`)
      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setBookmarkedPosts(data.data)
      } else {
        console.error("Formato de dados inesperado:", data)
      }
    } catch (err) {
      console.error("Erro ao buscar marcações:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLike = async (postId: string) => {
    if (isLiking || !currentUserId) return
    setIsLiking(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/like/${postId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Erro ao processar a curtida")
      }

      setBookmarkedPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? { ...post, likes: data.likes } : post)),
      )
    } catch (error) {
      console.error("Erro ao alternar curtida:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleToggleBookmark = async (postId: string) => {
    if (isTogglingBookmark || !currentUserId) return
    setIsTogglingBookmark(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${postId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Erro ao processar a marcação")
      }

      if (data.action === "unbookmarked") {
        setBookmarkedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
      }

    } catch (error) {
      console.error("Erro ao alternar marcação:", error)
    } finally {
      setIsTogglingBookmark(false)
    }
  }

  const checkIfPostIsBookmarked = async (postId: string) => {
    if (!currentUserId) return false

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${postId}/user/${currentUserId}/check`
      )
      const data = await response.json()

      if (data.success) {
        return data.isBookmarked
      }
      return false
    } catch (error) {
      console.error("Erro ao verificar status da marcação:", error)
      return false
    }
  }

  const getBookmarkCount = async (postId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${postId}/count`)
      const data = await response.json()

      if (data.success) {
        return data.count
      }
      return 0
    } catch (error) {
      console.error("Erro ao obter contagem de marcações:", error)
      return 0
    }
  }

  const hasUserLikedPost = (post: Post) => {
    return currentUserId && post.likes.includes(currentUserId)
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Suas Marcações</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4B7CCC]"></div>
        </div>
      ) : bookmarkedPosts.length === 0 ? (
        <Card className="border-gray-800 bg-[#2a2b2d] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Bookmark className="h-12 w-12 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Nenhuma marcação encontrada</h2>
            <p className="text-gray-400">Quando você marcar posts, eles aparecerão aqui para fácil acesso.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarkedPosts.map((post) => (
            <Card key={post._id} className="border-gray-800 bg-[#2a2b2d]">
              <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
                <Avatar>
                  <AvatarImage
                    src={post.author?.profilePicture || "/placeholder.svg"}
                    alt={post.author?.username || "Usuário desconhecido"}
                  />
                  <AvatarFallback>{post.author?.name ? post.author.name[0] : "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{post.author?.name || "Usuário desconhecido"}</span>
                      <span className="text-sm text-gray-400">
                        {post.author?.username ? `@${post.author.username}` : "@desconhecido"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#4B7CCC]"
                        onClick={() => handleToggleBookmark(post._id)}
                        disabled={isTogglingBookmark}
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                        <span className="sr-only">Remover marcação</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-white">{post.content}</p>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                {post.image && post.image.data && (
                  <div className="mt-3 overflow-hidden rounded-xl">
                    <Image
                      src={`data:${post.image.contentType};base64,${Buffer.from(post.image.data).toString("base64")}`}
                      alt="Post attachment"
                      className="h-auto w-full object-cover"
                      width={500}
                      height={500}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between py-2">
                <Button
                  variant="muted"
                  size="sm"
                  className={cn("gap-1", hasUserLikedPost(post) ? "text-red-500" : "text-gray-400 hover:text-red-500")}
                  onClick={() => handleToggleLike(post._id)}
                  disabled={isLiking}
                >
                  {hasUserLikedPost(post) ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                  <span>{post.likes.length}</span>
                </Button>

                <Button variant="muted" size="sm" className="gap-1 text-gray-400 hover:text-[#108CD9]">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </Button>

                <Button variant="muted" size="sm" className="text-gray-400 hover:text-[#108CD9]">
                  <Share className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
