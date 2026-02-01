import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PerfumeCard } from "@/components/shared/PerfumeCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { usePublicPerfumes } from "@/components/hooks/usePublicPerfumes";
import type { AddPerfumeToCollectionResponseDto, PerfumeListItemViewModel } from "@/types";
import { toast } from "sonner";

// A simple debounce implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface AddPerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPerfumeAdded: (response: AddPerfumeToCollectionResponseDto) => void;
  existingCollectionIds: Set<string>;
}

export const AddPerfumeModal = ({ isOpen, onClose, onPerfumeAdded, existingCollectionIds }: AddPerfumeModalProps) => {
  const { status, items, search, loadMore, hasMore, addPerfume } = usePublicPerfumes(existingCollectionIds);

  const debouncedSearch = debounce(search, 500);

  useEffect(() => {
    if (isOpen) {
      search("");
    }
  }, [isOpen, search]);

  const handleAddPerfume = async (perfume: PerfumeListItemViewModel) => {
    try {
      const response = await addPerfume(perfume.id);
      onPerfumeAdded(response);
      toast.success("Perfumy dodane do kolekcji");

      if (response.badgeUnlocked) {
        toast.message("Odznaka Odblokowana! 🏆", {
          description: response.badgeUnlocked,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to add perfume", error);
      if (error instanceof Error) {
        toast.error("Błąd dodawania", {
          description: error.message,
        });
      } else {
        toast.error("Wystąpił nieoczekiwany błąd");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Dodaj perfumy do kolekcji</DialogTitle>
          <DialogDescription>Wyszukaj perfumy, aby dodać je do swojej osobistej kolekcji.</DialogDescription>
        </DialogHeader>
        <div className="px-4">
          <Input
            placeholder="Szukaj po nazwie lub marce..."
            onChange={(e) => debouncedSearch(e.target.value)}
            data-test-id="modal-search-input"
          />
        </div>
        <div className="p-4 overflow-y-auto">
          {(() => {
            if (status === "loading" && items.length === 0) {
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              );
            }
            if (status === "error") {
              return <p>Błąd ładowania perfum.</p>;
            }
            if (status === "success" && items.length === 0) {
              return <p>Nie znaleziono wyników.</p>;
            }
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-test-id="modal-results-grid">
                {items.map((item) => (
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
            );
          })()}

          {status === "loading" && items.length > 0 && <p className="text-center mt-4">Ładowanie więcej...</p>}
          {hasMore && status !== "loading" && (
            <Button onClick={loadMore} variant="outline" className="w-full mt-4">
              Załaduj więcej
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
