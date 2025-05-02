export const toggleLike = async (postId: string, userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/like/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar a curtida");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro no serviço de like:", error);
      throw new Error(error.message || "Erro ao processar a curtida");
    }
  }