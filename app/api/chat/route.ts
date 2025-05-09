import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { answerSchema } from "./answer-schema";
import { promptStart } from "./prompt";
import { instructions } from "./instructions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, useInitialCodeTemplate } = await req.json();
  console.log("isInitialCodeTemplate", useInitialCodeTemplate);

  let completePrompt;
  if (useInitialCodeTemplate) {
    // In this case the prompt is only the first message of the user that we set for him to get started, so promptStart contain some generic code for a starter bot
    completePrompt = promptStart + prompt;
  } else {
    // In this case the prompt should contain the previous code of the bot
    completePrompt = instructions + prompt;
  }
  console.log("completePrompt", completePrompt);

  try {
    const result = streamObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: answerSchema,
      prompt: completePrompt,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error streaming object:", error);
    return new Response("Error streaming object", { status: 500 });
  }
}
