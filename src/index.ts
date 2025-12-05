import { App } from "@microsoft/teams.apps";
import { DevtoolsPlugin } from "@microsoft/teams.dev";

const isProd = process.env.NODE_ENV === "production";

const app = new App({
  plugins: isProd ? [] : [new DevtoolsPlugin()],
});
app.on("message", async ({ send, activity }) => {
  const userName = activity.from?.name;

  await send({ type: "typing" });

  const response = await fetch(
    "https://vf-warranty.vercel.app/api/pending-notes/process-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_TOKEN}`,
      },
      body: JSON.stringify({ user_name: userName, content: activity.text }),
    }
  );

  const data = await response.json().catch(() => null);

  await send(data.message);
});

app.start(process.env.PORT || 3978).catch(console.error);
