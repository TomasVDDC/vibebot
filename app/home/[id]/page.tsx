import BotHeader from "@/components/BotHeader";
import { Separator } from "@/components/ui/separator";
import BotEditor from "@/components/BotEditor";

export default async function BuildBot({ params }: { params: { id: string } }) {
  const botId = params.id;

  return (
    <div className="p-4">
      <BotHeader botId={botId} />
      <Separator />
      <BotEditor botId={botId} />
    </div>
  );
}
