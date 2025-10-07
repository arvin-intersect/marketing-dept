import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

// STEP 1: DEFINE THE DATA STRUCTURE (with the new llmUsed field)
type AnalyticsData = {
  id: number;
  userName: string;
  timeOfUse: string;
  appUsed: string;
  llmUsed: string; // New field
  tokensConsumed: number;
  isUseful: boolean;
};

// STEP 2: CREATE DUMMY DATA FOR THE UI (with the new llmUsed values)
const dummyData: AnalyticsData[] = [
  { id: 1, userName: "Arvin", timeOfUse: new Date(Date.now() - 3600000).toLocaleString(), appUsed: "AI Email Composer", llmUsed: "GPT-4o", tokensConsumed: 150, isUseful: true },
  { id: 2, userName: "Jane Doe", timeOfUse: new Date(Date.now() - 7200000).toLocaleString(), appUsed: "SEO Bug Hunter", llmUsed: "Claude 3 Sonnet", tokensConsumed: 320, isUseful: true },
  { id: 3, userName: "John Smith", timeOfUse: new Date(Date.now() - 10800000).toLocaleString(), appUsed: "LinkedIn Prospector", llmUsed: "Gemini Pro", tokensConsumed: 85, isUseful: false },
  { id: 4, userName: "Arvin", timeOfUse: new Date(Date.now() - 86400000).toLocaleString(), appUsed: "AI Content Studio", llmUsed: "GPT-4o", tokensConsumed: 500, isUseful: true },
  { id: 5, userName: "Emily White", timeOfUse: new Date(Date.now() - 172800000).toLocaleString(), appUsed: "Create Facebook Ads", llmUsed: "DALL-E 3", tokensConsumed: 210, isUseful: true },
];

// STEP 3 (Future): SUPABASE HANDLERS (currently commented out)
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAnalyticsData(): Promise<AnalyticsData[]> {
  const { data, error } = await supabase
    .from('usage_analytics') // IMPORTANT: Replace 'usage_analytics' with your actual table name in Supabase
    .select('*')
    .order('timeOfUse', { ascending: false });

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return [];
  }
  return data as AnalyticsData[];
}
*/

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    // For now, we use dummy data.
    setAnalyticsData(dummyData);

    // When you're ready to use Supabase, uncomment the code below and the imports above.
    /*
    const loadData = async () => {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data);
    };
    loadData();
    */
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto py-8 px-12">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Time of Use</TableHead>
                      <TableHead>App Used</TableHead>
                      <TableHead>LLM Used</TableHead> {/* New Column Header */}
                      <TableHead className="text-right">Tokens Consumed</TableHead>
                      <TableHead className="text-center">Output Useful?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>{log.timeOfUse}</TableCell>
                        <TableCell>{log.appUsed}</TableCell>
                        <TableCell>{log.llmUsed}</TableCell> {/* New Column Cell */}
                        <TableCell className="text-right">{log.tokensConsumed.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {log.isUseful ? (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Yes</Badge>
                          ) : (
                            <Badge variant="destructive">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;