import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BotHeader from "@/components/BotHeader";
import { Separator } from "@/components/ui/separator";
import { getBotCommands } from "@/app/actions/actions";
import Chat from "@/components/Chat";

type BotCommands = {
  command: string;
  description: string;
};

export default async function BuildBot(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const botId = params.id;
  const botCommands = await getBotCommands(botId);

  return (
    <div className="p-4">
      <BotHeader botId={botId} />
      <Separator />
      <div className="flex flex-row justify-between gap-4">
        <Chat botId={botId} />
        <Card className="max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle>Bot Commands</CardTitle>
          </CardHeader>
          <CardContent>
            {botCommands.map((command: BotCommands) => (
              <div key={command.command}>
                <p>{command.command}</p>
                <p>{command.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
