"use client";
import Chat from "@/components/Chat";
import BotInfo from "@/components/BotInfo";
import { answerSchema } from "@/app/api/chat/answer-schema";
import { Message } from "@/lib/messages";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBotCommands,
  getBotDescription,
  addChatMessage,
  getChatHistory,
  addBotCode,
  getLatestBotCode,
  getSandboxStatus,
} from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function BotEditor({ botId }: { botId: string }) {
  //const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  //const [sandboxId, setSandboxId] = useState<string | null>(null);

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

  const { mutate: sendCodeToSandbox, isPending: isSandboxBootingUp } = useMutation({
    mutationFn: async ({ botId, code }: { botId: string; code?: string }) => {
      // After 10 seconds, the botcommands will be refetched, this should really be a webhook. The server should send a message to the client when the code on the sandbox is executed.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["botCommands", botId] });
        queryClient.invalidateQueries({ queryKey: ["botDescription", botId] });
      }, 2000);

      const response = await fetch("/api/sandbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ botId, code }),
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

  const { submit, isLoading } = useObject({
    // When the submit function is called, it will call the /api/chat endpoint
    api: "/api/chat",
    schema: answerSchema,
    // The response from the /api/chat endpoint will be the object
    onFinish: async ({ object }) => {
      console.log("Response from /api/chat", object);
      const messageId = await addMessage({ content: object?.commentary ?? "", role: "assistant" });
      // We associate the code with a specific messageId, if the message is deleted, the messageId will be set to null, but the code entries remain.

      addBotCode(botId, messageId, object?.code ?? "");
      queryClient.invalidateQueries({ queryKey: ["latestBotCode", botId] });
      sendCodeToSandbox({ botId, code: object?.code ?? "" });
    },
  });

  const handleStartSandbox = async () => {
    console.log("latestBotCode in handleStartSandbox", latestBotCode);
    if (latestBotCode) {
      sendCodeToSandbox({ botId, code: latestBotCode });
    } else {
      const prompt = "Please write a simple bot that says hello";
      submit({ prompt, useInitialCodeTemplate: true, botId });
      addMessage({ content: prompt, role: "user" });
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      {sandboxStatus?.status === "running" ? (
        <Chat messages={messages} addMessage={addMessage} isLoading={isLoading} submit={submit} latestBotCode={latestBotCode ?? ""} botId={botId} />
      ) : (
        <Card className="mt-6 mx-auto h-[300px] w-[400px] shadow-2xl  border-2 border-muted-foreground/10">
          <CardHeader className="flex flex-col items-center justify-center gap-2 pt-8 pb-2">
            <AlertCircle className="text-primary w-10 h-10 mb-2" />
            <CardTitle className="text-center">Sandbox is not running</CardTitle>
            <p className="text-muted-foreground text-center text-sm font-normal mt-1">You need to start the sandbox to edit your bot.</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <Button className="mt-2 w-40 px-6 py-2 text-base font-semibold cursor-pointer" onClick={() => handleStartSandbox()} variant="default">
              {isLoading || isSandboxBootingUp ? <Loader2 className="animate-spin" /> : "Start Sandbox"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="h-screen overflow-y-auto">
        <BotInfo isBotCommandsLoading={isBotCommandsLoading} botDescription={botDescription} botCommands={botCommands} />
      </div>
    </div>
  );
}
