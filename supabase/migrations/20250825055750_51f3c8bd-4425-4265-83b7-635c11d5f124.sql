-- Create seller applications table
create table if not exists public.seller_applications (
  id bigserial primary key,
  business_name text not null,
  website text not null,
  contact_name text not null,
  email text not null,
  marketplaces text,
  region text,
  monthly_listings text,
  affiliate_network text,
  affiliate_id text,
  notes text,
  status text default 'new', -- new, reviewing, approved, rejected
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.seller_applications enable row level security;

-- Create policies
create policy "No read access for seller applications" on public.seller_applications 
  for select to public using (false);

create policy "Anyone can submit seller applications" on public.seller_applications 
  for insert to public with check (true);