
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/db/database.types";
import type { PerfumeListItemDto } from "@/types";

type SupabaseClientType = SupabaseClient<Database>;

interface GetPublicPerfumesParams {
  query?: string;
  limit: number;
  page: number;
}

export async function getPublicPerfumes(
  supabase: SupabaseClientType,
  { query, limit, page }: GetPublicPerfumesParams
): Promise<{ perfumes: PerfumeListItemDto[]; totalItems: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from("perfumes")
    .select(
      `
      id,
      name,
      slug,
      image_path,
      brand:brands (
        name,
        slug
      )
    `,
      { count: "exact" }
    )
    .range(from, to);

  if (query) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  const { data, error, count } = await queryBuilder;

  if (error) {
    throw new Error(error.message);
  }

  // The type from the query doesn't match PerfumeListItemDto directly
  // because of the nested brand object. We need to cast it carefully.
  const perfumes: PerfumeListItemDto[] = data as any;

  return { perfumes, totalItems: count ?? 0 };
}
