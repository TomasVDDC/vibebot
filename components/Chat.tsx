import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "@/lib/messages";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { useRef, useEffect } from "react";
interface ChatProps {
  botId: string;
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
  submit: (prompt: { prompt: string; botId: string }) => void;
  latestBotCode: string;
}

export default function Chat({ messages, addMessage, isLoading, submit, botId }: ChatProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Later we can have a new set that is the input inside of the from and when submit is pressed we can add that to the messages
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt") as string;

    addMessage({ content: prompt, role: "user" });

    submit({ prompt, botId });
  }
  const container = useRef<HTMLDivElement>(null);

  const Scroll = () => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  };

  useEffect(() => {
    Scroll();
  }, [messages]);

  return (
    <Card className="border-none shadow-none w-[700px]">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto p-2" ref={container}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary/10 ml-auto max-w-[80%]" : "bg-secondary/20 mr-auto max-w-[80%]"}`}
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
      <form className="space-y-8 border-2 mt-2 rounded-2xl shadow-xl border-primary" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="border-none m-2">
              <FormControl>
                <Input
                  className="border-none shadow-none [&::placeholder]:text-lg [&::placeholder]:text-primary focus-visible:ring-0 focus:outline-none"
                  placeholder="Describe your bot..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end m-3">
          <Button type="submit" variant="default">
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
