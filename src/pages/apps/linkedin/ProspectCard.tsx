import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, LinkedinIcon, BrainCircuit, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProspectCardProps {
  name: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  prospectBrief?: string;
}

export const ProspectCard = ({
  name,
  title,
  company,
  location,
  linkedinUrl,
  prospectBrief,
}: ProspectCardProps) => {
  return (
    <Card className="p-6 shadow-sm flex flex-col bg-muted/50">
      <div className="space-y-4 flex-grow">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-muted-foreground">{title}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{company}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        <div className="p-3 bg-background/50 rounded-lg text-left">
          <div className="flex items-start gap-2 mb-2">
            <BrainCircuit className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs font-medium text-primary">AI Prospect Brief</span>
          </div>
          {prospectBrief ? (
            <div>
              <p className="text-sm text-foreground whitespace-pre-line">{prospectBrief}</p>
              <p className="text-xs text-muted-foreground italic mt-3">
                Note: This brief is AI-generated. Always verify details.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>Generating AI brief...</span>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          )}
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        className="w-full mt-4"
        onClick={() => window.open(linkedinUrl, "_blank")}
      >
        <LinkedinIcon className="mr-2 h-4 w-4" />
        View Profile
      </Button>
    </Card>
  );
};