import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { SearchForm } from "./linkedin/SearchForm";
import { ProspectResults } from "./linkedin/ProspectResults";
import {
  findProspects,
  generateProspectBrief,
  type Prospect,
  type SearchResult,
} from "@/services/prospectorService";
import { useToast } from "@/components/ui/use-toast";

const LinkedInProspector = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [nextStartIndex, setNextStartIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const processAndSetProspects = (newProspects: Prospect[], isLoadMore = false) => {
    if (newProspects.length === 0) return;

    setIsGenerating(true);
    toast({ title: "Generating AI Briefs...", description: "Please wait a moment." });

    const briefPromises = newProspects.map(async (prospect) => {
      try {
        const brief = await generateProspectBrief(prospect);
        return { ...prospect, prospectBrief: brief };
      } catch (e) {
        console.error(`Failed to generate brief for ${prospect.name}`, e);
        return { ...prospect, prospectBrief: "AI brief generation failed." };
      }
    });

    Promise.all(briefPromises).then(prospectsWithBriefs => {
      setProspects(prev => {
        if (isLoadMore) {
          // Create a map for quick lookups
          const newProspectsMap = new Map(prospectsWithBriefs.map(p => [p.linkedinUrl, p]));
          // Update existing prospects or add new ones
          return prev.map(p => newProspectsMap.get(p.linkedinUrl) || p);
        }
        return prospectsWithBriefs;
      });
      setIsGenerating(false);
      toast({ title: "Success", description: "All AI briefs have been generated." });
    });
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchInitiated(true);
    setProspects([]);
    setError(null);
    setCurrentQuery(query);

    try {
      const results: SearchResult = await findProspects(query, 1);
      setProspects(results.prospects);
      setNextStartIndex(results.nextStartIndex);
      setIsLoading(false);

      if (results.prospects.length > 0) {
        processAndSetProspects(results.prospects);
      } else {
        toast({ title: "No Prospects Found", description: "Try adjusting your search criteria." });
      }
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Search Error", description: e.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextStartIndex || !currentQuery) return;
    setIsAppending(true);
    setError(null);
    try {
      const results = await findProspects(currentQuery, nextStartIndex);
      setProspects((prev) => [...prev, ...results.prospects]);
      setNextStartIndex(results.nextStartIndex);
      setIsAppending(false);

      if (results.prospects.length > 0) {
        processAndSetProspects(results.prospects, true);
      }
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Error Loading More", description: e.message, variant: "destructive" });
      setIsAppending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="py-8 px-12">
              <h1 className="text-3xl font-bold text-white mb-2">LinkedIn Prospector</h1>
              <p className="text-muted-foreground mb-8">
                Describe your ideal prospect to find matching LinkedIn profiles with AI-powered analysis.
              </p>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
            {searchInitiated && (
              <div className="px-12 pb-12">
                <ProspectResults
                  prospects={prospects}
                  isLoading={isLoading}
                  isAppending={isAppending}
                  isGenerating={isGenerating}
                  error={error}
                  onLoadMore={handleLoadMore}
                  hasMore={nextStartIndex !== null}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LinkedInProspector;