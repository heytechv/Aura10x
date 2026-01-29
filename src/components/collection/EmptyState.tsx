import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onAddClick: () => void;
};

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Twoja kolekcja jest pusta</h2>
      <p className="mt-2 text-muted-foreground">
        Zacznij budować swoją osobistą bibliotekę zapachów.
      </p>
      <Button onClick={onAddClick} className="mt-6">
        Dodaj pierwsze perfumy
      </Button>
    </div>
  );
};
