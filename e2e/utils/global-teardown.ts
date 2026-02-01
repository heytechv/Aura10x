import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function globalTeardown() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const testUserId = process.env.E2E_USERNAME_ID;

  if (!supabaseUrl || !supabaseKey || !testUserId) {
    throw new Error("Missing Supabase environment variables for global teardown.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const { error } = await supabase.from("user_collection").delete().eq("user_id", testUserId);

  if (error) {
    console.error("Error cleaning up user collection:", error);
    throw error;
  }

  console.log(`Cleaned up collection for user ${testUserId}`);
}

export default globalTeardown;
