import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const LOGO_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
  "#0ea5e9", "#3b82f6", "#f59e0b", "#78716c",
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*[—\-|–•]\s*(LinkedIn|Facebook|Twitter|Instagram|YouTube|Home|Overview|Official website|Wikipedia)\s*$/i, "")
    .replace(/\s*[—\-|–•]\s*Overview\s*$/i, "")
    .replace(/\s*\|\s*LinkedIn\s*$/i, "")
    .trim();
}

/** Check if a title looks like a junk article/listicle rather than a real company */
function isJunkResult(title: string): boolean {
  const lower = title.toLowerCase();

  // Titles starting with a digit followed by space, period, or paren (e.g. "3 Best...", "10. Top...")
  if (/^\d+[\s\.\)]/.test(lower)) return true;

  // Listicle keywords at the START of the title (not just anywhere — "Best Dentist" is a title, 
  // but "Smile Dental - Best Dentist" is a real company with "best" as a descriptor)
  if (/^(top|best|guide|review|reviews|list|tips|ways|reasons|things|ideas|examples|strategies)\b/i.test(lower)) return true;

  // Article-style titles
  if (/^(the\s+)?(ultimate\s+)?(complete\s+)?guide\b/i.test(lower)) return true;

  return false;
}

function extractLocation(snippet: string): string | null {
  const patterns = [
    /(?:in|located\s+in|based\s+in|serving)\s+([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?)\s*,\s*([A-Z]{2})/,
    /(?:in|located\s+in|based\s+in|serving)\s+([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?)/,
    /([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?)\s*,\s*([A-Z]{2})/,
  ];

  for (const p of patterns) {
    const m = snippet.match(p);
    if (m) {
      return m[2] && m[2].length === 2 ? `${m[1]}, ${m[2]}` : m[1];
    }
  }
  return null;
}

function extractIndustry(snippet: string, query: string): string {
  const industryPatterns = [
    /(dentist|dental\s*(?:clinic|practice|care|office|group)?|law\s*firm|attorney|lawyer|legal\s*(?:services|firm)?|restaurant|cafe|bakery|eatery|clinic|hospital|medical|healthcare|agency|creative\s*agency|studio|salon|spa|fitness|gym|wellness|consulting|consultancy|software|saas|ecommerce|retail|manufacturing|construction|contractor|real\s*estate|insurance|financial|accounting|bookkeeping|marketing|digital\s*marketing|design|photography|landscaping|catering|cleaning|plumbing|electrical|hvac|roofing)/i,
  ];

  for (const p of industryPatterns) {
    const m = snippet.match(p);
    if (m) {
      return m[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  const words = query
    .split(/\s+/)
    .filter((w) => !/^(in|the|a|an|of|for|and|near|at|to|or|my|our|your)$/i.test(w));
  if (words.length > 0) {
    return words[0].replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Business Services";
}

function computeScore(snippet: string, query: string): number {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (keywords.length === 0) return 72;

  const lower = snippet.toLowerCase();
  const matches = keywords.filter((k) => lower.includes(k)).length;
  const ratio = matches / keywords.length;
  return Math.min(97, Math.max(58, Math.round(58 + ratio * 39)));
}

function pickColor(): string {
  return LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
}

function determineLocation(query: string): string {
  const locationPatterns = [
    /in\s+([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?)\s*,?\s*([A-Z]{2})?/,
    /near\s+([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?)/,
  ];
  for (const p of locationPatterns) {
    const m = query.match(p);
    if (m) {
      return m[2] && m[2].length === 2 ? `${m[1]}, ${m[2]}` : m[1];
    }
  }
  return "";
}

/** Scrape DDG HTML for search results */
async function searchDuckDuckGo(
  query: string,
  label: string
): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  console.log(`[lead-search] DDG ${label}: fetching "${query}"`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await res.text();

    // If DDG served a captcha, bail early
    if (html.includes("anomaly-modal") || html.includes("challenge-form")) {
      console.log(`[lead-search] DDG ${label}: captcha detected`);
      return [];
    }

    const $ = cheerio.load(html);
    const results: { title: string; url: string; snippet: string }[] = [];

    $(".result").each((_, el) => {
      const titleEl = $(el).find(".result__title a");
      const snippetEl = $(el).find(".result__snippet");

      const title = titleEl.text().trim();
      const href = titleEl.attr("href") || "";
      const snippet = snippetEl.text().trim();

      const match = href.match(/uddg=(.+?)(&|$)/);
      const cleanUrl = match ? decodeURIComponent(match[1]) : href;

      if (title && snippet && cleanUrl) {
        results.push({ title, url: cleanUrl, snippet });
      }
    });

    console.log(`[lead-search] DDG ${label}: ${results.length} results`);
    return results;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log(`[lead-search] DDG ${label}: timed out after 5s`);
    } else {
      console.log(`[lead-search] DDG ${label}: error - ${err.message}`);
    }
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/** Fallback: Google Custom Search JSON API */
async function searchGoogleCSE(
  query: string
): Promise<{ title: string; url: string; snippet: string }[]> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!apiKey || !cx) return []; // not configured

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.items) return [];

  return data.items.map((item: any) => ({
    title: item.title || "",
    url: item.link || "",
    snippet: item.snippet || "",
  }));
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Try DDG first (two parallel searches: LinkedIn + general)
    let ddgResults: { title: string; url: string; snippet: string }[] = [];
    try {
      const [linkedIn, general] = await Promise.all([
        searchDuckDuckGo(`site:linkedin.com/company ${query}`, "linkedin"),
        searchDuckDuckGo(query, "general"),
      ]);
      ddgResults = [...linkedIn, ...general];
      console.log(`[lead-search] DDG total: ${linkedIn.length} linkedin + ${general.length} general = ${ddgResults.length}`);
    } catch (err: any) {
      console.log(`[lead-search] DDG parallel fetch threw: ${err.message}`);
    }

    // If DDG returned nothing (blocked), fall back to Google CSE
    let allResults = ddgResults;
    if (allResults.length === 0) {
      try {
        allResults = await searchGoogleCSE(query);
        // Also do a second query for LinkedIn
        const linkedInFromGoogle = await searchGoogleCSE(`site:linkedin.com/company ${query}`);
        allResults = [...allResults, ...linkedInFromGoogle];
      } catch {
        // Google fallback also failed
      }
    }

    // If still nothing, return empty
    if (allResults.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Deduplicate by domain, transform to Company objects
    const seen = new Set<string>();
    const companies: any[] = [];

    for (const r of allResults) {
      const domain = extractDomain(r.url);
      if (seen.has(domain) || !domain) continue;
      seen.add(domain);

      const name = cleanTitle(r.title);
      if (!name || name.length < 2) continue;

      // Filter out articles, listicles, and junk results
      if (isJunkResult(r.title)) continue;

      const location = extractLocation(r.snippet);
      const industry = extractIndustry(r.snippet, query);

      companies.push({
        id: generateId(),
        name,
        industry,
        location: location || determineLocation(query),
        website: domain,
        aiScore: computeScore(r.snippet, query),
        logoColor: pickColor(),
        logoInitial: name.charAt(0).toUpperCase(),
      });
    }

    console.log(`[lead-search] Final: ${companies.length} companies after dedup/filter (from ${allResults.length} raw results)`);
    return NextResponse.json({ results: companies.slice(0, 12) });
  } catch (error) {
    console.error("Lead search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}
