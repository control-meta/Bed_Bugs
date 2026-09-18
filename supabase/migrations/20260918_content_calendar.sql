-- Migration: Create content_calendar table for AI-generated and planned blog schedules
-- Date: 2026-09-18

CREATE TABLE IF NOT EXISTS public.content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    topic TEXT NOT NULL,
    keywords JSONB DEFAULT '[]'::jsonb,
    search_volume TEXT,
    type TEXT DEFAULT 'guide',
    status TEXT DEFAULT 'planned',
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid querying by month and year
CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON public.content_calendar (date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_month_year ON public.content_calendar (year, month);

-- Enable Row Level Security
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated and service roles, and public fallback for demo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_calendar' 
        AND policyname = 'Allow all access to content_calendar'
    ) THEN
        CREATE POLICY "Allow all access to content_calendar" 
        ON public.content_calendar 
        FOR ALL 
        TO public 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;

-- Grant table permissions
GRANT ALL ON public.content_calendar TO anon, authenticated, service_role;
