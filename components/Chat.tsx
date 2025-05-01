"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Message } from "@/lib/messages";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { answerSchema } from "@/app/api/chat/answer-schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";

export default function Chat({ botId }: { botId: string }) {
  const [messages, setMessages] = useState<Message[]>([{ content: "Hello, how are you?" }]);

  const { submit, isLoading } = useObject({
    // When the submit function is called, it will call the /api/chat endpoint
    api: "/api/chat",
    schema: answerSchema,
    // The response from the /api/chat endpoint will be the object
    onFinish: async ({ object }) => {
      setMessages((prevMessages) => [...prevMessages, { content: object?.commentary ?? "" }]);

      try {
        const response = await fetch("/api/sandbox", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ botId, code: object?.code }),
        });

        if (!response.ok) {
          console.error("Failed to initialize sandbox");
        }
      } catch (error) {
        console.error("Error initializing sandbox:", error);
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Later we can have a new set that is the input inside of the from and when submit is pressed we can add that to the messages
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt") as string;
    setMessages([...messages, { content: prompt }]);
    submit({ prompt });
    console.log(messages);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto p-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${index % 2 === 0 ? "bg-primary/10 ml-auto max-w-[80%]" : "bg-secondary/20 mr-auto max-w-[80%]"}`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <LoaderIcon strokeWidth={2} className="animate-spin w-4 h-4" />
            <span>Generating...</span>
          </div>
        )}
        <ChatInput handleSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}

function ChatInput({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Prompt is required.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add a /start command that responds with 'Hello, how are you?'" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
