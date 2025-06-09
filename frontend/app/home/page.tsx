"use client";

import { Feed } from "@/components/feed"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie";

export default function Home() {

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token){
      router.push("/")
    }
  }, [])

  const trends = [
   
    {
      category: "Provas",
      hashtag: "#Calculo2Desafia",
      posts: "18.9K",
    },
    {
      category: "Trote",
      hashtag: "#TroteSolidario",
      posts: "12.4K",
    },
    {
      category: "Carreira",
      hashtag: "#Estagios2025",
      posts: "15.7K",
    },
    {
      category: "Dúvidas",
      hashtag: "#ComoFazerTCC",
      posts: "22.1K",
    },
    {
      category: "Greve",
      hashtag: "#ProfessoresEmGreve",
      posts: "14.5K",
    },
   
    {
      category: "Cultura",
      hashtag: "#FestivalUniversitário",
      posts: "6.7K",
    }
];
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#615fff]">
      <TopNavigation />
      <div className="container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-4 lg:grid-cols-7">
        <Sidebar className="hidden md:block md:col-span-1 lg:col-span-2" />
        <Feed className="md:col-span-3 lg:col-span-3" />
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-20 rounded-xl bg-[#FFFFFF] p-4">
            <h2 className="mb-4 text-xl font-bold">Trending</h2>
            <div className="space-y-3">
              {trends.map((trends,i) => (
                <div key={i} className="space-y-[1px]">
                  <p className="text-sm text-[#212121]">Trends: {trends.category}</p>
                  <div className="flex ali">
                   <p className="font-medium">{trends.hashtag}</p>
                  </div>
                   <p className="font-sm text-[#212121]"> {trends.posts} posts</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[#4B7CCC] hover:underline">veja mais</button>
          </div>
        </div>
      </div>
    </div>
  )
}
