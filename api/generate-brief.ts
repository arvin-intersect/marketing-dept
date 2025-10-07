import { GoogleGenerativeAI } from "@google/generative-ai";

// This is the fix: Check for the key before using it.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or be more specific in production
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { name, title, company, snippet } = req.body;

    if (!name || !title || !company) {
      return res.status(400).json({ error: "Missing required prospect information." });
    }

    const prompt = `
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ brief: text.trim() });

  } catch (error) {
    console.error("Error in generate-brief function:", error);
    return res.status(500).json({ error: "Failed to generate prospect brief." });
  }
}