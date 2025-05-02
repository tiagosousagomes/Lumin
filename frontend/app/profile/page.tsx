"use client"

import { CalendarDays, Link2, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Feed } from "@/components/feed"
import { TopNavigation } from "@/components/top-navigation"
import Image from "next/image"
import { useParams } from "next/navigation"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

interface User {
  _id: string;
  name: string;
  username: string;
  bio: string;
  email: string;
  location: string;
  website?: string;
  avatar: {
    data: {
      type: string;
      data: number[];
    };
    contentType: string;
  };
  headerImage: {
    data: {
      type: string;
      data: number[];
    };
    contentType: string;
  };
  followers: string[];
  following: string[];
  createdAt: string;
}

interface JwtPayload {
  userId: string;
}

export default function ProfilePage() {
  const params = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    location: "",
    website: ""
  });
  const [files, setFiles] = useState({
    avatar: null as File | null,
    headerImage: null as File | null
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      const profileIdFromUrl = params.id as string;
      
      const token = Cookies.get("access_token");
      console.log("Token encontrado:", token);
      
      let tokenUserId = null;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          console.log("Token decodificado:", decoded);
          tokenUserId = decoded?.userId;
          setCurrentUserId(tokenUserId);
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
        }
      } else {
        console.warn("Token não encontrado.");
      }
      
      const profileIdToFetch = profileIdFromUrl || tokenUserId;
      
      console.log("Profile ID da URL:", profileIdFromUrl);
      console.log("User ID do token:", tokenUserId);
      console.log("ID que será usado:", profileIdToFetch);
      
      if (!profileIdToFetch) {
        console.error("No profile ID available");
        setError("ID de perfil não encontrado");
        setLoading(false);
        return;
      }
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_URL_SERVER}/user/${profileIdToFetch}`;
        console.log("API URL:", apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token || ''}`
          }
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Falha ao buscar dados do usuário (${response.status})`);
        }
        
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.success) {
          setUser(result.data);
          console.log("User data loaded successfully:", result.data._id);
          
          setFormData({
            name: result.data.name || "",
            username: result.data.username || "",
            bio: result.data.bio || "",
            email: result.data.email || "",
            location: result.data.location || "",
            website: result.data.website || ""
          });
        } else {
          throw new Error(result.message || 'Erro ao carregar perfil');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      alert('ID do usuário não encontrado');
      return;
    }

    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });

      if (files.avatar) {
        formDataToSend.append('avatar', files.avatar);
      }

      if (files.headerImage) {
        formDataToSend.append('headerImage', files.headerImage);
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_URL_SERVER}/user/${user._id}`;
      console.log("Update API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`Falha ao atualizar o perfil (${response.status})`);
      }

      const result = await response.json();
      console.log("Update response:", result);

      if (result.success) {
        setUser(result.data);
        setIsEditing(false);
        alert('Perfil atualizado com sucesso!');
      } else {
        throw new Error(result.message || 'Erro ao atualizar perfil');
      }

    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`Erro ao atualizar perfil: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const getImageUrl = (imageData: any) => {
    try {
      if (!imageData || !imageData.data) return "/placeholder.svg";

      const imageArray = imageData.data.data || imageData.data;

      const uint8Array = new Uint8Array(imageArray);

      const blob = new Blob([uint8Array], { type: imageData.contentType });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error converting image data to URL:", error);
      return "/placeholder.svg";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222325] text-white flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222325] text-white flex items-center justify-center">
        <p>Erro: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#222325] text-white flex items-center justify-center">
        <p>Usuário não encontrado</p>
      </div>
    );
  }

  const isOwnProfile = currentUserId === user._id;
  console.log("Is own profile:", isOwnProfile, "Current user:", currentUserId, "Profile user:", user._id);

  return (
    <div className="min-h-screen bg-[#222325] text-white">
      <TopNavigation />
      <div className="container mx-auto p-4">
        {isEditing ? (
          <div className="bg-[#2a2b2d] p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Localização</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Foto de perfil</label>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">Imagem de capa</label>
                <input
                  type="file"
                  name="headerImage"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded bg-[#222325] border border-gray-700 text-white"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-[#4B7CCC] hover:bg-[#4B7CCC]/90">
                  Salvar alterações
                </Button>
                <Button
                  type="button"
                  className="bg-transparent border border-gray-700 hover:bg-[#333]"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="h-48 w-full overflow-hidden rounded-xl bg-[#2a2b2d]">
                <Image
                  src={user.headerImage ? getImageUrl(user.headerImage) : "/placeholder.svg"}
                  height={300}
                  width={1200}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-16 left-4 rounded-full border-4 border-[#222325] bg-[#2a2b2d]">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={user.avatar ? getImageUrl(user.avatar) : "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
              </div>
              {isOwnProfile && (
                <div className="absolute bottom-4 right-4">
                  <Button
                    className="rounded-full border border-gray-700 bg-transparent hover:bg-[#2a2b2d]"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar perfil
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-16 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-400">@{user.username}</p>
              </div>

              <p>{user.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1">
                    <Link2 className="h-4 w-4" />
                    <a href={user.website} className="text-[#4B7CCC] hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Entrou em {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{user.following?.length || 0}</span>
                  <span className="text-gray-400">Seguindo</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{user.followers?.length || 0}</span>
                  <span className="text-gray-400">Seguidores</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[#2a2b2d]">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="replies">Respostas</TabsTrigger>
                <TabsTrigger value="media">Mídia</TabsTrigger>
                <TabsTrigger value="likes">Curtidas</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4">
                <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                  <p className="text-gray-400">Nenhum post ainda</p>
                </Card>
              </TabsContent>
              <TabsContent value="replies" className="mt-4">
                <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                  <p className="text-gray-400">Nenhuma resposta ainda</p>
                </Card>
              </TabsContent>
              <TabsContent value="media" className="mt-4">
                <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                  <p className="text-gray-400">Nenhuma mídia ainda</p>
                </Card>
              </TabsContent>
              <TabsContent value="likes" className="mt-4">
                <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                  <p className="text-gray-400">Nenhuma curtida ainda</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}