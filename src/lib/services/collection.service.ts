import type { CollectionItemDto } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getCollectionByUserId = async (
  userId: string,
  supabase: SupabaseClient
): Promise<CollectionItemDto[]> => {
  const { data, error } = await supabase
    .from("user_collection")
    .select(
      `
      perfume_id,
      added_at,
      perfumes (
        name,
        slug,
        image_path,
        brands (
          name
        )
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching collection:", error);
    throw new Error("Could not fetch user collection.");
  }

  if (!data) {
    return [];
  }

  const collectionItems: CollectionItemDto[] = data.map((item: any) => {
    const perfume = item.perfumes;
    const brand = perfume ? perfume.brands : null;

    return {
      perfume_id: item.perfume_id,
      added_at: item.added_at,
      perfume: {
        name: perfume?.name,
        slug: perfume?.slug,
        image_path: perfume?.image_path,
        brand: {
          name: brand?.name,
        },
      },
    };
  });

  return collectionItems;
};
