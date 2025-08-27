-- Create search analytics table
create table if not exists public.search_analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  search_query text not null,
  search_type text not null, -- 'ai', 'basic', 'manual'
  ai_filters_detected jsonb,
  ai_parsing_success boolean,
  ai_parsing_error text,
  results_count integer,
  session_id text,
  user_agent text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.search_analytics enable row level security;

-- Create policies
create policy "Public can insert search analytics" on public.search_analytics 
  for insert to public with check (true);

create policy "Users can view their own search analytics" on public.search_analytics 
  for select to public using (auth.uid() = user_id or user_id is null);

-- Create index for better query performance
create index idx_search_analytics_created_at on public.search_analytics(created_at desc);
create index idx_search_analytics_search_type on public.search_analytics(search_type);
create index idx_search_analytics_user_id on public.search_analytics(user_id);