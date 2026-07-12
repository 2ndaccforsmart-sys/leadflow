import { NextRequest, NextResponse } from "next/server";

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

/** Only filter titles that are OBVIOUSLY articles: numbered lists or "Top N" */
function isJunkResult(title: string): boolean {
  const lower = title.toLowerCase();
  if (/^\d+[\s\.\)]/.test(lower)) return true;
  if (/^top\s+\d+/i.test(lower)) return true;
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
    if (m) return m[2] && m[2].length === 2 ? `${m[1]}, ${m[2]}` : m[1];
  }
  return null;
}

function extractIndustry(snippet: string, query: string): string {
  const industryPatterns = [
    /(dentist|dental\s*(?:clinic|practice|care|office|group)?|law\s*firm|attorney|lawyer|legal\s*(?:services|firm)?|restaurant|cafe|bakery|eatery|clinic|hospital|medical|healthcare|agency|creative\s*agency|studio|salon|spa|fitness|gym|wellness|consulting|consultancy|software|saas|ecommerce|retail|manufacturing|construction|contractor|real\s*estate|insurance|financial|accounting|bookkeeping|marketing|digital\s*marketing|design|photography|landscaping|catering|cleaning|plumbing|electrical|hvac|roofing)/i,
  ];
  for (const p of industryPatterns) {
    const m = snippet.match(p);
    if (m) return m[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const words = query.split(/\s+/).filter((w) => !/^(in|the|a|an|of|for|and|near|at|to|or|my|our|your)$/i.test(w));
  if (words.length > 0) return words[0].replace(/\b\w/g, (c) => c.toUpperCase());
  return "Business Services";
}

function computeScore(snippet: string, query: string): number {
  const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
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
    if (m) return m[2] && m[2].length === 2 ? `${m[1]}, ${m[2]}` : m[1];
  }
  return "";
}

/** Split a query like "dental clinics Austin" into industry + location parts */
interface SplitQuery {
  industry: string;
  location: string;
}

function splitQueryLocation(query: string): SplitQuery {
  const locMatch = query.match(
    /(.+?)\s+(?:in|near)\s+([A-Z][A-Za-z]+(?:[\s-][A-Z][A-Za-z]+)?(?:\s*,\s*[A-Z]{2})?)\s*$/i
  );
  if (locMatch) {
    return {
      industry: locMatch[1].trim(),
      location: locMatch[2].trim(),
    };
  }
  return { industry: query.trim(), location: "" };
}

/** Build two SearchX queries based on whether the query includes a location */
function buildSearchQueries(query: string): string[] {
  const { industry, location } = splitQueryLocation(query);

  if (location) {
    return [
      `"${industry}" "${location}" website contact phone`,
      `"${industry}" "${location}" reviews yelp`,
    ];
  }

  return [
    `"${query}" website contact phone`,
    `"${query}" near me reviews`,
  ];
}

/** Search via SearchX API */
async function searchSearchX(
  query: string,
  label: string,
  page: number = 1
): Promise<{ title: string; url: string; snippet: string }[]> {
  const apiKey = process.env.SEARCHX_API_KEY;
  if (!apiKey) {
    console.warn("[lead-search] SEARCHX_API_KEY not configured in .env.local");
    return [];
  }

  console.log(`[lead-search] SearchX ${label}: fetching "${query}" page=${page}`);

  try {
    const res = await fetch(
      `https://searchx.dev/api/v1/search?q=${encodeURIComponent(query)}&per_page=20&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!res.ok) {
      console.log(`[lead-search] SearchX ${label}: HTTP ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const results: { title: string; url: string; snippet: string }[] = (
      data.results ?? []
    ).map((item: any) => ({
      title: item.title || "",
      url: item.url || "",
      snippet: item.snippet || "",
    }));

    console.log(`[lead-search] SearchX ${label}: ${results.length} results`);
    return results;
  } catch (err: any) {
    console.log(`[lead-search] SearchX ${label}: error - ${err.message}`);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const pageStr = request.nextUrl.searchParams.get("page");
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  try {
    const queries = buildSearchQueries(query);

    const [q1Results, q2Results] = await Promise.all([
      searchSearchX(queries[0], "q1", page),
      searchSearchX(queries[1], "q2", page),
    ]);

    let allResults = [...q1Results, ...q2Results];
    console.log(
      `[lead-search] SearchX total: ${q1Results.length} + ${q2Results.length} = ${allResults.length} (page ${page})`
    );

    if (allResults.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const seen = new Set<string>();
    const companies: any[] = [];

    for (const r of allResults) {
      const domain = extractDomain(r.url);
      if (seen.has(domain) || !domain) continue;
      seen.add(domain);

      const name = cleanTitle(r.title);
      if (!name || name.length < 2) continue;
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

    console.log(
      `[lead-search] Final: ${companies.length} companies after dedup/filter (from ${allResults.length} raw results)`
    );
    return NextResponse.json({ results: companies.slice(0, 20) });
  } catch (error) {
    console.error("Lead search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}
