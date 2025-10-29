export interface Prospect {
  name: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  snippet: string;
  image?: string;
  prospectBrief?: string;
  relevanceSummary?: string;
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
    // --- Improved Parsing Logic ---
    const titleParts = item.title.split(" - ");
    const name = titleParts[0] || "Name not available";
    
    let title = "Title not specified";
    let company = "Company not specified";
    
    // The rest of the string after the name
    const profileInfo = titleParts.slice(1).join(" - ").replace(" | LinkedIn", "");
    
    // The first role listed is usually the current primary one
    const primaryRoleString = profileInfo.split(" | ")[0];
    
    // Split the primary role by " at " or " @ "
    const roleParts = primaryRoleString.split(/ at | @ /);
    
    if (roleParts.length > 1) {
      title = roleParts[0].trim();
      // The rest is likely the company, take the first part of it before any other separators
      company = roleParts.slice(1).join(" @ ").split(/ - | \| /)[0].trim();
    } else {
      // If no "at" or "@", the whole string is the title
      title = primaryRoleString.trim();
    }

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