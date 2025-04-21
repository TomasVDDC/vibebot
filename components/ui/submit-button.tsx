"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="w-full font-dm-sans">
      {pending ? <Loader2 className="animate-spin" /> : "Submit"}
    </Button>
  );
}
