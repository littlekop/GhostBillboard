import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
  );
}

// Anon-key client: safe to use in both server components and the browser.
// RLS policies (see supabase/migrations) are what actually gate access.
export const supabase = createClient(url, anonKey);
