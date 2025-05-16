import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { answerSchema } from "./answer-schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("Prompt received by the chat route:", prompt);

  try {
    const result = streamObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: answerSchema,
      prompt: prompt,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error streaming object:", error);
    return new Response("Error streaming object", { status: 500 });
  }
}
