-- ==============================================================================
-- BED BUG TREATMENT - SUPABASE DATABASE SCHEMA FOR ENQUIRIES
-- Run this in your Supabase SQL Editor:
-- 1. Log in to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to "SQL Editor" from the left menu
-- 3. Click "New Query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. Create table for storing enquiries / leads
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  property_type TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'website', -- 'hero_quick_connect', 'contact_page', 'floating_widget'
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',    -- 'new', 'contacted', 'scheduled', 'completed', 'cancelled'
  notes TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast sorting and searching in the Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON public.enquiries (phone);
CREATE INDEX IF NOT EXISTS idx_enquiries_city ON public.enquiries (city);

-- 3. Trigger to automatically update updated_at timestamp on record updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER set_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS) - High Security Configuration
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit enquiries only (INSERT only)
DROP POLICY IF EXISTS "Allow public form submissions" ON public.enquiries;
CREATE POLICY "Allow public form submissions"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure service_role (used by server-side Admin API) has full access
-- Supabase automatically grants full bypass to service_role, but explicit policy ensures safety.
DROP POLICY IF EXISTS "Service role full access" ON public.enquiries;
CREATE POLICY "Service role full access"
ON public.enquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- AI BLOG PIPELINE: ARTICLE, EVIDENCE, AND PUBLICATION AUDIT STORAGE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY,
  topic TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'published')),
  publication_status TEXT NOT NULL CHECK (publication_status IN ('READY', 'NEEDS_REVISION', 'BLOCKED')),
  auto_publish_eligible BOOLEAN NOT NULL DEFAULT false,
  research JSONB NOT NULL DEFAULT '{}'::jsonb,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  fact_checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  quality_audit JSONB NOT NULL DEFAULT '{}'::jsonb,
  cannibalization JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision_count INTEGER NOT NULL DEFAULT 0 CHECK (revision_count BETWEEN 0 AND 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON public.blog_articles (status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles (slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_created_at ON public.blog_articles (created_at DESC);

DROP TRIGGER IF EXISTS set_blog_articles_updated_at ON public.blog_articles;
CREATE TRIGGER set_blog_articles_updated_at
BEFORE UPDATE ON public.blog_articles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  evidence_id TEXT NOT NULL,
  claim TEXT NOT NULL,
  claim_category TEXT NOT NULL,
  source_title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  publisher TEXT NOT NULL,
  publication_date TEXT,
  accessed_date DATE NOT NULL,
  confidence NUMERIC(4,3) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  source_type TEXT NOT NULL,
  evidence_excerpt TEXT NOT NULL,
  verification JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (article_id, evidence_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_evidence_article_id ON public.blog_evidence (article_id);
CREATE INDEX IF NOT EXISTS idx_blog_evidence_source_url ON public.blog_evidence (source_url);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages blog articles" ON public.blog_articles;
CREATE POLICY "Service role manages blog articles"
ON public.blog_articles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages blog evidence" ON public.blog_evidence;
CREATE POLICY "Service role manages blog evidence"
ON public.blog_evidence
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
