/* ==========================================================
   OPHELIA — Supabase client
   Publishable (anon) key only — safe for the browser, access is
   enforced by Row Level Security policies on the database side.
   Never put the secret/service-role key here.
   ========================================================== */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
