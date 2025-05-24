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
interface Task {
  task: string;
  status: string;
}

interface ChatProps {
  botId: string;
  messages: Message[];
  addMessage: (message: Message) => void;
  submit: (prompt: { prompt: string; botId: string }) => void;
  latestBotCode: string;
  currentTasks?: Task[];
  isGeneratingBot: boolean;
  isBotRunning: boolean;
}

export default function Chat({ messages, addMessage, submit, botId, currentTasks, isGeneratingBot, isBotRunning }: ChatProps) {
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
              <p className="text-md whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
        {/* Current Tasks between chat and input */}
        {currentTasks && currentTasks.length > 0 && (
          <div className="flex flex-col gap-1 px-2 py-2 my-2 bg-primary/10 rounded-xl shadow-sm w-full text-xs max-w-full">
            {currentTasks.map((task, idx) => (
              <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-primary/30 shadow-sm">
                <span className="truncate flex-1 text-primary font-medium" title={task.task}>
                  {task.task}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ml-1
                    ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : task.status === "in_progress"
                        ? "bg-blue-50 text-blue-700"
                        : task.status === "stopped"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-50 text-gray-700"
                    }
                  `}
                >
                  {task.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
        {isGeneratingBot && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <LoaderIcon strokeWidth={2} className="animate-spin w-4 h-4" />
            <span>Generating...</span>
          </div>
        )}
        {isBotRunning && (
          <div className="flex items-center space-x-2 ml-2">
            <div className="w-2 h-2 rounded-full  bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Running</span>
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
      <form className="space-y-8 border mt-2 rounded-2xl shadow-xl border-primary" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="border-none m-2">
              <FormControl>
                <Input
                  className="border-none shadow-none [&::placeholder]:text-lg [&::placeholder]:text-primary/70 focus-visible:ring-0 focus:outline-none"
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
