import type { CollectionItemViewModel } from "@/types";
import { PerfumeCard } from "@/components/shared/PerfumeCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

type CollectionGridProps = {
  items: CollectionItemViewModel[];
  status: "loading" | "success" | "error";
  onRemove: (perfumeId: string) => void;
};

export const CollectionGrid = ({ items, status, onRemove }: CollectionGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <PerfumeCard
          key={item.perfume_id}
          variant="collection"
          perfume={item}
          onRemove={onRemove}
          isProcessing={item.isBeingRemoved}
        />
      ))}
    </div>
  );
};
