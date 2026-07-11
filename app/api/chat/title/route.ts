import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const { firstMessage, responseText } = await request.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a conversation title generator. Create a short, creative, 2-to-4 word title representing the topic of this conversation. Do not use quotes, punctuation, or markdown. Return ONLY the title text.",
          },
          {
            role: "user",
            content: `User query: "${firstMessage}"\nAssistant response: "${responseText.slice(0, 300)}"`,
          },
        ],
        temperature: 0.5,
        max_tokens: 15,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Title API Groq error:", response.status, errorText);
      throw new Error(`Groq API returned ${response.status}`);
    }
    const data = await response.json();
    const title =
      data.choices?.[0]?.message?.content?.trim() || "New Chat";
    return NextResponse.json({ title });
  } catch (err) {
    console.error("Title API error:", err);
    return NextResponse.json({ title: "New Chat" });
  }
}
