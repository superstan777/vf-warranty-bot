export async function processUserMessage(
  userName: string,
  messageText: string
): Promise<string> {
  try {
    const response = await fetch(
      "https://vf-warranty.vercel.app/api/pending-notes/process-message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_TOKEN}`,
        },
        body: JSON.stringify({
          user_name: userName,
          content: messageText,
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!data) {
      return "Error: no response from server.";
    }

    return data.message || "Unknown server response.";
  } catch (err) {
    console.error("Error contacting backend:", err);
    return "Communication error with backend. Please try again later.";
  }
}
