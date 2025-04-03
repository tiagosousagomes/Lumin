"use client";

import { Heart, MessageCircle, MoreHorizontal, Share, SmilePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { toggleLike } from "../services/postService"; // Importa o serviço de likes

interface Like {
  _id: string;
  user: User | string; // Pode ser o objeto completo ou apenas o ID
  post: Post | string;
  createdAt: Date;
}
interface Comments {
  _id: string;
  content: string;
  author: User | string; // Pode ser o objeto completo ou apenas o ID
  post: Post | string;
  createdAt: Date;
  updatedAt: Date;
}
interface User {
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
  image: {
    data: Buffer;
    contentType: string;
  };
}

interface responsePost {
  success: boolean;
  message?: string;
  data: Post[];
}
interface FeedProps {
  className?: string;
}

interface jwtPayload {
  userId: string;
}

export function Feed({ className }: FeedProps) {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/post");
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

  const handleCreatePost = async () => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Usuário não autenticado");

    const decoded: jwtPayload = jwtDecode(token);
    const userId = decoded.userId;

    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("author", userId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:3001/api/post", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Post criado com sucesso!");
        setPostContent("");
        setImageFile(null);
        setPosts([data.data, ...posts]);
      } else {
        alert("Erro ao criar post");
      }
    } catch (err) {
      console.error("Erro ao criar post:", err);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".emoji-picker-container") &&
        !target.closest(".emoji-button")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setPostContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleToggleLike = async (postId: string) => {
    const token = Cookies.get("access_token");
    if (!token) return alert("Usuário não autenticado");

    const decoded: jwtPayload = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const updatedPost = await toggleLike(postId, userId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error("Erro ao alternar like:", error);
    }
  };

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

        <CardFooter className="flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[#4B7CCC] hover:text-[#4B7CCC]/90">
              <ImageIcon />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imageFile && (
              <span className="text-xs text-white">{imageFile.name}</span>
            )}
            <label className="cursor-pointer text-[#4B7CCC] hover:text-[#4B7CCC]/90">
              <SmilePlus />
              <input
                className="hidden"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              ></input>
            </label>
            <div className="relative emoji-picker-container">
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}></button>
              {showEmojiPicker && (
                <div className="absolute top-1 left-0 z-50">
                  <label className="cursor-pointer text-[#4B7CCC] hover:text-[#4B7CCC]/90">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      height={400}
                      width={500}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <Button
            className="rounded-full bg-[#4B7CCC] text-black hover:bg-[#4B7CCC]/90"
            disabled={!postContent.trim()}
            onClick={handleCreatePost}
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
              {post.image && post.image.data && (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <Image
                    src={`data:${post.image.contentType};base64,${Buffer.from(
                      post.image.data
                    ).toString("base64")}`}
                    alt="Post attachment"
                    className="h-auto w-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between py-2">
              {/* Botão de Like */}
              <Button
                variant="muted"
                size="sm"
                className={`gap-1 ${
                  post.likes.filter((like) => like !== null).some((like) => like?.user === Cookies.get("userId"))
                    ? "text-red-500"
                    : "text-gray-400"
                } hover:text-red-500`}
                onClick={() => handleToggleLike(post._id)}
              >
                {post.likes.filter((like) => like !== null).some((like) => like?.user === Cookies.get("userId")) ? (
                  <Heart className="h-4 w-4 fill-current" /> 
                ) : (
                  <Heart className="h-4 w-4" /> 
                )}
                <span>{post.likes.filter((like) => like !== null).length}</span>
              </Button>

              {/* Botão de Comentários */}
              <Button
                variant="muted"
                size="sm"
                className="gap-1 text-gray-400 hover:text-[#108CD9]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </Button>

              {/* Botão de Compartilhar */}
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
