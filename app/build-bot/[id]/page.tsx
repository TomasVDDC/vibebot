import BotDetails from "@/components/BotDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export default async function BuildBot(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const botId = params.id;

  return (
    <div>
      <BotDetails botId={botId} />

      <div className="flex justify-center items-center my-12">
        <Alert className="w-1/2">
          <AlertTitle>Your bot is live!</AlertTitle>
          <AlertDescription>You can now interact with on Telegram. Send a message to start chatting with your bot.</AlertDescription>
        </Alert>
      </div>

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
