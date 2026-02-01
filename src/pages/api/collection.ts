import type { APIRoute } from "astro";
import { addPerfumeToCollection, getCollectionByUserId } from "../../lib/services/collection.service";
import { z } from "zod";
import type { AddPerfumeToCollectionResponseDto } from "../../types";
import { AppError } from "../../lib/handle-service-error";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const collection = await getCollectionByUserId(user.id, supabase);
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

const addPerfumeToCollectionSchema = z.object({
  perfume_id: z.string().uuid({ message: "Invalid perfume_id format." }),
});

export const POST: APIRoute = async ({ request, locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const validation = addPerfumeToCollectionSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: validation.error.flatten() }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { perfume_id } = validation.data;
    const { data: newCollectionEntry, badgeUnlocked } = await addPerfumeToCollection(
      user.id,
      perfume_id,
      supabase
    );

    const response: AddPerfumeToCollectionResponseDto = {
      message: "Perfume added successfully.",
      data: newCollectionEntry,
      badgeUnlocked,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const appError = error as AppError;
    return new Response(JSON.stringify({ error: appError.message }), {
      status: appError.statusCode || 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
