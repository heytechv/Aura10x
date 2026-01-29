import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardContent>
      <CardFooter className="p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};
