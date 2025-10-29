import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { Users, Bug, Flame, Mail, FileSearch, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.svg');
        if (response.status === 404) {
          console.log('Logo not found, would create one in a real app');
        }
      } catch (error) {
        console.log('Error checking logo:', error);
      }
    };
    checkLogo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              
              <div className="mb-12">
                <CreationCard />
              </div>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Quick Starts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* --- ACTIVE CARD --- */}
                  <div 
                    className="feature-card bg-muted rounded-lg p-4 flex items-start gap-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate("/app/linkedin-outreach-tool")}
                  >
                    <div className="p-3 rounded-lg bg-icon-blue/10 flex items-center justify-center">
                      <Users size={24} className="text-icon-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">LinkedIn Outreach & Nurture</h3>
                      <p className="text-sm text-gray-400 mt-1">Find, connect, and track outreach prospects.</p>
                    </div>
                  </div>
                  
                  {/* --- WIP CARD --- */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted rounded-lg p-4 flex items-start gap-4 opacity-50 cursor-not-allowed">
                          <div className="p-3 rounded-lg bg-icon-green/10 flex items-center justify-center">
                            <Bug size={24} className="text-icon-green" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">SEO Bug Hunter</h3>
                              <Badge variant="outline" className="ml-2">WIP</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Scan any URL to find and fix critical SEO errors.</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Work in Progress</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* --- WIP CARD --- */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted rounded-lg p-4 flex items-start gap-4 opacity-50 cursor-not-allowed">
                          <div className="p-3 rounded-lg bg-icon-yellow/10 flex items-center justify-center">
                            <Flame size={24} className="text-icon-yellow" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">Lead Temperature Analysis</h3>
                              <Badge variant="outline" className="ml-2">WIP</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Analyze lead engagement to prioritize hot prospects.</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Work in Progress</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* --- ACTIVE CARD --- */}
                  <div 
                    className="feature-card bg-muted rounded-lg p-4 flex items-start gap-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate("/app/ai-email-composer")}
                  >
                    <div className="p-3 rounded-lg bg-icon-purple/10 flex items-center justify-center">
                      <Mail size={24} className="text-icon-purple" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">AI Email Composer</h3>
                      <p className="text-sm text-gray-400 mt-1">Generate persuasive outreach emails in any tone.</p>
                    </div>
                  </div>

                  {/* --- WIP CARD --- */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted rounded-lg p-4 flex items-start gap-4 opacity-50 cursor-not-allowed">
                          <div className="p-3 rounded-lg bg-icon-pink/10 flex items-center justify-center">
                            <FileSearch size={24} className="text-icon-pink" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">Competitor Strategy Analyzer</h3>
                              <Badge variant="outline" className="ml-2">WIP</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Deconstruct competitor marketing and ad campaigns.</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Work in Progress</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* --- WIP CARD --- */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted rounded-lg p-4 flex items-start gap-4 opacity-50 cursor-not-allowed">
                          <div className="p-3 rounded-lg bg-icon-green/10 flex items-center justify-center">
                            <FileText size={24} className="text-icon-green" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-white">AI Content Studio</h3>
                              <Badge variant="outline" className="ml-2">WIP</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Instantly generate blog posts and social captions.</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Work in Progress</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </section>
              
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Featured Apps</h2>
                  <Badge variant="outline" className="ml-2">WIP</Badge>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-50 cursor-not-allowed">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-none">
                          <FeaturedAppCard 
                            title="Create Blog Banner"
                            subtitle="By Intersect AI"
                            imageSrc="/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png"
                            isNew
                          />
                          <FeaturedAppCard 
                            title="Create PPT Slides"
                            subtitle="By Intersect AI"
                            imageSrc="/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png"
                          />
                          <FeaturedAppCard 
                            title="Create E-Book Cover"
                            subtitle="By Intersect AI"
                            imageSrc="/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png"
                          />
                          <FeaturedAppCard 
                            title="Create Facebook Ads"
                            subtitle="By Intersect AI"
                            imageSrc="/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent><p>Work in Progress</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </section>
              
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;