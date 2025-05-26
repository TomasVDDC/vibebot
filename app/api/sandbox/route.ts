import "dotenv/config";
import { Sandbox } from "@e2b/code-interpreter";
import { getLatestBotCode, getBotToken } from "@/app/actions/actions";
import { generateInitialPrompt } from "@/app/api/chat/prompt";

const TIMEOUT = 300_000; // in ms

export async function POST(req: Request) {
  console.log("Starting sandbox");
  type SandboxRequestBody = {
    botId: string;
    enhancedPrompt?: string;
  };
  const { botId, enhancedPrompt }: SandboxRequestBody = await req.json();
  const botToken = await getBotToken(botId);
  if (!botToken) {
    return new Response("Bot not found", { status: 404 });
  }

  const runningSandboxes = await Sandbox.list();
  const sandbox = runningSandboxes.find((sandbox) => sandbox.metadata?.botId === botId);

  let sbx;
  if (sandbox) {
    console.log("[INFO] SANDBOX: Connecting to existing sandbox");
    sbx = await Sandbox.connect(sandbox.sandboxId);
    //reset the timeout everytime a message is sent
    sbx.setTimeout(TIMEOUT);
  } else {
    console.log("[INFO] SANDBOX: Creating new sandbox");
    sbx = await Sandbox.create("up2804tjykjwxv6uvbel", {
      metadata: {
        botId: botId,
      },
      timeoutMs: TIMEOUT,

      envs: { [`BOT_TOKEN_${botId}`]: botToken, PORT: process.env.SANDBOX_PORT!, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY! },
    });

    const domain = sbx.getHost(Number(process.env.SANDBOX_PORT));
    // Start hot reloading the bot,
    // This should really be called during the sandbox creation (in the template).
    // That way we don't have to start and kill the nodemon process every time we want to run the bot.
    // delay is needed because nodemon restarts faster than the KILL signal is sent
    await sbx.commands.run("nodemon run-server-template-code.js", {
      envs: { WEBHOOK_DOMAIN: domain },
      background: true,
      onStdout: (data) => console.log("INFO NODEMON:", data),
      onStderr: (data) => console.error("ERROR NODEMON:", data),
      timeoutMs: TIMEOUT * 10,
    });
  }

  await sbx.commands.run(`rm -f /home/user/.claude/todos/*`, {
    onStdout: (data) => console.log("stdout:", data),
    onStderr: (data) => console.error("stderr:", data),
    timeoutMs: TIMEOUT,
  });

  const initialPrompt = generateInitialPrompt(botId);
  const completePrompt = initialPrompt + enhancedPrompt;
  try {
    await sbx.files.write("./prompt.txt", completePrompt);
  } catch (error) {
    console.error("Error writing prompt to sandbox", error);
  }

  const commands = await sbx.commands.list();
  console.log("[INFO] SANDBOX: Existing commands", commands);

  const latestBotCode = await getLatestBotCode(botId);
  if (latestBotCode === "") {
    console.log(`[INFO] SANDBOX: No bot code found for botId: ${botId}`);
  } else {
    console.log("[INFO] SANDBOX: Bot code found", latestBotCode);
  }

  try {
    await sbx.files.write("./bot.js", latestBotCode);
  } catch (error) {
    console.error("[ERROR] SANDBOX: Error writing existing bot code to sandbox", error);
  }

  console.log("[INFO] SANDBOX: Running claude");

  await sbx.commands.run(
    'cat /home/user/prompt.txt | claude -c --verbose -p --output-format stream-json "Execute on these instructions" > /home/user/claude.log 2>&1',
    {
      background: true, // run the command in the background, will return immediately and command will continue to run in the sandbox

      onStdout: (data) => console.log("CLAUDE STDOUT:", data),
      onStderr: (data) => console.error("CLAUDE STDERR:", data),
      timeoutMs: TIMEOUT,
    }
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
