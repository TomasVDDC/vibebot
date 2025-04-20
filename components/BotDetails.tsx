import { getBotName } from "@/app/actions/actions";

export default async function BotDetails({ botId }: { botId: string }) {
  const botName = await getBotName(botId);

  return (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm font-dm-sans">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Bot Details</h2>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-lg">🤖</span>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-dm-sans">Bot Name</p>
          <p className="text-base font-dm-sans">{botName}</p>
        </div>
      </div>
    </div>
  );
}
