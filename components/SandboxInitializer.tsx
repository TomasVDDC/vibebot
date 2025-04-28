"use client";

import { useEffect } from "react";

export default function SandboxInitializer({ botId, prompt }: { botId: string; prompt: string }) {
  useEffect(() => {
    const initializeSandbox = async () => {
      try {
        const response = await fetch("/api/sandbox", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ botId, prompt }),
        });

        if (!response.ok) {
          console.error("Failed to initialize sandbox");
        }
      } catch (error) {
        console.error("Error initializing sandbox:", error);
      }
    };

    initializeSandbox();
  }, [botId]);

  return null; // This component doesn't render anything
}
