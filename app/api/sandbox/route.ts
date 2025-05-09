import "dotenv/config";
import { Sandbox } from "@e2b/code-interpreter";
import { getBotToken } from "@/app/actions/actions";

const TIMEOUT = 180_000; // in ms

export async function POST(req: Request) {
  console.log("Starting sandbox");
  const { botId, code } = await req.json();
  const botToken = await getBotToken(botId);
  if (!botToken) {
    return new Response("Bot not found", { status: 404 });
  }

  const runningSandboxes = await Sandbox.list();
  console.log("runningSandboxes", runningSandboxes);

  const sandbox = runningSandboxes.find((sandbox) => sandbox.metadata?.botId === botId);

  let sbx;
  if (sandbox) {
    console.log("Sandbox already exists, connecting to it");
    sbx = await Sandbox.connect(sandbox.sandboxId);
  } else {
    console.log("Sandbox does not exist, creating a new one");
    sbx = await Sandbox.create("up2804tjykjwxv6uvbel", {
      metadata: {
        botId: botId,
      },
      timeoutMs: TIMEOUT,
      envs: { BOT_TOKEN_NEWBOT: botToken, PORT: process.env.SANDBOX_PORT! },
    });
  }

  const domain = sbx.getHost(Number(process.env.SANDBOX_PORT));

  await sbx.files.write("bot-template-code.js", code);
  console.log(`Copied file to bot-template-code.js in ${sbx.sandboxId}`);

  const commands = await sbx.commands.list();
  console.log("commands", commands);
  // Kill all running commands for that sandbox
  for (const command of commands) {
    // When we kill this error is thrown: Error [CommandExitError]: signal: killed, and the request returns with POST /api/sandbox 500, this is good
    // that way we don't have multiple requests to this route running at the same time. My issue is that I don't seem able to catch it with try/catch
    await sbx.commands.kill(command.pid);
  }

  await sbx.commands.run("node bot-template-code.js", {
    background: true, // run the command in the background, will return immediately and command will continue to run in the sandbox
    envs: { WEBHOOK_DOMAIN: domain },
    onStdout: (data) => console.log("stdout:", data),
    onStderr: (data) => console.error("stderr:", data),
    timeoutMs: TIMEOUT,
  });

  // Return a success response, always success seems strange
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
