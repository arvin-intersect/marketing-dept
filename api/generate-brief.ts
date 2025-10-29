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
  
  const { type } = req.body;

  try {
    const { name, title, company, snippet, searchQuery } = req.body;

    if (!name || !title || !company) {
      return res.status(400).json({ error: "Missing required prospect information." });
    }

    let prompt;
    let responsePayload = {};

    switch (type) {
      case 'summary':
        prompt = `You are a recruiting analyst. A user searched for prospects with the query: "${searchQuery}". Based on the following LinkedIn profile data, generate a single, concise sentence (max 20 words) explaining who this person is and their relevance to the search query. Start the sentence with their role. If they seem irrelevant, state that briefly. Profile Data: - Name: ${name} - Title: ${title} - Company: ${company} - Snippet: "${snippet}". Output ONLY the single sentence.`;
        const summaryResult = await model.generateContent(prompt);
        responsePayload = { summary: (await summaryResult.response).text().trim() };
        break;

      case 'outreach_intelligence':
        prompt = `
          Analyze the following prospect for a company called "Intersect AI", which builds custom AI solutions for business efficiency.
          Prospect Data:
          - Name: ${name}
          - Title: ${title}
          - Company: ${company}
          - Snippet: "${snippet}"

          Perform two tasks and provide the output as a single JSON object with the keys "relevanceScore" and "introMessage".
          1.  **relevanceScore**: On a scale of 1 to 10, how relevant is this person to Intersect AI? Consider their role (technical, leadership), industry, and potential need for AI solutions. Provide only a single integer.
          2.  **introMessage**: Write a short, personalized, and professional LinkedIn connection request message (max 300 characters). The message should be from the perspective of an Intersect AI team member, subtly referencing their role or company. Do not use placeholders like "[Your Name]".
          
          Example JSON output:
          {
            "relevanceScore": 8,
            "introMessage": "Hi ${name}, saw your work at ${company} and was impressed. As we're both in the AI space, I thought it would be great to connect and follow your work."
          }
        `;
        const outreachResult = await model.generateContent(prompt);
        const rawJson = (await outreachResult.response).text().replace(/```json|```/g, '').trim();
        responsePayload = JSON.parse(rawJson);
        break;
        
      default: // 'brief' is the default
        prompt = `You are a sales intelligence analyst for "Intersect AI". Generate a concise "Prospect Brief" in plain text based on this info. About Intersect AI: We build custom AI solutions for business efficiency and ROI. Prospect: - Name: ${name} - Title: ${title} - Company: ${company} - Profile Snippet: "${snippet}". Instructions: Based ONLY on the info provided, generate a brief with these bullet points. Infer where necessary, but state it's an inference. *   Key Role & Focus: (Infer primary responsibilities. Leadership? Technical? Strategic?) *   Potential Pain Points: (What challenges might they face that Intersect AI could solve?) *   Inferred Personality Trait: (Use phrases like "Appears to be...", "Likely values...". e.g., 'data-driven', 'results-oriented'). *   Conversation Starter: (A relevant question to begin outreach.). Output ONLY the bulleted list as plain text.`;
        const briefResult = await model.generateContent(prompt);
        responsePayload = { brief: (await briefResult.response).text().trim() };
        break;
    }

    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error("Error in generate-brief function:", error);
    const errorMessage = `Failed to generate AI content for type: ${type || 'brief'}.`;
    return res.status(500).json({ error: errorMessage });
  }
}