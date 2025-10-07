import { ProspectCard } from "./ProspectCard";
import { type Prospect } from "@/services/prospectorService";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, ServerCrash } from "lucide-react";

interface ProspectResultsProps {
  prospects: Prospect[];
  isLoading: boolean;
  isAppending: boolean;
  isGenerating: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ProspectCardSkeleton = () => (
  <Card className="p-6 bg-muted/50">
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2 text-sm">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="p-3 bg-background/50 rounded-lg space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  </Card>
);

export const ProspectResults = ({
  prospects,
  isLoading,
  isAppending,
  isGenerating,
  error,
  hasMore,
  onLoadMore,
}: ProspectResultsProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProspectCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 bg-destructive/10 text-destructive-foreground rounded-lg border border-destructive">
          <ServerCrash className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">{error}</p>
        </div>
      );
    }

    if (prospects.length === 0) {
      return (
        <div className="text-center py-10 bg-card rounded-lg">
          <h3 className="text-xl font-semibold">No Prospects Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search criteria for better results.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prospects.map((prospect, index) => (
          <ProspectCard
            key={`${prospect.linkedinUrl}-${index}`}
            name={prospect.name}
            title={prospect.title}
            company={prospect.company}
            location={prospect.location}
            linkedinUrl={prospect.linkedinUrl}
            prospectBrief={prospect.prospectBrief}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderContent()}
      {hasMore && !isLoading && (
        <div className="text-center mt-12">
          <Button onClick={onLoadMore} disabled={isAppending || isGenerating} size="lg">
            {isAppending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Prospects"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};