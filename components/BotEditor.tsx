"use client";
import Chat from "@/components/Chat";
import BotInfo from "@/components/BotInfo";
import { answerSchema } from "@/app/api/chat/answer-schema";
import { Message } from "@/lib/messages";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBotCommands, getBotDescription, addChatMessage, getChatHistory, getLatestBotCode, getSandboxStatus } from "@/app/actions/actions";
import { useState, useEffect } from "react";

export default function BotEditor({ botId }: { botId: string }) {
  //const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [isGeneratingBot, setIsGeneratingBot] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading: isBotCommandsLoading, data: botCommands } = useQuery({
    queryKey: ["botCommands", botId],
    queryFn: () => getBotCommands(botId),
    refetchInterval: 5000,
  });
  const { data: botDescription } = useQuery({
    queryKey: ["botDescription", botId],
    queryFn: () => getBotDescription(botId),
    refetchInterval: 5000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", botId],
    queryFn: () => getChatHistory(botId),
  });

  const { data: latestBotCode } = useQuery({
    queryKey: ["latestBotCode", botId],
    queryFn: () => getLatestBotCode(botId),
  });

  // Polling the sandbox status
  const { data: sandboxStatus } = useQuery({
    queryKey: ["sandboxStatus", botId],
    queryFn: () => getSandboxStatus(botId),
    refetchInterval: 5000,
  });

  // Handle status changes in an effect
  useEffect(() => {
    if (sandboxStatus?.currentTask?.tasks) {
      const allTasksCompleted =
        sandboxStatus.currentTask.tasks.length > 0 && sandboxStatus.currentTask.tasks.every((task) => task.status === "completed");

      if (allTasksCompleted) {
        setIsGeneratingBot(false);
        // Set isBotRunning to true when todos are completed and sandbox is running
        setIsBotRunning(sandboxStatus.status === "running");
      } else {
        setIsBotRunning(false);
      }
    } else {
      setIsBotRunning(false);
    }
  }, [sandboxStatus]);

  const { mutate: startSandbox } = useMutation({
    mutationFn: async ({ botId, enhancedPrompt }: { botId: string; enhancedPrompt?: string; existingBotCode?: string }) => {
      // After 10 seconds, the botcommands will be refetched, this should really be a webhook.
      // The server should send a message to the client when the code on the sandbox is executed.
      // setTimeout(() => {
      //   queryClient.invalidateQueries({ queryKey: ["botCommands", botId] });
      //   queryClient.invalidateQueries({ queryKey: ["botDescription", botId] });
      // }, 2000);

      const response = await fetch("/api/sandbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ botId, enhancedPrompt: enhancedPrompt }),
      });

      return response.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sandboxStatus", botId] });
    },
  });

  const { mutateAsync: addMessage } = useMutation({
    mutationFn: async (newMessage: Message) => {
      const messageId = await addChatMessage(botId, newMessage.role, newMessage.content);
      return messageId;
    },
    onSuccess: () => {
      // Refetch to ensure UI reflects server state
      queryClient.invalidateQueries({ queryKey: ["messages", botId] });
    },
  });

  const { submit } = useObject({
    // When the submit function is called, it will call the /api/chat endpoint
    api: "/api/chat",
    schema: answerSchema,
    // The response from the /api/chat endpoint will be the object
    onFinish: async ({ object }) => {
      await addMessage({ content: object?.answer ?? "", role: "assistant" });
      startSandbox({ botId, enhancedPrompt: object?.enhancedPrompt ?? "" });
    },
  });

  const handleSubmit = async (prompt: { prompt: string; botId: string }) => {
    setIsGeneratingBot(true);
    submit(prompt);
  };

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4">
      <div className="flex flex-col items-center  h-screen">
        <Chat
          messages={messages}
          addMessage={addMessage}
          submit={handleSubmit}
          latestBotCode={latestBotCode ?? ""}
          botId={botId}
          currentTasks={sandboxStatus?.currentTask?.tasks}
          isGeneratingBot={isGeneratingBot}
          isBotRunning={isBotRunning}
        />
      </div>
      <div className="h-screen overflow-y-auto border-l border-gray-300 bg-gray-50">
        <BotInfo isBotCommandsLoading={isBotCommandsLoading} botDescription={botDescription} botCommands={botCommands} />
      </div>
    </div>
  );
}
