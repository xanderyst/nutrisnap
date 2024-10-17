"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate to different pages of the app.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          <SheetClose asChild>
            <Button
              asChild
              className="w-full justify-start"
              variant={pathname === "/" ? "default" : "ghost"}
            >
              <Link href="/">Nutrition Tracker</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              asChild
              className="w-full justify-start"
              variant={pathname === "/daily-nutrition" ? "default" : "ghost"}
            >
              <Link href="/daily-nutrition">Daily Overview</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
