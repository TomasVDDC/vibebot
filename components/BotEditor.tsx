"use client";
import Chat from "@/components/Chat";
import BotInfo from "@/components/BotInfo";
import { answerSchema } from "@/app/api/chat/answer-schema";
import { Message } from "@/lib/messages";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBotCommands, getBotDescription, addChatMessage, getChatHistory } from "@/app/actions/actions";

export default function BotEditor({ botId }: { botId: string }) {
  const queryClient = useQueryClient();

  const { isLoading: isBotCommandsLoading, data: botCommands } = useQuery({
    queryKey: ["botCommands", botId],
    queryFn: () => getBotCommands(botId),
  });
  const { data: botDescription } = useQuery({
    queryKey: ["botDescription", botId],
    queryFn: () => getBotDescription(botId),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", botId],
    queryFn: () => getChatHistory(botId),
  });

  const { mutate: sendCodeToSandbox } = useMutation({
    mutationFn: async ({ botId, code }: { botId: string; code?: string }) => {
      // After 10 seconds, the botcommands will be refetched, this should really be a wehook. The server should send a message to the client when the sandbox is done running.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["botCommands", botId] });
        queryClient.invalidateQueries({ queryKey: ["botDescription", botId] });
      }, 5000); // 5 seconds

      return await fetch("/api/sandbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ botId, code }),
      });
    },
    onSuccess: () => {
      // Remove the immediate invalidation since we're handling it with setTimeout
    },
  });

  const { mutate: addMessage } = useMutation({
    mutationFn: async (newMessage: Message) => {
      await addChatMessage(botId, newMessage.role, newMessage.content);
      return newMessage;
    },
    onSuccess: () => {
      // Refetch to ensure UI reflects server state
      queryClient.invalidateQueries({ queryKey: ["messages", botId] });
    },
  });

  const { submit, isLoading } = useObject({
    // When the submit function is called, it will call the /api/chat endpoint
    api: "/api/chat",
    schema: answerSchema,
    // The response from the /api/chat endpoint will be the object
    onFinish: async ({ object }) => {
      addMessage({ content: object?.commentary ?? "", role: "assistant" });
      sendCodeToSandbox({ botId, code: object?.code });
    },
  });
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      <Chat messages={messages} addMessage={addMessage} isLoading={isLoading} submit={submit} />
      <div className="h-screen overflow-y-auto">
        <BotInfo isBotCommandsLoading={isBotCommandsLoading} botDescription={botDescription} botCommands={botCommands} />
      </div>
    </div>
  );
}
