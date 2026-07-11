import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const results: { title: string; url: string; snippet: string }[] = [];

    $(".result").each((_, el) => {
      const titleEl = $(el).find(".result__title a");
      const snippetEl = $(el).find(".result__snippet");

      const title = titleEl.text().trim();
      const href = titleEl.attr("href") || "";
      const snippet = snippetEl.text().trim();

      // DuckDuckGo redirect URLs need decoding
      const match = href.match(/uddg=(.+?)(&|$)/);
      const cleanUrl = match ? decodeURIComponent(match[1]) : href;

      if (title && snippet) {
        results.push({ title, url: cleanUrl, snippet });
      }
    });

    return NextResponse.json({ results: results.slice(0, 8) });
  } catch (error) {
    console.error("Web search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}
