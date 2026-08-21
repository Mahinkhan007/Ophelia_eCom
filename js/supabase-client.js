/* ==========================================================
   OPHELIA — Supabase client
   Publishable (anon) key only — safe for the browser, access is
   enforced by Row Level Security policies on the database side.
   Never put the secret/service-role key in this file.
   ========================================================== */

const SUPABASE_URL = "https://yxyhtikrlngmiifrwdxl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ohAls5VWdg6ZhUoy3U_7Qg_QJXLmojM";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
