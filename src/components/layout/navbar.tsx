"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogOut, LogIn } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Upload", href: "/upload" },
  { label: "Results", href: "/results" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/insightflow_ai_LOGO.png" alt="InsightFlow AI" width={40} height={40} className="rounded-xl" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">InsightFlow AI</p>
            <p className="text-xs text-muted-foreground">Research to output</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2 py-2 text-sm text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 transition hover:bg-muted hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline max-w-[120px] truncate">{user.email}</span>
              <button
                onClick={() => { signOut(); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link href="/auth" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
