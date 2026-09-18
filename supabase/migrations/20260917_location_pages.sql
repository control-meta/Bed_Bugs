-- ==============================================================================
-- BED BUG TREATMENT - SUPABASE DATABASE SCHEMA FOR LOCATION PAGES
-- Run this in your Supabase SQL Editor:
-- 1. Log in to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to "SQL Editor" from the left menu
-- 3. Click "New Query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. Create table for storing location pages content and configurations
CREATE TABLE IF NOT EXISTS public.location_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  image TEXT NOT NULL,
  tagline TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_description TEXT NOT NULL,
  response_time TEXT NOT NULL DEFAULT 'Within 90 mins',
  active_technicians TEXT NOT NULL DEFAULT '15+ Certified Technicians',
  homes_treated TEXT NOT NULL DEFAULT '50,000+',
  rating TEXT NOT NULL DEFAULT '4.9/5',
  review_count TEXT NOT NULL DEFAULT '350+',
  phone TEXT NOT NULL DEFAULT '+919769321234',
  phone_display TEXT NOT NULL DEFAULT '+91 97693 21234',
  whatsapp_text TEXT NOT NULL,
  coverage_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  pricing JSONB NOT NULL DEFAULT '[]'::jsonb,
  local_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_styles JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast slug lookup and filtering
CREATE INDEX IF NOT EXISTS idx_location_pages_slug ON public.location_pages (slug);
CREATE INDEX IF NOT EXISTS idx_location_pages_status ON public.location_pages (status);
CREATE INDEX IF NOT EXISTS idx_location_pages_updated_at ON public.location_pages (updated_at DESC);

-- 3. Trigger to automatically update updated_at timestamp on record updates
CREATE OR REPLACE FUNCTION public.handle_location_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_location_pages_updated_at ON public.location_pages;
CREATE TRIGGER set_location_pages_updated_at
BEFORE UPDATE ON public.location_pages
FOR EACH ROW
EXECUTE FUNCTION public.handle_location_pages_updated_at();

-- 4. Grant table access to roles
GRANT ALL ON public.location_pages TO postgres, service_role, authenticated, anon;

-- 5. Row Level Security (RLS)
ALTER TABLE public.location_pages ENABLE ROW LEVEL SECURITY;

-- Allow public and anonymous users to view published location pages
DROP POLICY IF EXISTS "Allow public read access to location pages" ON public.location_pages;
CREATE POLICY "Allow public read access to location pages"
ON public.location_pages
FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- Ensure service role has full CRUD access
DROP POLICY IF EXISTS "Allow service role full management of location pages" ON public.location_pages;
CREATE POLICY "Allow service role full management of location pages"
ON public.location_pages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
