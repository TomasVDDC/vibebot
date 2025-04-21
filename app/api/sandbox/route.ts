import "dotenv/config";
import { Sandbox } from "@e2b/code-interpreter";
import { getBotToken } from "@/app/actions/actions";

export async function POST(req: Request) {
  console.log("Starting sandbox");
  const { botId } = await req.json();
  const botToken = await getBotToken(botId);
  console.log(botToken);
  if (!botToken) {
    return new Response("Bot not found", { status: 404 });
  }

  const sbx = await Sandbox.create("up2804tjykjwxv6uvbel", {
    timeoutMs: 60000,
    envs: { BOT_TOKEN_NEWBOT: botToken, PORT: process.env.SANDBOX_PORT! },
  });

  const domain = sbx.getHost(Number(process.env.SANDBOX_PORT));

  const result4 = await sbx.commands.run("node bot-template-code.js", {
    envs: { WEBHOOK_DOMAIN: domain },
    onError: (error) => console.error("error:", error),
    onStdout: (data) => console.log("stdout:", data),
    onStderr: (data) => console.error("stderr:", data),
  });

  // Return a success response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
