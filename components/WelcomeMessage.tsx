// components/WelcomeMessage.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WelcomeMessage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the message has been shown before
    const hasSeenMessage = localStorage.getItem("hasSeenWelcomeMessage");
    if (!hasSeenMessage) {
      setOpen(true);
      // Set the flag in localStorage
      localStorage.setItem("hasSeenWelcomeMessage", "true");
    }
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to VibeBot Builder! 🤖</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Get started building your custom bot in just two simple steps:</p>
            <ol className="list-decimal pl-4 pt-2">
              <li>Send a message in the chat describing the bot you want to create</li>
              <li>Once built, check your Telegram app to see your bot in action!</li>
            </ol>
            <p className="pt-2">It&apos;s that easy! Start chatting to bring your bot idea to life.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
