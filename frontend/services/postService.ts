export async function toggleLike(postId: string, userId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER_LIKE}`, {
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