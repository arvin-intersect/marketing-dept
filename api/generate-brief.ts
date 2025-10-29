import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  // FIX: Destructure 'type' outside the try block to make it available in the catch block.
  const { type } = req.body;

  try {
    const { name, title, company, snippet, searchQuery } = req.body;

    if (!name || !title || !company) {
      return res.status(400).json({ error: "Missing required prospect information." });
    }

    let prompt;
    if (type === 'summary' && searchQuery) {
      // Prompt for the new one-line relevance summary
      prompt = `
        You are a recruiting analyst. A user searched for prospects with the query: "${searchQuery}".
        Based on the following LinkedIn profile data, generate a single, concise sentence (max 20 words) explaining who this person is and their relevance to the search query.
        Start the sentence with their role. If they seem irrelevant, state that briefly.

        Profile Data:
        - Name: ${name}
        - Title: ${title}
        - Company: ${company}
        - Snippet: "${snippet}"

        Output ONLY the single sentence. No preamble or extra text.
      `;
    } else {
      // Original prompt for the detailed brief
      prompt = `
        You are a sales intelligence analyst for "Intersect AI".
        Generate a concise "Prospect Brief" in plain text based on this info.
        
        About Intersect AI: We build custom AI solutions for business efficiency and ROI.

        Prospect:
        - Name: ${name}
        - Title: ${title}
        - Company: ${company}
        - Profile Snippet: "${snippet}"

        Instructions:
        Based ONLY on the info provided, generate a brief with these bullet points. Infer where necessary, but state it's an inference.

        *   Key Role & Focus: (Infer primary responsibilities. Leadership? Technical? Strategic?)
        *   Potential Pain Points: (What challenges might they face that Intersect AI could solve?)
        *   Inferred Personality Trait: (Use phrases like "Appears to be...", "Likely values...". e.g., 'data-driven', 'results-oriented').
        *   Conversation Starter: (A relevant question to begin outreach.)

        Output ONLY the bulleted list as plain text. No markdown, preamble, or extra text.
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const responsePayload = type === 'summary' ? { summary: text.trim() } : { brief: text.trim() };
    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error("Error in generate-brief function:", error);
    // FIX: 'type' is now accessible here, so this line will work correctly.
    const errorMessage = type === 'summary' ? "Failed to generate summary." : "Failed to generate prospect brief.";
    return res.status(500).json({ error: errorMessage });
  }
}