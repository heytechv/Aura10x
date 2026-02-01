import type { PerfumeListItemViewModel, CollectionItemViewModel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface PerfumeCardProps {
  variant: "collection" | "add";
  perfume: PerfumeListItemViewModel | CollectionItemViewModel;
  onRemove?: (perfumeId: string) => void;
  onAdd?: (perfume: PerfumeListItemViewModel) => void;
  isProcessing?: boolean;
  isDisabled?: boolean;
}

// Type guard to check if the perfume is of type CollectionItemViewModel
const isCollectionItem = (
  perfume: PerfumeListItemViewModel | CollectionItemViewModel
): perfume is CollectionItemViewModel => {
  return "perfume" in perfume && "added_at" in perfume;
};

export const PerfumeCard = ({
  variant,
  perfume,
  onRemove,
  onAdd,
  isProcessing = false,
  isDisabled = false,
}: PerfumeCardProps) => {
  const perfumeData = isCollectionItem(perfume) ? perfume.perfume : perfume;
  const perfumeId = isCollectionItem(perfume) ? perfume.perfume_id : perfume.id;

  const handleRemove = () => {
    if (onRemove && isCollectionItem(perfume)) {
      onRemove(perfume.perfume_id);
    }
  };

  const handleAdd = () => {
    if (onAdd && !isCollectionItem(perfume)) {
      onAdd(perfume);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:scale-105" data-test-id={`perfume-card-${perfumeId}`}>
      <CardHeader className="p-0">
        <a href={`/perfume/${perfumeData.slug}`}>
          <img
            src={perfumeData.image_path ?? "/placeholder.svg"}
            alt={perfumeData.name}
            className="aspect-square w-full object-cover"
          />
        </a>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{perfumeData.name}</h3>
        <p className="text-sm text-muted-foreground">
          {isCollectionItem(perfume) ? perfumeData.brand.name : perfume.brand.name}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        {variant === "collection" && onRemove && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleRemove}
            disabled={isProcessing || isDisabled}
            data-test-id="card-remove-btn"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Usuń
          </Button>
        )}
        {variant === "add" && onAdd && (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={handleAdd}
            disabled={isProcessing || isDisabled}
            data-test-id="card-add-btn"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {isDisabled ? "W kolekcji" : "Dodaj"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
