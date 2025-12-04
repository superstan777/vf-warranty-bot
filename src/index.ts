import { App } from "@microsoft/teams.apps";
import { DevtoolsPlugin } from "@microsoft/teams.dev";

const app = new App({
  plugins: [new DevtoolsPlugin()],
});

app.on("message", async ({ send, activity }) => {
  const userName = activity.from?.name;
  const messageText = activity.text?.trim();

  if (!userName || !messageText) {
    await send("Unable to read message or user information.");
    return;
  }

  await send({ type: "typing" });

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
      await send("Error: no response from server.");
      return;
    }

    await send(data.message);
  } catch (err) {
    console.error("Error sending request to backend:", err);
    await send("Communication error with backend. Please try again later.");
  }
});
