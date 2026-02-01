import type { APIRoute } from "astro";
import { z } from "zod";
import { getPublicPerfumes } from "@/lib/services/perfume.service";
import type { PaginatedPerfumesResponseDto } from "@/types";

export const prerender = false;

const querySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().positive().optional().default(20),
  page: z.coerce.number().int().positive().optional().default(1),
});

export const GET: APIRoute = async ({ url, locals }) => {
  const supabase = locals.supabase;
  const searchParams = url.searchParams;

  const paramsToValidate = {
    q: searchParams.get("q") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  };

  const validation = querySchema.safeParse(paramsToValidate);

  if (!validation.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid query parameters",
        details: validation.error.flatten(),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { q, limit, page } = validation.data;

  try {
    const { perfumes, totalItems } = await getPublicPerfumes(supabase, {
      query: q,
      limit,
      page,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const response: PaginatedPerfumesResponseDto = {
      data: perfumes,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
