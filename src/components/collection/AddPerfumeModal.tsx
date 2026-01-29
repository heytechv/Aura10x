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
  onPerfumeAdded: (response: AddPerfumeToCollectionResponseDto) => void;
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
      const response = await addPerfume(perfume.id);
      onPerfumeAdded(response);
    } catch (error) {
      console.error("Failed to add perfume", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Dodaj perfumy do kolekcji</DialogTitle>
          <DialogDescription>
            Wyszukaj perfumy, aby dodać je do swojej osobistej kolekcji.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4">
          <Input
            placeholder="Szukaj po nazwie lub marce..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <div className="p-4 overflow-y-auto">
          {status === 'loading' && items.length === 0 && <p>Ładowanie...</p>}
          {status === 'error' && <p>Błąd ładowania perfum.</p>}
          {status === 'success' && items.length === 0 && <p>Nie znaleziono wyników.</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          {status === 'loading' && items.length > 0 && <p className="text-center mt-4">Ładowanie więcej...</p>}
          {hasMore && status !== 'loading' && (
            <Button onClick={loadMore} variant="outline" className="w-full mt-4">
              Załaduj więcej
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
