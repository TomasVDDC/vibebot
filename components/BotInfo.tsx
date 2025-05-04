import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotCommands } from "@/lib/bots";

import { Skeleton } from "@/components/ui/skeleton";

export default function BotInfo({
  isBotCommandsLoading,
  botDescription,
  botCommands,
}: {
  isBotCommandsLoading: boolean;
  botDescription: string;
  botCommands: BotCommands[];
}) {
  return (
    <>
      {/* Bot Description Card */}
      <Card className="max-w-md min-w-[300px] mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Bot Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!botDescription ? (
            <p className="text-sm text-muted-foreground">The bot description will be displayed here when available.</p>
          ) : (
            botDescription
          )}
        </CardContent>
      </Card>
      {/* Bot Commands Card */}
      <Card className="max-w-md min-w-[300px] mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Bot Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBotCommandsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !botCommands?.length ? (
            <p className="text-sm text-muted-foreground">Bot commands will be shown here once configured.</p>
          ) : (
            botCommands.map((command: BotCommands) => (
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
