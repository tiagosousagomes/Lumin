import { TopNavigation } from "@/components/top-navigation";


interface Post {
   content:string,
   author:string,
   likes:[],
   comments:[]
   
 }
 
 interface ApiResponse {
   data: Post[];
 }

export default async function notificationsPage(){
   
   const response = await fetch('http://localhost:3005/api/post')

   if(!response.ok){
      throw new Error(`Erro na requisição: ${response.status}`)
   }
   const posts:ApiResponse = await response.json()
   console.log(posts)
 return(
   <>
    <TopNavigation/>
   <ul>
      {posts.data.map((post) =>(
         <li key={post.author}>{post.content}</li>
      ))}
   </ul> 
    </>
    
 )
   

}