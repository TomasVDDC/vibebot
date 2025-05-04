import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { answerSchema } from "./answer-schema";
import { promptStart } from "./prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const completePrompt = promptStart + prompt;
  console.log("This is the final prompt\n", completePrompt);

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

// import { anthropic } from "@ai-sdk/anthropic";
// import { generateObject } from "ai";
// import dotenv from "dotenv";
// import { answerSchema } from "./answer-schema";
// import { promptStart } from "./prompt";
// dotenv.config();

// export async function POST(req: Request) {
//   console.log("Starting chat");
//   const { prompt } = await req.json();
//   const completePrompt = promptStart + prompt;

//   const { object } = await generateObject({
//     model: anthropic("claude-3-5-sonnet-20241022"),
//     schema: answerSchema,
//     prompt: completePrompt,
//   });

//   console.log(JSON.stringify(object, null, 2));

//   return new Response(JSON.stringify(object), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
