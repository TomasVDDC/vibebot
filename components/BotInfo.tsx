import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotCommands } from "@/lib/bots";
import { useEffect, useState } from "react";
import { getBotCommands, getBotDescription } from "@/app/actions/actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function BotInfo({ botId, isLoading }: { botId: string; isLoading: boolean }) {
  const [botCommands, setBotCommands] = useState<BotCommands[]>([]);
  const [botDescription, setBotDescription] = useState<string>("");
  useEffect(() => {
    const updateBotCommands = async () => {
      const botCommands = await getBotCommands(botId);
      setBotCommands(botCommands);
    };
    const updateBotDescription = async () => {
      const botDescription = await getBotDescription(botId);
      setBotDescription(botDescription);
    };
    updateBotCommands();
    updateBotDescription();
  }, [botId]);

  return (
    <>
      {/* Bot Description Card */}
      <Card className="max-w-md min-w-[300px] mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Bot Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{botDescription}</CardContent>
      </Card>
      {/* Bot Commands Card */}
      <Card className="max-w-md min-w-[300px] mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Bot Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            botCommands?.map((command: BotCommands) => (
              <div key={command.command} className="rounded-lg border bg-card p-2 transition-colors hover:bg-accent/50">
                <p className="font-mono text-sm font-medium text-primary pl-4"> {`/${command.command}`}</p>
                <p className="text-sm text-muted-foreground pl-4">{command.description}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
