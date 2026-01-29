import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CollectionGrid } from "./CollectionGrid";
import { EmptyState } from "./EmptyState";
import { AddPerfumeModal } from "./AddPerfumeModal";
import { useCollection } from "@/components/hooks/useCollection";
import type { AddPerfumeToCollectionResponseDto } from "@/types";

export const CollectionContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status, items, removePerfumeFromCollection, addPerfumeToCollection } = useCollection();

  const handlePerfumeAdded = (newPerfume: AddPerfumeToCollectionResponseDto) => {
    addPerfumeToCollection(newPerfume);
    setIsModalOpen(false);
  };

  const existingCollectionIds = new Set(items.map((item) => item.perfume_id));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Collection</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Perfume</Button>
      </div>

      {status === "error" && (
        <div className="text-center text-red-500">
          <p>Failed to load collection. Please try again later.</p>
        </div>
      )}

      {status !== "error" && items.length === 0 && status !== 'loading' ? (
        <EmptyState onAddClick={() => setIsModalOpen(true)} />
      ) : (
        <CollectionGrid items={items} status={status} onRemove={removePerfumeFromCollection} />
      )}

      <AddPerfumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPerfumeAdded={handlePerfumeAdded}
        existingCollectionIds={existingCollectionIds}
      />
    </div>
  );
};
