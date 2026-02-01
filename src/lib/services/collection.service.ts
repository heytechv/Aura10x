import type { CollectionItemDto, UserCollection } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError, handleServiceError } from "../handle-service-error";

export const getCollectionByUserId = async (userId: string, supabase: SupabaseClient): Promise<CollectionItemDto[]> => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const addPerfumeToCollection = async (
  userId: string,
  perfumeId: string,
  supabase: SupabaseClient
): Promise<{ data: UserCollection; badgeUnlocked?: string }> => {
  try {
    // 1. Check if perfume exists
    const { data: perfume, error: perfumeError } = await supabase
      .from("perfumes")
      .select("id, brand_id")
      .eq("id", perfumeId)
      .single();

    if (perfumeError || !perfume) {
      throw new AppError("Perfume not found.", 404);
    }

    // 2. Check for duplicates in the user's collection
    const { data: existingEntry } = await supabase
      .from("user_collection")
      .select("user_id, perfume_id")
      .eq("user_id", userId)
      .eq("perfume_id", perfumeId)
      .single();

    if (existingEntry) {
      throw new AppError("Perfume already in collection.", 409);
    }

    // 3. Check Account Limits (Tier Logic)
    // Rule: Free tier users can have max 10 perfumes.
    const { count: collectionCount, error: countError } = await supabase
      .from("user_collection")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw countError;

    const MAX_FREE_ITEMS = 10;
    // Assuming everyone is on "Free" tier for MVP v1
    if (collectionCount !== null && collectionCount >= MAX_FREE_ITEMS) {
      throw new AppError(
        `Free tier limit reached (${MAX_FREE_ITEMS}). Upgrade to Premium to add more.`,
        403
      );
    }

    // 4. Add the new perfume to the collection
    const { data: newCollectionEntry, error: insertError } = await supabase
      .from("user_collection")
      .insert({ user_id: userId, perfume_id: perfumeId })
      .select()
      .single();

    if (insertError) throw insertError;
    if (!newCollectionEntry) throw new AppError("Failed to add perfume to collection", 500);

    // 5. Check Bundle Logic (Brand Ambassador Badge)
    // Rule: If user adds 3 perfumes from the same brand, unlock "Brand Ambassador" badge.
    let badgeUnlocked: string | undefined;

    if (perfume.brand_id) {
      const { count: brandCount } = await supabase
        .from("user_collection")
        .select("perfume_id, perfumes!inner(brand_id)", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("perfumes.brand_id", perfume.brand_id);

      if (brandCount === 3) {
        const { data: brand } = await supabase
          .from("brands")
          .select("name")
          .eq("id", perfume.brand_id)
          .single();

        if (brand) {
          badgeUnlocked = `Ambasador Marki ${brand.name}`;
          console.log(`🏆 BADGE UNLOCKED: ${badgeUnlocked}`);
        }
      }
    }

    return { data: newCollectionEntry, badgeUnlocked };
  } catch (error) {
    throw handleServiceError(error);
  }
};

export const removePerfumeFromCollection = async (
  userId: string,
  perfumeId: string,
  supabase: SupabaseClient
): Promise<void> => {
  try {
    const { error, count } = await supabase
      .from("user_collection")
      .delete()
      .eq("user_id", userId)
      .eq("perfume_id", perfumeId);

    if (error) {
      throw error;
    }

    if (count === 0) {
      throw new AppError("Perfume not found in collection.", 404);
    }
  } catch (error) {
    throw handleServiceError(error);
  }
};
