import type { APIRoute } from "astro";
import { getCollectionByUserId } from "../../lib/services/collection.service";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const { user, supabase } = locals;

  // Using a hardcoded user ID for now, as per instructions to ignore auth.
  const userId = "00000000-0000-0000-0000-000000000000"; // Replace with a real user ID from your DB for testing

  try {
    const collection = await getCollectionByUserId(userId, supabase);
    return new Response(JSON.stringify({ data: collection }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
