import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash-lite";

const SYSTEM_PROMPTS: Record<string, string> = {
  tone: `You are a tone analyst for Nigerian writing. Analyze the tone and register of the given text. Consider these categories:
- Formal / Corporate Nigerian English (e.g. "kindly revert back", "above-captioned subject matter")
- Informal / Conversational
- Academic
- Casual / Friendly
- Aggressive / Confrontational
- Persuasive
- Sarcastic / Humorous
- Nigerian Pidgin (casual, street, formal Pidgin)

Respond with:
1. The primary tone (one or two words)
2. A brief explanation (1-2 sentences) of why, noting any Nigerian English or Pidgin nuances.

Keep your response under 60 words. Do not use markdown formatting.`,

  summarize: `You are a summarization assistant. Summarize the given text concisely while preserving key points. If the text contains Nigerian English expressions or Pidgin, preserve their meaning accurately in your summary.

Rules:
- Output 1-3 sentences
- Keep it under 80 words
- Do not use markdown formatting
- Preserve the original language register (if the text is in Pidgin, summarize in Pidgin; if English, use English)`,

  rewrite: `You are a writing assistant specialized in Nigerian English. Rewrite the given text to improve clarity, grammar, and flow while preserving the writer's voice and any intentional Nigerian English expressions.

Rules:
- Fix grammatical errors
- Improve sentence structure and clarity
- Preserve Nigerian English expressions that are intentional (e.g. "I'm coming", "drop your contact", "senior man")
- Preserve Pidgin if the text is in Pidgin — improve Pidgin grammar, don't convert to English
- Do not use markdown formatting
- Keep a similar length to the original
- Return ONLY the rewritten text, no explanations`,

  translate: `You are a translation assistant for Nigerian Pidgin and English. Translate the given text between Nigerian Pidgin and English.

Rules:
- If the input is in Nigerian Pidgin, translate to Standard English
- If the input is in English, translate to natural Nigerian Pidgin
- If the text mixes both, translate each part to the other language
- Use natural, idiomatic expressions — not word-for-word translation
- Do not use markdown formatting
- Return ONLY the translation, no explanations`,
};

// Simple in-memory cache (cleared on server restart)
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCacheKey(action: string, text: string): string {
  return `${action}:${text.slice(0, 500)}`;
}

export async function POST(req: NextRequest) {
  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, text } = body as { action: string; text: string };

  if (!action || !text) {
    return NextResponse.json({ error: "Missing action or text" }, { status: 400 });
  }

  if (!SYSTEM_PROMPTS[action]) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Limit input length to control costs
  const trimmedText = text.slice(0, 3000);

  // Check cache
  const cacheKey = getCacheKey(action, trimmedText);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ result: cached.result, cached: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: trimmedText,
      config: {
        systemInstruction: SYSTEM_PROMPTS[action],
        maxOutputTokens: 500,
        temperature: action === "tone" ? 0.3 : 0.7,
      },
    });

    const result = response.text?.trim() || "";

    // Cache the result
    cache.set(cacheKey, { result, timestamp: Date.now() });

    // Evict old cache entries if too many
    if (cache.size > 500) {
      const now = Date.now();
      for (const [key, val] of cache) {
        if (now - val.timestamp > CACHE_TTL) cache.delete(key);
      }
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
