import { SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import InputBar from "@/components/InputBar";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="landing-page">
      <div className="flex flex-row justify-between items-center py-4">
        <div className="flex flex-row items-center pl-32 gap-2">
          <Image src="/landing_page/bot-logo.png" alt="logo" width={32} height={32} />
          <span className=" text-xl font-bold text-shadow-md"> Vibebot</span>
        </div>

        <div className="flex items-center pr-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center min-h-[600px] sm:min-h-[800px]">
        <h1 className=" max-w-[300px] text-4xl sm:max-w-[800px] sm:text-6xl font-bold text-center text-shadow-lg">
          Turn Ideas into <span className="text-primary">Telegram Bots</span> Instantly with AI
        </h1>
        <p className="mt-4 max-w-[800px]text-2xl text-center text-shadow-lg">
          Chat with our AI to design your Telegram bot — no coding, just conversation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <InputBar />
          <SignInButton>
            <Button className="px-4 py-2 rounded-md cursor-pointer bg-primary shadow-lg ">Get Started</Button>
          </SignInButton>
          <Button className="default bg-white text-primary hover:bg-white shadow-lg" asChild>
            <a href="https://github.com/TomasVDDC/vibebot" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              See the code
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
