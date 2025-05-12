"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deployBot } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";

export default function DeployBotButton({ botId }: { botId: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => deployBot(botId)} className="cursor-pointer">
            Deploy
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          <p>Launches your Telegram bot, making it active and ready to interact with users on the Telegram platform </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
