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

  const handlePerfumeAdded = () => {
    addPerfumeToCollection();
  };

  const existingCollectionIds = new Set(items.map((item) => item.perfume_id));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Moja kolekcja</h1>
        <Button onClick={() => setIsModalOpen(true)} data-test-id="collection-add-btn">Dodaj nowe perfumy</Button>
      </div>

      {status === "error" && (
        <div className="text-center text-red-500">
          <p>Nie udało się wczytać kolekcji. Proszę spróbować ponownie później.</p>
        </div>
      )}

      {status === 'success' && items.length === 0 ? (
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
