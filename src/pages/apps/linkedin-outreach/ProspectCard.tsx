import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, LinkedinIcon, BrainCircuit, UserPlus, Send, CheckCircle, Sparkles, Copy, Check, Loader2 } from "lucide-react"; // <-- FIX IS HERE
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Prospect } from "../LinkedInOutreachTool";
import { differenceInDays, format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { type OutreachIntelligence } from "@/services/prospectorService";

interface ProspectCardProps {
  prospect: Prospect;
  onUpdate: (id: string, updates: Partial<Prospect>) => void;
  onGenerateBrief: (prospect: Prospect) => void;
  onGenerateOutreachIntel: (prospect: Prospect) => Promise<OutreachIntelligence | null>;
}

// Hot-o-Meter component
const HotOMeter = ({ score }: { score: number }) => {
    const getColor = (s: number) => {
        if (s <= 4) return 'bg-red-500';
        if (s <= 7) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    return (
        <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className={`${getColor(score)} h-2.5 rounded-full`} style={{ width: `${score * 10}%` }}></div>
            </div>
            <span className={`font-bold text-lg ${getColor(score).replace('bg-', 'text-')}`}>{score}/10</span>
        </div>
    );
};


const DiscoveredCardContent = ({ prospect, onUpdate, onGenerateOutreachIntel }: { prospect: Prospect, onUpdate: ProspectCardProps['onUpdate'], onGenerateOutreachIntel: ProspectCardProps['onGenerateOutreachIntel'] }) => {
    const [intel, setIntel] = useState<OutreachIntelligence | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        const result = await onGenerateOutreachIntel(prospect);
        if (result) {
            setIntel(result);
        }
        setIsLoading(false);
    };

    const handleCopy = () => {
        if (intel?.introMessage) {
            navigator.clipboard.writeText(intel.introMessage);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };
    
    const handleSentRequest = () => {
      onUpdate(prospect.id, { status: 'pending', request_sent_at: new Date().toISOString() });
      window.open(prospect.linkedin_url, "_blank"); // Open profile to send request
    };

    if (!intel && !isLoading) {
        return <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleGenerate}><Sparkles className="mr-2 h-4 w-4" />Generate Outreach AI</Button>
    }

    if (isLoading) {
        return <div className="text-sm text-muted-foreground text-center p-4">Generating AI Intel... <Loader2 className="h-4 w-4 animate-spin inline-block"/></div>
    }

    if (intel) {
        return (
            <div className="mt-4 space-y-4">
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Relevance Score (Hot-o-Meter)</label>
                    <HotOMeter score={intel.relevanceScore} />
                </div>
                <div>
                    <label htmlFor={`intro-${prospect.id}`} className="text-xs font-medium text-muted-foreground">AI-Generated Intro Message</label>
                    <Textarea id={`intro-${prospect.id}`} value={intel.introMessage} readOnly className="mt-1 text-sm h-28"/>
                     <Button variant="ghost" size="sm" onClick={handleCopy} className="w-full mt-1">
                        {hasCopied ? <><Check className="mr-2 h-4 w-4 text-green-500"/> Copied!</> : <><Copy className="mr-2 h-4 w-4"/> Copy Message</>}
                    </Button>
                </div>
                <Button variant="default" size="sm" className="w-full" onClick={handleSentRequest}>
                    <Send className="mr-2 h-4 w-4" /> I've Sent a Connection Request
                </Button>
            </div>
        )
    }
    
    return null;
}


const NurtureStageSelect = ({ prospect, onUpdate }: { prospect: Prospect, onUpdate: ProspectCardProps['onUpdate']}) => {
    const stages = [
        { value: 'new_connection', label: 'New Connection' }, { value: 'first_message_sent', label: 'Messaged' }, { value: 'replied', label: 'Replied' }, { value: 'booked_call', label: 'Booked Call' }, { value: 'closed_not_a_fit', label: 'Closed / Not a Fit' },
    ];
    return (
        <Select defaultValue={prospect.nurture_stage || 'new_connection'} onValueChange={(value) => onUpdate(prospect.id, { nurture_stage: value as Prospect['nurture_stage'] })}>
            <SelectTrigger className="w-full mt-4 bg-secondary"><SelectValue placeholder="Update Stage..." /></SelectTrigger>
            <SelectContent>{stages.map(stage => (<SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>))}</SelectContent>
        </Select>
    );
};


export const ProspectCard = ({ prospect, onUpdate, onGenerateBrief, onGenerateOutreachIntel }: ProspectCardProps) => {
  const { id, name, title, company, location, linkedin_url, prospect_brief, status, request_sent_by, request_sent_at } = prospect;

  const handleMoveToConnected = () => { onUpdate(id, { status: 'connected', connected_at: new Date().toISOString() }); };
  const handleMoveToNurture = () => { onUpdate(id, { status: 'nurture', messaged_at: new Date().toISOString(), nurture_stage: 'first_message_sent' }); };
  const daysSinceSent = request_sent_at ? differenceInDays(new Date(), new Date(request_sent_at)) : 0;

  const renderActions = () => {
    switch (status) {
      case 'discovered': return <DiscoveredCardContent prospect={prospect} onUpdate={onUpdate} onGenerateOutreachIntel={onGenerateOutreachIntel} />;
      case 'pending':
        return (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-center text-muted-foreground p-2 bg-background rounded-md">Request sent {daysSinceSent} day{daysSinceSent !== 1 && 's'} ago.</div>
            <Button variant="default" size="sm" className="w-full" onClick={handleMoveToConnected}><CheckCircle className="mr-2 h-4 w-4" /> Mark as Connected</Button>
          </div>
        );
      case 'connected':
          return (
            <div className="mt-4 space-y-2">
                <div className="text-xs text-center text-muted-foreground p-2 bg-background rounded-md">Connected on {prospect.connected_at ? format(new Date(prospect.connected_at), 'MMM d, yyyy') : 'N/A'}</div>
                <Button variant="default" size="sm" className="w-full" onClick={handleMoveToNurture}><Send className="mr-2 h-4 w-4" /> Move to Nurture (Messaged)</Button>
            </div>
          );
      case 'nurture': return <NurtureStageSelect prospect={prospect} onUpdate={onUpdate} />;
      default: return null;
    }
  };

  const statusBadge = () => {
    switch(prospect.nurture_stage) {
        case 'new_connection': return <Badge variant="secondary">New Connection</Badge>; case 'first_message_sent': return <Badge variant="default" className="bg-blue-600">Messaged</Badge>; case 'replied': return <Badge variant="default" className="bg-green-600">Replied</Badge>; case 'booked_call': return <Badge variant="default" className="bg-purple-600">Booked Call</Badge>; case 'closed_not_a_fit': return <Badge variant="destructive">Closed</Badge>; default: return null;
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
          <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /><span>{company}</span></div>
          <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{location}</span></div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-blue-400 hover:text-blue-300 px-0" onClick={() => window.open(linkedin_url, "_blank")}><LinkedinIcon className="mr-2 h-4 w-4" /> Open LinkedIn Profile</Button>
      </div>
      <div className="mt-4">{renderActions()}</div>
    </Card>
  );
};