import BotHeader from "@/components/BotHeader";
import { Separator } from "@/components/ui/separator";
import BotEditor from "@/components/BotEditor";

export default async function BuildBot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log(id);

  return (
    <div className="p-4">
      <BotHeader botId={id} />
      <Separator />
      <BotEditor botId={id} />
    </div>
  );
}
