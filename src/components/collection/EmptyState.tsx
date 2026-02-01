import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Twoja kolekcja jest pusta</h2>
      <p className="mt-2 text-muted-foreground">Zacznij budować swoją osobistą bibliotekę zapachów.</p>
      <Button onClick={onAddClick} className="mt-6" data-test-id="empty-state-add-btn">
        Dodaj pierwsze perfumy
      </Button>
    </div>
  );
};
