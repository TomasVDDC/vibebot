"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SubmitButton } from "@/components/ui/submit-button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addBot } from "@/app/actions/actions";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";

const initialState = { message: "", errors: null };

export default function NewBot() {
  const [state, formAction] = useActionState(addBot, initialState);

  const formSchema = z.object({
    botToken: z.string().min(1, {
      message: "Bot token is required.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botToken: "",
    },
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="max-w-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold ">Create Your Telegram Bot</CardTitle>
            <CardDescription className="">To create a new bot, you&apos;ll need a bot token from Telegram&apos;s BotFather.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ol className="text-left space-y-3 ">
                <li>
                  1. Open Telegram and search for <span className="font-semibold">@BotFather</span>
                </li>
                <li>
                  2. Start a chat with BotFather and send the command <span className="font-mono bg-gray-100 px-2 py-1 rounded">/newbot</span>
                </li>
                <li>3. Follow the instructions to name your bot</li>
                <li>
                  4. BotFather will give you a token that looks like{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ</span>
                </li>
                <li>5. Copy and paste that token below</li>
              </ol>
            </div>
            <div className="flex justify-center mb-6">
              <Image src="/botfather.jpeg" alt="botfather" width={100} height={100} />
            </div>
            <Form {...form}>
              <form action={formAction} className="space-y-8">
                <FormField
                  control={form.control}
                  name="botToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Bot Token</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ" {...field} />
                      </FormControl>
                      <FormDescription className="">This allows you to customize your bot.</FormDescription>
                      <FormMessage>{state?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
