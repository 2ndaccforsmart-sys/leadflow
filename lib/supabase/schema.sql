-- 1. Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default now(),
  name text,
  company_name text,
  business_description text,
  email_signature text,
  avatar_url text
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 3. Leads Table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  website text,
  email text,
  phone text,
  industry text,
  location text,
  company_size text,
  date_found timestamp with time zone default now(),
  lead_score integer,
  lead_score_justification text,
  created_at timestamp with time zone default now()
);

alter table public.leads enable row level security;

create policy "Users can perform all actions on own leads" on public.leads
  for all using (auth.uid() = user_id);

-- 4. Deals Table
create table public.deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lead_id uuid references public.leads on delete cascade not null,
  status text check (status in ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')) default 'lead',
  value numeric(10,2) default 0.00,
  close_date date,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.deals enable row level security;

create policy "Users can perform all actions on own deals" on public.deals
  for all using (auth.uid() = user_id);

-- 5. Conversations Table (AI chat history)
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lead_id uuid references public.leads on delete cascade,
  title text,
  messages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.conversations enable row level security;

create policy "Users can perform all actions on own conversations" on public.conversations
  for all using (auth.uid() = user_id);

-- 6. Emails Table
create table public.emails (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lead_id uuid references public.leads on delete cascade not null,
  subject text,
  body text,
  status text check (status in ('draft', 'sent')) default 'draft',
  outreach_goal text,
  tone text,
  created_at timestamp with time zone default now()
);

alter table public.emails enable row level security;

create policy "Users can perform all actions on own emails" on public.emails
  for all using (auth.uid() = user_id);

-- 7. Automatic Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, company_name, email_signature, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    '',
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
