import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY must be defined in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function ensureTestUser(email?: string, password?: string) {
  const testEmail = email || process.env.E2E_USERNAME || "test@example.com";
  const testPassword = password || process.env.E2E_PASSWORD || "password123";

  // Try to sign up the user
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    // If user already exists, that's fine for us
    if (error.message.includes("User already registered") || error.message.includes("already registered")) {
      console.log(`User ${testEmail} already registered, proceeding.`);
      return { email: testEmail, password: testPassword };
    }

    // For other errors (e.g. weak password), we should probably fail or at least log warning
    console.error(`Failed to ensure test user ${testEmail}:`, error.message);
    if (error.status === 422 || error.status === 400) {
      // Proceeding might be risky if user doesn't exist, but maybe it does.
      // But if creation failed due to weak password, and user didn't exist, login will fail.
      console.warn(" Proceeding with provided credentials anyway.");
      return { email: testEmail, password: testPassword };
    }
    throw error;
  }

  // If new user created
  if (data.user) {
    console.log(`Created new test user: ${testEmail}`);
    return { email: testEmail, password: testPassword, user: data.user };
  }

  // Fallback
  return { email: testEmail, password: testPassword };
}

export async function deleteTestUser(userId: string) {
  // Requires service_role key to delete user, or we just leave it (cleanup script later)
  // If SUPABASE_KEY is service_role, this works:
  // await supabase.auth.admin.deleteUser(userId);

  // For now, we'll try/catch it
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) console.warn("Could not delete test user:", error.message);
  } catch (e) {
    // likely 401 if not admin
  }
}
