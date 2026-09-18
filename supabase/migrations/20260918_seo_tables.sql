-- Migration: Create page_seo and image_seo tables for Global SEO & Metadata Management
-- Created: 2026-09-18

-- 1. Create page_seo table
CREATE TABLE IF NOT EXISTS public.page_seo (
    path TEXT PRIMARY KEY,
    page_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}'::TEXT[],
    og_image TEXT,
    canonical TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create image_seo table
CREATE TABLE IF NOT EXISTS public.image_seo (
    src TEXT PRIMARY KEY,
    alt_text TEXT NOT NULL,
    location_hint TEXT,
    pages TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_seo ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Allow public read access (for site visitors and crawlers)
CREATE POLICY "Allow public read access on page_seo"
    ON public.page_seo
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on image_seo"
    ON public.image_seo
    FOR SELECT
    USING (true);

-- 5. Policies: Allow authenticated / service role full write access
CREATE POLICY "Allow authenticated full access on page_seo"
    ON public.page_seo
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on image_seo"
    ON public.image_seo
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_page_seo_path ON public.page_seo(path);
CREATE INDEX IF NOT EXISTS idx_image_seo_src ON public.image_seo(src);
