import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  PerfumeListItemViewModel,
  PaginationDetails,
  PaginatedPerfumesResponseDto,
  AddPerfumeToCollectionResponseDto,
} from "@/types";

const API_LIMIT = 10;

export const usePublicPerfumes = (existingCollectionIds: Set<string>) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [items, setItems] = useState<PerfumeListItemViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationDetails | null>(null);
  const [query, setQuery] = useState("");

  const collectionIdsRef = useRef(existingCollectionIds);
  useEffect(() => {
    collectionIdsRef.current = existingCollectionIds;
  }, [existingCollectionIds]);

  const fetchPerfumes = useCallback(async (searchQuery: string, page = 1) => {
    setStatus("loading");
    try {
      const url = new URL("/api/perfumes", window.location.origin);
      url.searchParams.set("q", searchQuery);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(API_LIMIT));

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch perfumes");

      const data: PaginatedPerfumesResponseDto = await response.json();

      const viewModels = data.data.map(
        (perfume): PerfumeListItemViewModel => ({
          ...perfume,
          isInCollection: collectionIdsRef.current.has(perfume.id),
          isBeingAdded: false,
        })
      );

      setItems((prev) => (page === 1 ? viewModels : [...prev, ...viewModels]));
      setPagination(data.pagination);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  const hasMore = useMemo(() => {
    if (!pagination) return false;
    return pagination.currentPage < pagination.totalPages;
  }, [pagination]);

  const loadMore = useCallback(() => {
    if (hasMore && pagination) {
      fetchPerfumes(query, pagination.currentPage + 1);
    }
  }, [hasMore, pagination, query, fetchPerfumes]);

  const search = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setItems([]);
      setPagination(null);
      fetchPerfumes(newQuery, 1);
    },
    [fetchPerfumes]
  );

  const addPerfume = useCallback(async (perfumeId: string): Promise<AddPerfumeToCollectionResponseDto> => {
    setItems((prev) => prev.map((p) => (p.id === perfumeId ? { ...p, isBeingAdded: true } : p)));
    try {
      const response = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfume_id: perfumeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add perfume");
      }
      const result: AddPerfumeToCollectionResponseDto = await response.json();
      setItems((prev) =>
        prev.map((p) => (p.id === perfumeId ? { ...p, isBeingAdded: false, isInCollection: true } : p))
      );
      return result;
    } catch (error) {
      console.error(error);
      setItems((prev) => prev.map((p) => (p.id === perfumeId ? { ...p, isBeingAdded: false } : p)));
      throw error;
    }
  }, []);

  return {
    status,
    items,
    search,
    loadMore,
    hasMore,
    addPerfume,
  };
};
