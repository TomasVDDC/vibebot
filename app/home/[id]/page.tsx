import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BotHeader from "@/components/BotHeader";
import { Separator } from "@/components/ui/separator";
import { getBotCommands } from "@/app/actions/actions";
import PromptForm from "@/components/PromptForm";

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

      <Card className="mt-4 max-w-md">
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <PromptForm botId={botId} />
        </CardContent>
      </Card>

      <Card className="max-w-md mt-4">
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

      {/* <div className="flex flex-col items-center justify-center h-[600px]">
        <div className="text-center max-w-md px-6 py-8 rounded-lg shadow-md bg-white border border-gray-100">
          <h1 className="text-3xl font-bold font-dm-sans text-blue-600 mb-4">Congratulations! 🎉</h1>
          <h2 className="text-2xl font-bold font-dm-sans mb-4">You've successfully created your first bot!</h2>
          <p className="text-lg font-dm-sans text-gray-600 mb-6">Send a message to your bot and it will respond with a friendly "Hello".</p>
          <div className="mt-4 inline-block bg-blue-100 px-4 py-2 rounded-full">
            <p className="text-sm font-dm-sans text-blue-700">Your bot is now live and ready to chat!</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
