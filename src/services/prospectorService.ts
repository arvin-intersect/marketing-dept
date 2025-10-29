export interface Prospect {
  name: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  snippet: string;
  image?: string;
  prospectBrief?: string;
  relevanceSummary?: string; // New field for the one-line summary
}

export interface SearchResult {
  prospects: Prospect[];
  nextStartIndex: number | null;
  totalResults: number;
}

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CX = import.meta.env.VITE_GOOGLE_CX;
const API_URL = "https://www.googleapis.com/customsearch/v1";

if (!API_KEY || !CX) {
  throw new Error("Missing VITE_GOOGLE_API_KEY or VITE_GOOGLE_CX in .env.local file.");
}

export const findProspects = async (query: string, startIndex = 1): Promise<SearchResult> => {
  const fullQuery = `${query} site:linkedin.com/in`;
  const url = `${API_URL}?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(fullQuery)}&start=${startIndex}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Google Search API Error:", errorData);
    throw new Error(errorData.error?.message || "An error occurred while searching.");
  }

  const data = await response.json();
  const items = data.items || [];

  const prospects: Prospect[] = items.map((item: any) => {
    const titleParts = item.title.split(" - ");
    const name = titleParts[0] || "Name not available";
    const restOfTitle = titleParts.slice(1).join(" - ").replace(" | LinkedIn", "");
    const titleCompanyParts = restOfTitle.split(" at ");
    const title = titleCompanyParts[0] || "Title not specified";
    const company = titleCompanyParts[1] || "Company not specified";

    return {
      name: name,
      title: title,
      company: company,
      location: item.pagemap?.metatags?.[0]?.["og:locality"] || "Location not specified",
      linkedinUrl: item.link || "#",
      snippet: item.snippet || "No additional information.",
      image: item.pagemap?.cse_thumbnail?.[0]?.src || undefined,
    };
  });

  return {
    prospects,
    nextStartIndex: data.queries?.nextPage?.[0]?.startIndex || null,
    totalResults: parseInt(data.searchInformation?.totalResults || "0", 10),
  };
};

// Generates the detailed brief for a saved prospect
export const generateProspectBrief = async (prospect: { name: string; title: string; company: string; snippet: string; }): Promise<string> => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${apiUrl}/api/generate-brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...prospect, type: 'brief' }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect to the brief generation service.");
  }

  const data = await response.json();
  return data.brief || "Could not generate a brief at this time.";
};

// Generates the one-line relevance summary for search results
export const generateRelevanceSummary = async (prospect: Prospect, searchQuery: string): Promise<string> => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${apiUrl}/api/generate-brief`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...prospect, type: 'summary', searchQuery }),
  });

  if (!response.ok) {
      throw new Error("Failed to connect to the summary generation service.");
  }

  const data = await response.json();
  return data.summary || "AI summary not available.";
};