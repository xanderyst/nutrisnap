"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginButton() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return isSignedIn ? (
    <UserButton afterSignOutUrl="/" />
  ) : (
    <SignInButton mode="modal">
      <Button>Sign In</Button>
    </SignInButton>
  );
}
