import { Feed } from "@/components/feed"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
export default function Home() {

  const trends = [
    {
      category: "Futebol",
      hashtag: "#NeymarTraiu?",
      posts: "15.2K",
    },
    {
      category: "Tecnologia",
      hashtag: "#gatosIA",
      posts: "12.8K",
    },
    {
      category: "Gaming",
      hashtag: "#OutlastSuperestimado",
      posts: "9.7K",
    },
    {
      category: "Musica",
      hashtag: "#AdeleQueen",
      posts: "18.3K",
    },
    {
      category: "Filmes",
      hashtag: "#Inception",
      posts: "7.5K",
    },
  ]
  return (
    <div className="min-h-screen bg-[#222325] text-white">
      <TopNavigation />
      <div className="container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-4 lg:grid-cols-7">
        <Sidebar className="hidden md:block md:col-span-1 lg:col-span-2" />
        <Feed className="md:col-span-3 lg:col-span-3" />
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-20 rounded-xl bg-[#2a2b2d] p-4">
            <h2 className="mb-4 text-xl font-bold">Trending</h2>
            <div className="space-y-4">
              {trends.map((trends,i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm text-gray-400">Trends: {trends.category}</p>
                  <p className="font-medium">{trends.hashtag}</p>
                  <p className="text-sm text-gray-400">{trends.posts}</p>
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

