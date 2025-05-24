import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getBotInfo } from "@/app/actions/actions";
import DeployBotButton from "./DeployBotButton";
import DeleteBotButton from "./DeleteBotButton";

export default async function BotHeader({ botId }: { botId: string }) {
  const bot = await getBotInfo(botId);
  return (
    <div className="flex flex-col pb-2 md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${bot.username.charAt(0).toUpperCase()}`} />
          <AvatarFallback>{bot.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">@{bot.username}</h1>
          </div>
          <p className="text-muted-foreground">{bot.name}</p>
          <p className="text-sm mt-1">{bot.description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <DeployBotButton botId={botId} />

        <Button variant="default" asChild>
          <a href={`https://t.me/${bot.username}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Telegram
          </a>
        </Button>

        <DeleteBotButton botId={botId} />
      </div>
    </div>
  );
}
