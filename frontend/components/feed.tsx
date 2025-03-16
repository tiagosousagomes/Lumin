"use client"

import { Heart, MessageCircle, MoreHorizontal, Repeat, Share } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import Image from 'next/image'

interface FeedProps {
  className?: string
}

export function Feed({ className }: FeedProps) {
  const [postContent, setPostContent] = useState("")

  const posts = [
    {
      id: 1,
      user: {
        name: "Tiago Sousa",
        handle: "@ogaitsm",
        avatar: "/tiagoAvatar.jpg",
       
      },
      content:
        "não vejo a hora de Cristopher Nolan lançar um novo filme estilo inception",
      image: "/filmesNolan.webp",
      time: "2h",
      likes: 24,
      comments: 5,
      reposts: 2,
    },
    {
      id: 2,
      user: {
        name: "Jessica Vitoria",
        handle: "@WOB00T",
        avatar: "/caioAvatar.jpg",
      },
      content:
        "Hoje sonhei que estava participando da serie hannibal, e fazendo churrasquinho de uma loirinha",
      image:"/hannibal.webp",
      time: "4h",
      likes: 152,
      comments: 28,
      reposts: 47,
    },
    {
      id: 3,
      user: {
        name: "Matheus Patricio",
        handle: "@matheus.P",
        avatar: "/adrielAvatar.jpg",
      },
      content:
        "ai felipe 🥵 libera 🥵 o 🥵c 🥵 zin ",
      image: "/vaiDar.webp",
      time: "6h",
      likes: 87,
      comments: 12,
      reposts: 5,
    },
    {
        id: 4,
        user: {
          name: "Evelyn Julia",
          handle: "@evlia04",
          avatar: "/rikelmiAvatar.jpeg",
        },
        content:
          "meu Deus, tiago vive cobrando a pizza que to devendo quando prometi que ia pagar quando entrasse no estagio",
        time: "37min",
        likes: 297,
        comments: 62,
        reposts: 3,
      },
      {
        id: 5,
        user: {
          name: "Felipe Renan",
          handle: "@felpsRenan",
          avatar: "/felipeAvatar.png",
        },
        content:
          " e o caba vai endoidar estudando JS é? vou codar em C# msm",
        image: "/jsFelipe.webp",
        time: "20h",
        likes: 32,
        comments: 4,
        reposts: 7,
      },
      {
        id: 6,
        user: {
          name: "Bruno Vasconcelos",
          handle: "@profBruno",
          avatar: "/profBruno.jpeg",
        },
        content:
          "esse trabalho de vocês tá muito bom, parabens!",
        time: "5h",
        likes: 500,
        comments: 243,
        reposts: 67,
      },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-gray-800 bg-[#2a2b2d]">
        <CardHeader className="flex-row gap-4 space-y-0 pb-2">
          <Avatar>
            <AvatarImage src="/tiagoAvatar.jpg" width={40} height={40} alt="Your avatar" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="O que está acontecendo?"
              className="min-h-12 resize-none border-none bg-transparent p-0 text-white placeholder:text-gray-400 focus-visible:ring-0"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-[#108CD9]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="sr-only">Add image</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-[#108CD9]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                <path d="M8 9h8" />
                <path d="M8 15h4" />
              </svg>
              <span className="sr-only">Add poll</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-[#108CD9]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0v-4a2 2 0 0 0-2-2Z" />
                <rect width="18" height="12" x="3" y="6" rx="2" />
                <path d="m22 8-4 4 4 4" />
                <path d="m2 8 4 4-4 4" />
              </svg>
              <span className="sr-only">Add gif</span>
            </Button>
          </div>
          <Button className="rounded-full bg-[#108CD9] text-black hover:bg-[#108CD9]/90" disabled={!postContent.trim()}>
            Post
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-gray-800 bg-[#2a2b2d]">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
              <Avatar>
                <AvatarImage src={post.user.avatar}  alt={post.user.name} /> 
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{post.user.name}</span>
                    <span className="text-sm text-gray-400">{post.user.handle}</span>
                    <span className="text-sm text-gray-400">· {post.time}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
                <p className="text-white">{post.content}</p>
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              {post.image && (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <Image
                    src={post.image || "./public/TOT.svg"}
                    alt="Post attachment"
                    className="h-auto w-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between py-2">
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-[#108CD9]">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-green-500">
                <Repeat className="h-4 w-4" />
                <span>{post.reposts}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-red-500">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#108CD9]">
                <Share className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

