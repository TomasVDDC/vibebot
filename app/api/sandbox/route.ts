import "dotenv/config";
import { Sandbox } from "@e2b/code-interpreter";
import { getBotToken } from "@/app/actions/actions";
import { generateInitialPrompt } from "@/app/api/chat/prompt";

const TIMEOUT = 180_000; // in ms

export async function POST(req: Request) {
  console.log("Starting sandbox");
  type SandboxRequestBody = {
    botId: string;
    enhancedPrompt?: string;
    existingBotCode?: string;
  };
  const { botId, enhancedPrompt, existingBotCode }: SandboxRequestBody = await req.json();
  const botToken = await getBotToken(botId);
  if (!botToken) {
    return new Response("Bot not found", { status: 404 });
  }

  const runningSandboxes = await Sandbox.list();
  const sandbox = runningSandboxes.find((sandbox) => sandbox.metadata?.botId === botId);

  let sbx;
  if (sandbox) {
    console.log("CONNECTING TO EXISTING SANDBOX");
    sbx = await Sandbox.connect(sandbox.sandboxId);
  } else {
    console.log("CREATING NEW SANDBOX");
    sbx = await Sandbox.create("up2804tjykjwxv6uvbel", {
      metadata: {
        botId: botId,
      },
      timeoutMs: TIMEOUT,
      envs: { [`BOT_TOKEN_${botId}`]: botToken, PORT: process.env.SANDBOX_PORT!, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY! },
    });
  }

  const domain = sbx.getHost(Number(process.env.SANDBOX_PORT));

  const initialPrompt = generateInitialPrompt(botId);
  const completedPrompt = initialPrompt + enhancedPrompt;
  try {
    await sbx.files.write("./prompt.txt", completedPrompt);
  } catch (error) {
    console.error("Error writing prompt to sandbox", error);
  }

  const commands = await sbx.commands.list();
  console.log("EXISTING COMMANDS", commands);
  // Kill all running commands for that sandbox
  for (const command of commands) {
    // When we kill this error is thrown: Error [CommandExitError]: signal: killed, and the request returns with POST /api/sandbox 500, this is good
    // that way we don't have multiple requests to this route running at the same time. My issue is that I don't seem able to catch it with try/catch
    await sbx.commands.kill(command.pid);
  }
  const commandstemp = await sbx.commands.list();
  for (const command of commandstemp) {
    console.log("COMMAND", command.args);
  }

  if (existingBotCode) {
    console.log("RUNNING EXISTING BOT CODE");

    try {
      await sbx.files.write("./bot.js", existingBotCode);
    } catch (error) {
      console.error("Error writing existing bot code to sandbox", error);
    }
  }

  // Start hot reloading the bot,
  // delay is needed because nodemon restarts faster than the KILL signal is sent
  await sbx.commands.run("nodemon --delay 200ms run-server-template-code.js", {
    envs: { WEBHOOK_DOMAIN: domain },
    background: true,
    onStdout: (data) => console.log("stdout:", data),
    onStderr: (data) => console.error("stderr:", data),
    timeoutMs: TIMEOUT,
  });

  // If existing bot code is not provided, we need to generate the bot code with claude code
  if (!existingBotCode) {
    console.log("RUNNING CLAUDE");

    await sbx.commands.run(
      'cat /home/user/prompt.txt | claude -c -p --output-format stream-json "Execute on these instructions" > /home/user/claude.log 2>&1',
      {
        background: true, // run the command in the background, will return immediately and command will continue to run in the sandbox

        onStdout: (data) => console.log("stdout:", data),
        onStderr: (data) => console.error("stderr:", data),
        timeoutMs: TIMEOUT,
      }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
