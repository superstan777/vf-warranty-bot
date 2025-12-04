import { App } from "@microsoft/teams.apps";
import { DevtoolsPlugin } from "@microsoft/teams.dev";
import { processUserMessage } from "./handlers/processUserMessage";

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

  const reply = await processUserMessage(userName, messageText);

  await send(reply);
});
