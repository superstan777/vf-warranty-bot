import { App } from "@microsoft/teams.apps";
import { DevtoolsPlugin } from "@microsoft/teams.dev";

const app = new App({
  plugins: [new DevtoolsPlugin()],
});

app.on("message", async ({ send, activity }) => {
  console.log(activity);

  const userName = activity.from?.name;
  console.log("Received message from:", userName);
  console.log("Message:", activity.text);

  await send({ type: "typing" });

  const response = await fetch(
    "https://vf-warranty.vercel.app/api/pending-notes/get",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_TOKEN}`,
      },
      body: JSON.stringify({ user_name: userName }),
    }
  );

  const data = await response.json().catch(() => null);

  console.log("Pending note response:", data);

  if (data?.hasPending === true) {
    await send(
      `🔔 **Masz pending note!**\nID: ${data.note?.id}\nStatus: ${data.note?.status}`
    );
  } else {
    await send("Nie masz żadnych pending notes 👍");
  }
});

app.start(process.env.PORT || 3978).catch(console.error);
