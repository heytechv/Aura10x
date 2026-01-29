import { useState, useEffect, useCallback } from "react";
import type { CollectionItemViewModel, CollectionItemDto, AddPerfumeToCollectionResponseDto } from "@/types";

export const useCollection = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [items, setItems] = useState<CollectionItemViewModel[]>([]);

  const fetchCollection = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/collection");
      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }
      const data: { data: CollectionItemDto[] } = await response.json();
      setItems(data.data.map(item => ({ ...item, isBeingRemoved: false })));
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const addPerfumeToCollection = useCallback(async (newPerfume: AddPerfumeToCollectionResponseDto) => {
    // This function is for optimistic update after adding a perfume
    // A full implementation might require fetching brand info or having it in the response
    const newItem: CollectionItemViewModel = {
      perfume_id: newPerfume.data.perfume_id,
      added_at: newPerfume.data.added_at,
      perfume: {
          // This is a limitation, as we don't have the full perfume object here.
          // This would need to be addressed by either changing the POST response
          // or fetching the details after adding. For now, we mock it.
          name: 'Newly Added Perfume',
          slug: 'newly-added-perfume',
          image_path: null,
          brand: { name: 'Brand' }
      },
      isBeingRemoved: false,
    };
    // To properly add the item, we'd need its full details.
    // Instead, we will just refetch the whole collection for simplicity.
    fetchCollection();
  }, [fetchCollection]);

  const removePerfumeFromCollection = useCallback(async (perfumeId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.perfume_id === perfumeId ? { ...item, isBeingRemoved: true } : item,
      ),
    );

    try {
      const response = await fetch(`/api/collection/${perfumeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove perfume");
      }

      setItems((prevItems) => prevItems.filter((item) => item.perfume_id !== perfumeId));
    } catch (error) {
      console.error(error);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.perfume_id === perfumeId ? { ...item, isBeingRemoved: false } : item,
        ),
      );
    }
  }, []);

  return {
    status,
    items,
    addPerfumeToCollection,
    removePerfumeFromCollection,
  };
};
