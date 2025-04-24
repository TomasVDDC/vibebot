import React from "react";
import { SidebarTrigger } from "./sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PagePrimaryBar = () => (
  <div className="flex h-14 w-full flex-row items-center gap-1 border-b px-4 sm:px-6 sticky top-0 z-20 bg-background left-0 right-0">
    <SidebarTrigger className="cursor-pointer" />
    <div className="h-4 flex items-center">
      <Separator orientation="vertical" className="mx-2" />
    </div>

    <span className="text-lg font-bold"> Home </span>
    <Link className="ml-auto" href="/new-bot">
      <Button className="cursor-pointer" variant="noShadow">
        New Bot
      </Button>
    </Link>
  </div>
);

export default PagePrimaryBar;
