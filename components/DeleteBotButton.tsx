"use client";

import { deleteBot } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteBotButton({ botId }: { botId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive">
          Delete Bot
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your bot will stop working immediately, and will be removed from our database. The bot will still exist on your telegram account. <br />
            <br />
            You can reuse the same bot token to create a new bot.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => deleteBot(botId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
