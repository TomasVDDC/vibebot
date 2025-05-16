import { z } from "zod";

export const answerSchema = z.object({
  answer: z
    .string()
    .describe(`Respond to the user's request by confirming that you will fulfill their request to create a Telegram bot based on their input.`),
  enhancedPrompt: z.string()
    .describe(`Enhance the user's original prompt for creating a Telegram bot by making it clear, specific, focusing on a minimal viable implementation. The enhanced prompt should include:
      - A clear statement of the bot's primary purpose based on the user's request.
      - Describe the essential features or commands to keep the implementation simple.
      Ensure the prompt remains true to the user's intent, avoids unnecessary complexity, and is actionable for generating reliable Claude code. Exclude advanced features like databases, inline keyboards, or external API integrations unless explicitly requested by the user.`),
  title: z.string().describe(`A short, descriptive title for the Telegram bot that summarizes its purpose or functionality.`),
});
