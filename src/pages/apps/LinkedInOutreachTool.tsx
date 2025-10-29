import { useState, useEffect, useMemo, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { SearchForm } from "./linkedin-outreach/SearchForm";
import { ProspectResults } from "./linkedin-outreach/ProspectResults";
import { findProspects, generateProspectBrief, generateRelevanceSummary, type Prospect as ApiProspect, type SearchResult } from "@/services/prospectorService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useUser, useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProspectCard } from "./linkedin-outreach/ProspectCard";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export type Prospect = {
  id: string; user_id: string; created_at: string; name: string; title: string; company: string; location: string; linkedin_url: string; snippet: string; prospect_brief?: string | null; status: 'discovered' | 'pending' | 'connected' | 'nurture' | 'archived'; request_sent_by?: 'Max' | 'Mike' | null; request_sent_at?: string | null; connected_at?: string | null; messaged_at?: string | null; nurture_stage?: 'new_connection' | 'first_message_sent' | 'replied' | 'booked_call' | 'closed_not_a_fit' | null; notes?: string | null;
};

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="text-center py-10 bg-card rounded-lg mt-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
    </div>
);

const ProspectList = ({ prospects, stage, onUpdateProspect, onGenerateBrief }: { prospects: Prospect[], stage: string, onUpdateProspect: (id: string, updates: Partial<Prospect>) => void, onGenerateBrief: (prospect: Prospect) => void }) => {
    if (prospects.length === 0) {
        const messages: Record<string, { title: string, description: string }> = {
            'outreach': { title: "Outreach List Empty", description: "Use the 'Search' tab to find and save new prospects." }, 'pending': { title: "No Pending Connections", description: "Send connection requests from the 'Outreach' list." }, 'connected': { title: "No Connections Yet", description: "Once a prospect accepts your request, move them here from 'Pending'." }, 'nurture': { title: "Nurture Funnel is Empty", description: "Move connected prospects here after sending the first message." },
        };
        const { title, description } = messages[stage];
        return <EmptyState title={title} description={description} />;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {prospects.map(p => <ProspectCard key={p.id} prospect={p} onUpdate={onUpdateProspect} onGenerateBrief={onGenerateBrief} />)}
        </div>
    );
};

const LinkedInOutreachTool = () => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const { toast } = useToast();
    const [liveSearchResults, setLiveSearchResults] = useState<ApiProspect[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAppending, setIsAppending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [nextStartIndex, setNextStartIndex] = useState<number | null>(null);
    const [allProspects, setAllProspects] = useState<Prospect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProspects = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const token = await getToken({ template: 'supabase' });
        const authedSupabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
        const { data, error } = await authedSupabase.from('prospects').select('*').eq('user_id', user.id).neq('status', 'archived').order('created_at', { ascending: false });
        if (error) {
            setError(error.message);
            toast({ title: "Error", description: "Could not fetch your prospects.", variant: "destructive" });
        } else {
            setAllProspects(data as Prospect[]);
        }
        setIsLoading(false);
    }, [user, toast, getToken]);

    useEffect(() => { fetchProspects(); }, [fetchProspects]);

    const enrichProspectsWithSummary = async (prospects: ApiProspect[], query: string): Promise<ApiProspect[]> => {
        const summaryPromises = prospects.map(async (prospect) => {
            try {
                const summary = await generateRelevanceSummary(prospect, query);
                return { ...prospect, relevanceSummary: summary };
            } catch (e) {
                console.error(`Failed to generate summary for ${prospect.name}`, e);
                return { ...prospect, relevanceSummary: "AI summary could not be generated." };
            }
        });
        return Promise.all(summaryPromises);
    };

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        setLiveSearchResults([]);
        setError(null);
        setSearchQuery(query);
        try {
            const results = await findProspects(query, 1);
            setNextStartIndex(results.nextStartIndex);
            const enrichedResults = await enrichProspectsWithSummary(results.prospects, query);
            setLiveSearchResults(enrichedResults);
        } catch (e: any) {
            setError(e.message);
            toast({ title: "Search Error", description: e.message, variant: "destructive" });
        }
        setIsSearching(false);
    };

    const handleLoadMore = async () => {
        if (!nextStartIndex || !searchQuery || isAppending) return;
        setIsAppending(true);
        setError(null);
        try {
            const results = await findProspects(searchQuery, nextStartIndex);
            setNextStartIndex(results.nextStartIndex);
            const enrichedResults = await enrichProspectsWithSummary(results.prospects, searchQuery);
            setLiveSearchResults(prev => [...prev, ...enrichedResults]);
        } catch (e: any) {
            setError(e.message);
            toast({ title: "Error Loading More", description: e.message, variant: "destructive" });
        }
        setIsAppending(false);
    };

    const handleSaveProspect = async (prospect: ApiProspect) => {
        if (!user) return;
        toast({ title: `Saving ${prospect.name}...` });
        const token = await getToken({ template: 'supabase' });
        const authedSupabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
        const { error } = await authedSupabase.from('prospects').insert({ user_id: user.id, name: prospect.name, title: prospect.title, company: prospect.company, location: prospect.location, linkedin_url: prospect.linkedinUrl, snippet: prospect.snippet, status: 'discovered', });
        if (error) {
            if (error.code === '23505') {
                toast({ title: "Already Saved", description: `${prospect.name} is already in your prospect list.` });
            } else {
                toast({ title: "Save Failed", description: error.message, variant: "destructive" });
            }
        } else {
            toast({ title: "Prospect Saved!", description: `${prospect.name} has been added to your Outreach list.` });
            fetchProspects();
        }
    };

    const handleGenerateBrief = async (prospect: Prospect) => {
        toast({ title: `Generating brief for ${prospect.name}...` });
        try {
            const brief = await generateProspectBrief(prospect);
            await handleUpdateProspect(prospect.id, { prospect_brief: brief });
        } catch (e: any) {
            toast({ title: "Brief Generation Failed", description: e.message, variant: "destructive" });
        }
    };

    const handleUpdateProspect = async (prospectId: string, updates: Partial<Prospect>) => {
        const token = await getToken({ template: 'supabase' });
        const authedSupabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
        const { error } = await authedSupabase.from('prospects').update(updates).eq('id', prospectId);
        if (error) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Prospect updated." });
            fetchProspects();
        }
    };

    const savedProspectUrls = useMemo(() => new Set(allProspects.map(p => p.linkedin_url)), [allProspects]);
    const discoveredProspects = useMemo(() => allProspects.filter(p => p.status === 'discovered'), [allProspects]);
    const pendingProspects = useMemo(() => allProspects.filter(p => p.status === 'pending'), [allProspects]);
    const connectedProspects = useMemo(() => allProspects.filter(p => p.status === 'connected'), [allProspects]);
    const nurtureProspects = useMemo(() => allProspects.filter(p => p.status === 'nurture'), [allProspects]);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-auto">
                        <div className="py-8 px-12">
                            <h1 className="text-3xl font-bold text-white mb-2">LinkedIn Outreach & Nurture Tool</h1>
                            <p className="text-muted-foreground mb-8">
                                Manage your entire outreach workflow, from finding prospects to nurturing connections.
                            </p>
                            <Tabs defaultValue="search" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="search">Search</TabsTrigger>
                                    <TabsTrigger value="outreach">Outreach ({discoveredProspects.length})</TabsTrigger>
                                    <TabsTrigger value="pending">Pending ({pendingProspects.length})</TabsTrigger>
                                    <TabsTrigger value="connected">Connected ({connectedProspects.length})</TabsTrigger>
                                    <TabsTrigger value="nurture">Nurture ({nurtureProspects.length})</TabsTrigger>
                                </TabsList>
                                <TabsContent value="search">
                                    <SearchForm onSearch={handleSearch} isLoading={isSearching} />
                                    <ProspectResults results={liveSearchResults} isLoading={isSearching} isAppending={isAppending} hasMore={nextStartIndex !== null} onLoadMore={handleLoadMore} onSave={handleSaveProspect} savedProspectUrls={savedProspectUrls} />
                                </TabsContent>
                                <TabsContent value="outreach">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto mt-8" /> : <ProspectList prospects={discoveredProspects} stage="outreach" onUpdateProspect={handleUpdateProspect} onGenerateBrief={handleGenerateBrief} />}
                                </TabsContent>
                                <TabsContent value="pending">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto mt-8" /> : <ProspectList prospects={pendingProspects} stage="pending" onUpdateProspect={handleUpdateProspect} onGenerateBrief={handleGenerateBrief} />}
                                </TabsContent>
                                <TabsContent value="connected">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto mt-8" /> : <ProspectList prospects={connectedProspects} stage="connected" onUpdateProspect={handleUpdateProspect} onGenerateBrief={handleGenerateBrief} />}
                                </TabsContent>
                                <TabsContent value="nurture">
                                    {isLoading ? <Loader2 className="animate-spin mx-auto mt-8" /> : <ProspectList prospects={nurtureProspects} stage="nurture" onUpdateProspect={handleUpdateProspect} onGenerateBrief={handleGenerateBrief} />}
                                </TabsContent>
                            </Tabs>
                            {error && (
                                <Alert variant="destructive" className="mt-8">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>An Error Occurred</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LinkedInOutreachTool;