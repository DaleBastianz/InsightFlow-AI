import { createClient } from "@supabase/supabase-js";
import type { Session, User } from "@supabase/supabase-js";

const supabaseUrl = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;
const supabaseAnonKey = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

let browserClient: ReturnType<typeof createClient> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!browserClient) {
    const options = isBrowser()
      ? { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
      : { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

    browserClient = createClient(supabaseUrl, supabaseAnonKey, options);
  }

  return browserClient;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export type { User, Session };

export async function signInWithEmail(email: string, password: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return { data: { user: null, session: null }, error: new Error("Supabase is not configured.") };
  return client.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return { data: { user: null, session: null }, error: new Error("Supabase is not configured.") };
  return client.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
}

export async function signOutUser() {
  const client = getSupabaseBrowserClient();
  if (!client) return { error: new Error("Supabase is not configured.") };
  return client.auth.signOut();
}

export async function getCurrentSession() {
  const client = getSupabaseBrowserClient();
  if (!client) return { data: { session: null }, error: null };
  return client.auth.getSession();
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const client = getSupabaseBrowserClient();
  if (!client) return { data: { subscription: { unsubscribe: () => {} } } };
  return client.auth.onAuthStateChange((_event, session) => callback(session));
}
