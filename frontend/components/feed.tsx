"use client";

import { Heart, MessageCircle, MoreHorizontal, Repeat, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";


interface Post{
  content:string,
  author:string,
  image:string,
  likes:[],
  comments:[]
}

interface responsePost{
  data:Post[]
}
interface FeedProps {
  className?: string;
}

export function Feed({ className }: FeedProps) {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const data = await fetch("http://localhost:3001/api/post") // Ajuste o endpoint conforme necessário
      .then((data) => data.json())
      .then((data) => setPosts(Array.isArray(data.data) ? data.data : []))
      .catch((err) => console.error("Erro ao buscar posts:", err));
  }, []);
  
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
          <Button className="rounded-full bg-[#108CD9] text-black hover:bg-[#108CD9]/90" disabled={!postContent.trim()}>
            Post
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post._id} className="border-gray-800 bg-[#2a2b2d]">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
              <Avatar>
                <AvatarImage src={post.author?.avatar || "/default-avatar.png"} alt={post.author?.name || "Usuário desconhecido"} />
                <AvatarFallback>{post.author?.name ? post.author.name[0] : "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{post.author?.name || "Usuário desconhecido"}</span>
                    <span className="text-sm text-gray-400">{post.author?.username || "@desconhecido"}</span>
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
              {post.image && post.image.data && (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <Image
                    src={`data:${post.image.contentType};base64,${Buffer.from(post.image.data.data).toString("base64")}`}
                    alt="Post attachment"
                    className="h-auto w-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between py-2">
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-[#108CD9]">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-green-500">
                <Repeat className="h-4 w-4" />
                <span>0</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-red-500">
                <Heart className="h-4 w-4" />
                <span>{post.likes.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#108CD9]">
                <Share className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}