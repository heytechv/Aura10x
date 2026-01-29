import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, locals }) => {
  const { supabase } = locals;
  const code = url.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/collection",
    },
  });
};
