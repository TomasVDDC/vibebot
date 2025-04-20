import { Button } from "@/components/ui/button";
import { SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="flex justify-end p-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className="flex flex-col justify-center items-center min-h-[800px]">
        <h1 className="max-w-[800px] text-6xl font-bold text-center font-dm-sans">Create Telegram Bots with Natural Language</h1>
        <p className="mt-4 max-w-[800px]text-2xl text-center font-dm-sans">
          Build powerful Telegram bots using simple conversations. No coding required.
        </p>
        <SignInButton>
          <Button className="mt-4 px-4 py-2 rounded-md cursor-pointer font-dm-sans">Get Started</Button>
        </SignInButton>
      </div>
    </>
  );
}
