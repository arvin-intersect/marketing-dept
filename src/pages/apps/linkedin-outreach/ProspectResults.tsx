import { type Prospect as ApiProspect } from "@/services/prospectorService";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, ExternalLink, Loader2, Sparkles } from "lucide-react";

interface ProspectResultsProps {
  results: ApiProspect[];
  isLoading: boolean;
  isAppending: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSave: (prospect: ApiProspect) => void;
  savedProspectUrls: Set<string>;
}

const ResultSkeleton = () => (
    <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <Skeleton className="h-9 w-24 ml-4" />
    </div>
);

export const ProspectResults = ({
  results,
  isLoading,
  isAppending,
  hasMore,
  onLoadMore,
  onSave,
  savedProspectUrls
}: ProspectResultsProps) => {

    const showResults = results.length > 0;

    if (isLoading && !isAppending) {
        return (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Searching and Analyzing Relevance...</CardTitle>
                </CardHeader>
                <CardContent>
                    {Array.from({ length: 5 }).map((_, i) => <ResultSkeleton key={i} />)}
                </CardContent>
            </Card>
        );
    }
    
    if (!showResults) {
        return null; // Don't render the card if there are no results
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {results.map((prospect) => {
                        const isSaved = savedProspectUrls.has(prospect.linkedinUrl);
                        return (
                            <div key={prospect.linkedinUrl} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                <div className="flex-1 min-w-0">
                                    <a 
                                        href={prospect.linkedinUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group font-semibold text-white truncate inline-flex items-center gap-1.5 hover:underline"
                                    >
                                        {prospect.name}
                                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors" />
                                    </a>
                                    <p className="text-sm text-muted-foreground truncate">{prospect.title} at {prospect.company}</p>
                                    {prospect.relevanceSummary && (
                                        <p className="text-sm text-foreground/80 mt-1 flex items-start gap-2">
                                            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5"/> 
                                            <span>{prospect.relevanceSummary}</span>
                                        </p>
                                    )}
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => onSave(prospect)} 
                                    disabled={isSaved}
                                    variant={isSaved ? "secondary" : "default"}
                                    className="ml-4"
                                >
                                    {isSaved ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Save Prospect
                                        </>
                                    )}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            {hasMore && (
                <CardFooter className="py-4 justify-center">
                    <Button
                        onClick={onLoadMore}
                        disabled={isAppending}
                        variant="outline"
                    >
                        {isAppending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Prospects"
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};