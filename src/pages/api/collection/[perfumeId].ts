import { z } from "zod";
import type { APIRoute } from "astro";
import { removePerfumeFromCollection } from "../../../lib/services/collection.service";
import { AppError } from "../../../lib/handle-service-error";

export const prerender = false;

const perfumeIdSchema = z.string().uuid({
  message: "Perfume ID must be a valid UUID.",
});

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { user, supabase } = locals;

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const perfumeId = params.perfumeId;

  const validationResult = perfumeIdSchema.safeParse(perfumeId);
  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        message: "Invalid request parameters.",
        errors: validationResult.error.flatten().fieldErrors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await removePerfumeFromCollection(
      user.id,
      validationResult.data,
      supabase
    );
    return new Response(
      JSON.stringify({ message: "Perfume removed successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof AppError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Internal Server Error:", error);
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
