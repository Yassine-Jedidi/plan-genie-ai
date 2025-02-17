const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // Load .env variables

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key instead of anon key for backend operations
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    setCookieOptions: {
      domain: "plan-genie-ai-backend.vercel.app",
      path: "/",
      sameSite: "None",
      secure: true,
    },
  },
});

// Add Google OAuth URL helper
const getGoogleOAuthURL = () => {
  const provider = "google";
  const redirectTo = `${process.env.FRONTEND_URL}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

module.exports = { supabase, getGoogleOAuthURL };
