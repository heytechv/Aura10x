import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals, url }) => {
  const { supabase } = locals;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${url.origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    return new Response(error.message, { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: data.url,
    },
  });
};
