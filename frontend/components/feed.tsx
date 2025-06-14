"use client";

import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share, SmilePlus } from "lucide-react";
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

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: User | string;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Post {
  _id: string;
  content: string;
  author: User;
  likes: string[];
  comments: Comment[];
  bookmarks?: string[]; // Adicionando o campo bookmarks
  image?: {
    data: Buffer;
    contentType: string;
  };
}

interface ResponsePost {
  success: boolean;
  message?: string;
  data: Post[];
}

interface FeedProps {
  className?: string;
}

interface JwtPayload {
  userId: string;
}

export function Feed({ className }: FeedProps) {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [postBookmarks, setPostBookmarks] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setCurrentUserId(decoded.userId);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/post`);
        const data: ResponsePost = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
          // Depois de buscar posts, verificar bookmarks se o usuário estiver logado
          if (currentUserId) {
            checkUserBookmarks(data.data);
          }
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      }
    };
    fetchPosts();
  }, [currentUserId]);

  // Função para verificar quais posts o usuário já adicionou aos favoritos
  const checkUserBookmarks = async (postsToCheck: Post[]) => {
    if (!currentUserId) return;
    
    const bookmarkStatus: {[key: string]: boolean} = {};
    
    try {
      // Verificar status de bookmark para cada post
      for (const post of postsToCheck) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${post._id}/user/${currentUserId}/check`
        );
        const data = await response.json();
        bookmarkStatus[post._id] = data.isBookmarked;
      }
      
      setPostBookmarks(bookmarkStatus);
    } catch (error) {
      console.error("Erro ao verificar bookmarks:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!currentUserId) {
      alert("Usuário não autenticado");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("author", currentUserId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/post`, {
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
    if (isLiking || !currentUserId) return;
    setIsLiking(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/like/${postId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Erro ao processar a curtida");
      }
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (error) {
      console.error("Erro ao alternar curtida:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Nova função para alternar bookmark
  const handleToggleBookmark = async (postId: string) => {
    if (isBookmarking || !currentUserId) return;
    setIsBookmarking(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/bookmark/${postId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Erro ao processar o bookmark");
      }
  
      // Atualizar o estado local dos bookmarks
      setPostBookmarks(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      
      // Se a API retornar a lista atualizada de bookmarks, podemos atualizar o post
      if (data.bookmarks) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, bookmarks: data.bookmarks } : post
          )
        );
      }
    } catch (error) {
      console.error("Erro ao alternar bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const hasUserLikedPost = (post: Post) => {
    return currentUserId && post.likes.includes(currentUserId);
  };

  const hasUserBookmarkedPost = (postId: string) => {
    return postBookmarks[postId] || false;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="border-gray-800 bg-[#FFFFFF] text-[#212121]">
        <CardHeader className="flex-row gap-4 space-y-0 pb-2">
          <Avatar>
            <AvatarImage
              src="/photo-tiago-2.jpg"
              width={40}
              height={40}
              alt="Your avatar"
            />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="O que está pensando?"
              className="min-h-12 resize-none border-none bg-transparent p-0 text-[#212121] placeholder:text-[#5a5a5a] focus-visible:ring-0"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardFooter className="flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[#615fff] hover:text-[#615fff]/90">
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
            <div className="relative emoji-picker-container top-1">
              <button 
                className="emoji-button cursor-pointer text-[#615fff] hover:text-[#615fff]/90"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <SmilePlus />
              </button>
              {showEmojiPicker && (
                <div className="absolute left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    height={400}
                    width={500}
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            className="rounded-full bg-[#615fff] text-[#f5f5f5] hover:bg-[#615fff]/90"
            disabled={!postContent.trim()}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </CardFooter>
      </Card>

      <div className="">
        {posts.map((post) => (
          <Card key={post._id} className="border-gray-800 bg-[#FFFFFF] text-black">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Avatar>
                <AvatarImage
                  src={post.author?.profilePicture}
                  alt={post.author?.username || "Usuário desconhecido"}
                />
                <AvatarFallback>
                  {post.author?.username ? post.author.username[0] : "?"}
                </AvatarFallback>
              </Avatar>
                    <span className="text-sm text-gray-400">
                      {post.author?.username ? `@${post.author.username}` : "@desconhecido"}
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
                <p className="text-black">{post.content}</p>
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
              <Button
                variant="muted"
                size="sm"
                className={`gap-1 ${
                  hasUserLikedPost(post)
                    ? "text-red-500"
                    : "text-gray-400"
                } hover:text-red-500`}
                onClick={() => handleToggleLike(post._id)}
                disabled={isLiking}
              >
                {hasUserLikedPost(post) ? (
                  <Heart className="h-4 w-4 fill-current" /> 
                ) : (
                  <Heart className="h-4 w-4" /> 
                )}
                <span>{post.likes.length}</span>
              </Button>

              <Button
                variant="muted"
                size="sm"
                className="gap-1 text-gray-400 hover:text-[#615fff]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </Button>

              <Button
                variant="muted"
                size="sm"
                className="text-gray-400 hover:text-[#4CAF50]"
              >
                <Share className="h-4 w-4" />
              </Button>

              {/* Novo botão de bookmark */}
              <Button
                variant="muted"
                size="sm"
                className={`${
                  hasUserBookmarkedPost(post._id)
                    ? "text-[#615fff]"
                    : "text-gray-400"
                } hover:text-[#615fff]`}
                onClick={() => handleToggleBookmark(post._id)}
                disabled={isBookmarking}
              >
                {hasUserBookmarkedPost(post._id) ? (
                  <Bookmark className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}