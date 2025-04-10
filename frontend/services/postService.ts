export async function toggleLike(postId: string, userId: string) {
    const response = await fetch(`${process.env.URL_SERVER}/like/post/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error("Erro ao alternar like");
    }

    return response.json();
}