import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Search, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe who you're looking for.",
        variant: "destructive",
      });
      return;
    }
    onSearch(prompt);
  };

  return (
    <Card className="p-6 shadow-card bg-card border border-border">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt-textarea" className="text-sm font-medium text-left block text-foreground">
            Describe Your Ideal Prospect
          </label>
          <Textarea
            id="prompt-textarea"
            placeholder="Example: CEO of a healthcare SaaS company in Singapore with 50-200 employees"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[70px] resize-none"
          />
          <p className="text-xs text-muted-foreground text-left">
            Include role, industry, location, company size, or any specific keywords.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={isLoading} className="w-full group">
          {isLoading ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              Searching LinkedIn...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Find Prospects
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};