DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='location_pages' AND column_name='hero_heading') THEN
        ALTER TABLE "public"."location_pages" ADD COLUMN "hero_heading" text;
    END IF;
END $$;
