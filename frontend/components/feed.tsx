"use client";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Share,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";



interface Like {
  _id: string;
  user: User | string; // Pode ser o objeto completo ou apenas o ID
  post: Post | string;
  createdAt: Date;
}
interface Comments{
  _id: string;
  content: string;
  author: User | string; // Pode ser o objeto completo ou apenas o ID
  post: Post | string;
  createdAt: Date;
  updatedAt: Date;
}
interface User{
  _id: string;
  name: string;
  username: string;
  email: string;   
}
interface Post {
  _id: string;
  content: string;
  author: User;
  likes: Like[];
  comments: Comments[];
}

interface responsePost {
  success: boolean;
  message?: string;
  data: Post[];
}
interface FeedProps {
  className?: string;
}

export function Feed({ className }: FeedProps) {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/post"); // Ajuste o endpoint conforme necessário
        const data: responsePost = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      }
    };
    fetchResponse();
  }, []);

  
  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-gray-800 bg-[#2a2b2d]">
        <CardHeader className="flex-row gap-4 space-y-0 pb-2">
          <Avatar>
            <AvatarImage
              src="/tiagoAvatar.jpg"
              width={40}
              height={40}
              alt="Your avatar"
            />
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
          <Button
            className="rounded-full bg-[#4B7CCC] text-black hover:bg-[#4B7CCC]/90"
            disabled={!postContent.trim()}
          >
            Post
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} className="border-gray-800 bg-[#2a2b2d]">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
              <Avatar>
                <AvatarImage
                  alt={post.author?.username || "Usuário desconhecido"}
                />
                <AvatarFallback>
                  {post.author?.name ? post.author.name[0] : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {post.author?.name || "Usuário desconhecido"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {post.author?.username || "@desconhecido"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
                <p className="text-white">{post.content}</p>
              </div>
            </CardHeader>  
            <CardContent className="pb-2 pt-0">
              
            </CardContent>
            <CardFooter className="flex justify-between py-2">
              <Button
                variant="muted"
                size="sm"
                className="gap-1 text-gray-400 hover:text-[#108CD9]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </Button>
              <Button
                variant="muted"
                size="sm"
                className="gap-1 text-gray-400 hover:text-green-500"
              >
                <Repeat className="h-4 w-4" />
                <span>0</span>
              </Button>
              <Button
                variant="muted"
                size="sm"
                className="gap-1 text-gray-400 hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes.length}</span>
              </Button>
              <Button
                variant="muted"
                size="sm"
                className="text-gray-400 hover:text-[#108CD9]"
              >
                <Share className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
// passo 1: determinar os dados da interface igual o do schema do banco de dados (./backend/src/models) (ok)
// passo 2: verificar como os dados está saindo das rota de post, dar um try catch na rota pra verificar 
// passo 3: pegar os dados da api e usar com a interface que você criou
// passo 4: tirar todo o schema de follow e colocar ele dentro de User (mas espera o grupo decidir antes)