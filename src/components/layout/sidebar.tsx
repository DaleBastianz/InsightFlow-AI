"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, History, LayoutGrid, Settings } from "lucide-react";

const items = [
  { href: "/home", label: "Home", icon: LayoutGrid },
  { href: "/upload", label: "Upload", icon: FileText },
  { href: "/results", label: "Results", icon: BookOpen },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur lg:block">
      <div className="rounded-[1.25rem] border border-border/70 bg-background/80 p-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Workspace</p>
        <p className="mt-2 px-2 text-sm text-foreground">AI-assisted research and reporting</p>
      </div>
      <nav className="mt-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
