"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function AuthSubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full rounded-none bg-brown-900 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-none transition-colors duration-300 hover:bg-orange-600"
      disabled={pending}
    >
      {pending ? "Please wait..." : children}
    </Button>
  );
}
