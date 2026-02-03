import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export function RecordCardSkeleton() {
   return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b gap-2">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      </CardHeader>
      <CardFooter className="flex justify-end mt-auto">
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
      </CardFooter>
    </Card>
  );
}  