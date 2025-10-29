import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, LinkedinIcon, BrainCircuit, UserPlus, Send, CheckCircle, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Prospect } from "../LinkedInOutreachTool";
import { differenceInDays, format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface ProspectCardProps {
  prospect: Prospect;
  onUpdate: (id: string, updates: Partial<Prospect>) => void;
  onGenerateBrief: (prospect: Prospect) => void;
}

const NurtureStageSelect = ({ prospect, onUpdate }: { prospect: Prospect, onUpdate: ProspectCardProps['onUpdate']}) => {
    const stages = [
        { value: 'new_connection', label: 'New Connection' },
        { value: 'first_message_sent', label: 'Messaged' },
        { value: 'replied', label: 'Replied' },
        { value: 'booked_call', label: 'Booked Call' },
        { value: 'closed_not_a_fit', label: 'Closed / Not a Fit' },
    ];
    
    return (
        <Select 
            defaultValue={prospect.nurture_stage || 'new_connection'}
            onValueChange={(value) => onUpdate(prospect.id, { nurture_stage: value as Prospect['nurture_stage'] })}
        >
            <SelectTrigger className="w-full mt-4 bg-secondary">
                <SelectValue placeholder="Update Stage..." />
            </SelectTrigger>
            <SelectContent>
                {stages.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};


export const ProspectCard = ({ prospect, onUpdate, onGenerateBrief }: ProspectCardProps) => {
  const { id, name, title, company, location, linkedin_url, prospect_brief, status, request_sent_by, request_sent_at } = prospect;

  const handleConnect = (sender: 'Max' | 'Mike') => {
    onUpdate(id, { status: 'pending', request_sent_by: sender, request_sent_at: new Date().toISOString() });
    window.open(linkedin_url, "_blank"); // Open LinkedIn profile to send request
  };

  const handleMoveToConnected = () => {
    onUpdate(id, { status: 'connected', connected_at: new Date().toISOString() });
  };
  
  const handleMoveToNurture = () => {
    onUpdate(id, { status: 'nurture', messaged_at: new Date().toISOString(), nurture_stage: 'first_message_sent' });
  };

  const daysSinceSent = request_sent_at ? differenceInDays(new Date(), new Date(request_sent_at)) : 0;

  const renderActions = () => {
    switch (status) {
      case 'discovered':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => handleConnect('Max')}><UserPlus className="mr-2 h-4 w-4" />Connect as Max</Button>
            <Button variant="outline" size="sm" onClick={() => handleConnect('Mike')}><UserPlus className="mr-2 h-4 w-4" />Connect as Mike</Button>
          </div>
        );
      case 'pending':
        return (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-center text-muted-foreground p-2 bg-background rounded-md">
                Request sent by {request_sent_by} {daysSinceSent} day{daysSinceSent !== 1 && 's'} ago.
            </div>
            <Button variant="default" size="sm" className="w-full" onClick={handleMoveToConnected}>
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Connected
            </Button>
          </div>
        );
      case 'connected':
          return (
            <div className="mt-4 space-y-2">
                <div className="text-xs text-center text-muted-foreground p-2 bg-background rounded-md">
                    Connected on {prospect.connected_at ? format(new Date(prospect.connected_at), 'MMM d, yyyy') : 'N/A'}
                </div>
                <Button variant="default" size="sm" className="w-full" onClick={handleMoveToNurture}>
                    <Send className="mr-2 h-4 w-4" /> Move to Nurture (Messaged)
                </Button>
            </div>
          );
      case 'nurture':
        return <NurtureStageSelect prospect={prospect} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  const statusBadge = () => {
    switch(prospect.nurture_stage) {
        case 'new_connection': return <Badge variant="secondary">New Connection</Badge>;
        case 'first_message_sent': return <Badge variant="default" className="bg-blue-600">Messaged</Badge>;
        case 'replied': return <Badge variant="default" className="bg-green-600">Replied</Badge>;
        case 'booked_call': return <Badge variant="default" className="bg-purple-600">Booked Call</Badge>;
        case 'closed_not_a_fit': return <Badge variant="destructive">Closed</Badge>;
        default: return null;
    }
  }

  return (
    <Card className="p-6 shadow-sm flex flex-col bg-muted/50 border border-border">
      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">{name}</h3>
                <p className="text-muted-foreground">{title}</p>
            </div>
            {status === 'nurture' && statusBadge()}
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
            {prospect_brief ? (
                <p className="text-sm text-foreground whitespace-pre-line">{prospect_brief}</p>
            ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => onGenerateBrief(prospect)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Brief
                </Button>
            )}
        </div>
      </div>

      <div className="mt-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-blue-400 hover:text-blue-300 px-0" onClick={() => window.open(linkedin_url, "_blank")}>
            <LinkedinIcon className="mr-2 h-4 w-4" /> Open LinkedIn Profile
        </Button>
        {renderActions()}
      </div>
    </Card>
  );
};