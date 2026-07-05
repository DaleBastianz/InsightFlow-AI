"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push("/home");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password);

    if (error) {
      setMessage(error);
      setSubmitting(false);
      return;
    }

    if (mode === "signup") {
      setMessage("Check your email for the confirmation link.");
    } else {
      router.push("/home");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_40%)] bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/home" className="inline-flex items-center gap-2">
            <Image src="/insightflow_ai_LOGO.png" alt="InsightFlow AI" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-semibold text-foreground">InsightFlow AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to access your reports" : "Sign up to start saving your research"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-1.5 w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" className="mt-1.5 w-full rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>

          {message && (
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">{message}</div>
          )}

          <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70">
            <Sparkles className="h-4 w-4" />
            {submitting ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>No account? <button type="button" onClick={() => { setMode("signup"); setMessage(null); }} className="font-medium text-primary hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setMode("signin"); setMessage(null); }} className="font-medium text-primary hover:underline">Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
