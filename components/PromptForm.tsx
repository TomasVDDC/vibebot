"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SandboxInitializer from "@/components/SandboxInitializer";

export default function PromptForm({ botId }: { botId: string }) {
  const [prompt, setPrompt] = useState("");
  const [key, setKey] = useState(0); // Used to force re-render of SandboxInitializer

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKey((prev) => prev + 1); // Increment key to force re-render
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2  items-end mb-4">
        <div className="flex-1">
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt..." className="w-full" />
        </div>
        <Button type="submit" className="cursor-pointer">
          Submit
        </Button>
      </form>
      <SandboxInitializer key={key} botId={botId} prompt={prompt} />
    </>
  );
}
