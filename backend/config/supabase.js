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
  },
});

module.exports = supabase;
