import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onAddClick: () => void;
};

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Your collection is empty</h2>
      <p className="mt-2 text-muted-foreground">
        Start building your personal fragrance library.
      </p>
      <Button onClick={onAddClick} className="mt-6">
        Add First Perfume
      </Button>
    </div>
  );
};
