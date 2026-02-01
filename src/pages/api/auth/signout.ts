import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals }) => {
  const { supabase } = locals;
  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(null, { status: 200 });
};
