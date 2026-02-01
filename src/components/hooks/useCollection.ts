import { useState, useEffect, useCallback } from "react";
import type { CollectionItemViewModel, CollectionItemDto } from "@/types";
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
      setItems(data.data.map((item) => ({ ...item, isBeingRemoved: false })));
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const addPerfumeToCollection = useCallback(() => {
    // Refetch the entire collection to ensure data is up-to-date.
    fetchCollection();
  }, [fetchCollection]);

  const removePerfumeFromCollection = useCallback(async (perfumeId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.perfume_id === perfumeId ? { ...item, isBeingRemoved: true } : item))
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
        prevItems.map((item) => (item.perfume_id === perfumeId ? { ...item, isBeingRemoved: false } : item))
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
