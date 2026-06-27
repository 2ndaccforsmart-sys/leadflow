export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  company_name: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  status: "new" | "contacted" | "interested" | "meeting" | "closed";
  created_at: string;
}

export interface SearchResult {
  company_name: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
}

export interface AnalyticsData {
  total_leads: number;
  saved_leads: number;
  emails_generated: number;
  searches_today: number;
}

export type LeadStatus = Lead["status"];
