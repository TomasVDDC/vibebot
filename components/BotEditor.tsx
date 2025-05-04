"use client";
import Chat from "@/components/Chat";
import BotInfo from "@/components/BotInfo";
import { answerSchema } from "@/app/api/chat/answer-schema";
import { useState } from "react";
import { Message } from "@/lib/messages";
import { experimental_useObject as useObject } from "@ai-sdk/react";

export default function BotEditor({ botId }: { botId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { submit, isLoading } = useObject({
    // When the submit function is called, it will call the /api/chat endpoint
    api: "/api/chat",
    schema: answerSchema,
    // The response from the /api/chat endpoint will be the object
    onFinish: async ({ object }) => {
      setMessages((prevMessages) => [...prevMessages, { content: object?.commentary ?? "" }]);

      try {
        const response = await fetch("/api/sandbox", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ botId, code: object?.code }),
        });

        if (!response.ok) {
          console.error("Failed to initialize sandbox");
        }
      } catch (error) {
        console.error("Error initializing sandbox:", error);
      }
    },
  });
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      <Chat messages={messages} setMessages={setMessages} isLoading={isLoading} submit={submit} />
      <div className="h-screen overflow-y-auto">
        <BotInfo botId={botId} isLoading={isLoading} />
      </div>
    </div>
  );
}
