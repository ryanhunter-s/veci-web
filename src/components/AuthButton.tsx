"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { BadgeCheckIcon, BellIcon, CreditCardIcon, LogOutIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import Avatar from "@/components/Avatar"; 
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (<span className="h-8 w-20 animate-pulse rounded-full bg-muted-light" aria-hidden />);
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className="cursor-pointer">
            <Avatar name={session.user.name ?? "User"} photo={session.user.image} size={35}/>
          </button>
        }/>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}><BadgeCheckIcon /> Account</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/billing")}><CreditCardIcon /> Billing</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/notifications")}><BellIcon /> Notifications</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}><LogOutIcon /> Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
        Sign in
      </Link>
      <Link href="/auth/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
        Join
      </Link>
    </div>
  );
}