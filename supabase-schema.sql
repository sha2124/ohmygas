-- Run this in your Supabase SQL Editor to set up the tables

-- Subscribers table
create table if not exists subscribers (
  id bigint generated always as identity primary key,
  email text unique not null,
  region text default 'all',
  created_at timestamptz default now(),
  active boolean default true
);

-- Price history table (for storing scraped data over time)
create table if not exists price_history (
  id bigint generated always as identity primary key,
  brand text not null,
  region text not null,
  province text not null,
  city text,
  fuel_type text not null,
  price numeric(8,2) not null,
  previous_price numeric(8,2),
  scraped_at timestamptz default now(),
  source text
);

-- Create index for fast lookups
create index if not exists idx_price_history_date on price_history (scraped_at desc);
create index if not exists idx_price_history_region on price_history (region, province);
create index if not exists idx_subscribers_active on subscribers (active) where active = true;
