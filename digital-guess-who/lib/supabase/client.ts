import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase client-side environment variables are missing. " +
      "Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file. " +
      `URL Loaded: ${!!supabaseUrl}, Key Loaded: ${!!supabaseKey}`
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
