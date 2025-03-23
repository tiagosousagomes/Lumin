import { CalendarDays, Link2, MapPin } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Feed } from "@/components/feed"
import { TopNavigation } from "@/components/top-navigation"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#222325] text-white">
      <TopNavigation />
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <div className="relative">
            <div className="h-48 w-full overflow-hidden rounded-xl bg-[#2a2b2d]">
              <Image src="/placeholder.svg?" height="300" width="1200" alt="Cover" className="h-full w-full object-cover" />
            </div> 
            <div className="absolute -bottom-16 left-4 rounded-full border-4 border-[#222325] bg-[#2a2b2d]">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-4 right-4">
              <Button className="rounded-full border border-gray-700 bg-transparent hover:bg-[#2a2b2d]">
                Edit profile
              </Button>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Jane Doe</h1>
              <p className="text-gray-400">@janedoe</p>
            </div>

            <p>UX/UI Designer | Creating digital experiences that delight users | Photography enthusiast</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                <a href="#" className="text-[#01dafd] hover:underline">
                  janedoe.design
                </a>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Joined March 2018</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold">542</span>
                <span className="text-gray-400">Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">12.8K</span>
                <span className="text-gray-400">Followers</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#2a2b2d]">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="replies">Replies</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-4">
              <Feed />
            </TabsContent>
            <TabsContent value="replies" className="mt-4">
              <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                <p className="text-gray-400">No replies yet</p>
              </Card>
            </TabsContent>
            <TabsContent value="media" className="mt-4">
              <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                <p className="text-gray-400">No media yet</p>
              </Card>
            </TabsContent>
            <TabsContent value="likes" className="mt-4">
              <Card className="flex h-40 items-center justify-center border-gray-800 bg-[#2a2b2d]">
                <p className="text-gray-400">No likes yet</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

