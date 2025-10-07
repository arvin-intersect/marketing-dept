import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AIEmailComposer = () => {
  const [topic, setTopic] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateEmail = async () => {
    if (!topic) {
      alert("Please enter a topic for the email.");
      return;
    }
    
    setIsLoading(true);
    setGeneratedEmail("");

    // In a real app, you would make an API call to your backend here.
    // For now, we'll simulate a delay and return dummy text.
    setTimeout(() => {
      setGeneratedEmail(
        `Subject: Following Up: ${topic}\n\n` +
        `Dear [Recipient Name],\n\n` +
        `I hope this email finds you well.\n\n` +
        `I am writing to follow up on our recent conversation about ${topic}. ` +
        `I was wondering if you have had a chance to review the materials we discussed and if you have any questions I can help answer.\n\n` +
        `We believe our solution can provide significant value by addressing [mention a key benefit or pain point].\n\n` +
        `Please let me know if you are available for a brief call next week to discuss this further.\n\n` +
        `Best regards,\n\n` +
        `[Your Name]`
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto py-8 px-12">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>AI Email Composer</CardTitle>
                <CardDescription>
                  Enter a topic or goal, and let the AI generate a professional email for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Email Topic</Label>
                    <Input 
                      id="topic" 
                      placeholder="e.g., Follow up on our sales call" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button onClick={handleGenerateEmail} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Email"
                    )}
                  </Button>

                  {generatedEmail && (
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="result">Generated Email</Label>
                      <Textarea 
                        id="result" 
                        readOnly 
                        value={generatedEmail} 
                        className="h-64"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AIEmailComposer;