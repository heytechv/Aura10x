import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PerfumeCard } from "@/components/shared/PerfumeCard";
import { usePublicPerfumes } from "@/components/hooks/usePublicPerfumes";
import type { AddPerfumeToCollectionResponseDto, PerfumeListItemViewModel } from "@/types";

// A simple debounce implementation
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced;
};

type AddPerfumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPerfumeAdded: (newPerfume: AddPerfumeToCollectionResponseDto) => void;
  existingCollectionIds: Set<string>;
};

export const AddPerfumeModal = ({
  isOpen,
  onClose,
  onPerfumeAdded,
  existingCollectionIds,
}: AddPerfumeModalProps) => {
  const { status, items, search, loadMore, hasMore, addPerfume } = usePublicPerfumes(existingCollectionIds);

  const debouncedSearch = debounce(search, 500);

  useEffect(() => {
    if (isOpen) {
      search('');
    }
  }, [isOpen, search]);

  const handleAddPerfume = async (perfume: PerfumeListItemViewModel) => {
    try {
      const newCollectionItem = await addPerfume(perfume.id);
      onPerfumeAdded(newCollectionItem);
    } catch (error) {
      console.error("Failed to add perfume", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Perfume to Collection</DialogTitle>
          <DialogDescription>
            Search for a perfume to add to your personal collection.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4">
          <Input
            placeholder="Search by name or brand..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <div className="p-4 overflow-y-auto">
          {status === 'loading' && items.length === 0 && <p>Loading...</p>}
          {status === 'error' && <p>Error loading perfumes.</p>}
          {status === 'success' && items.length === 0 && <p>No results found.</p>}
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <PerfumeCard
                key={item.id}
                perfume={item}
                variant="add"
                onAdd={handleAddPerfume}
                isProcessing={item.isBeingAdded}
                isDisabled={item.isInCollection}
              />
            ))}
          </div>
          {status === 'loading' && items.length > 0 && <p className="text-center mt-4">Loading more...</p>}
          {hasMore && status !== 'loading' && (
            <Button onClick={loadMore} variant="outline" className="w-full mt-4">
              Load More
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
