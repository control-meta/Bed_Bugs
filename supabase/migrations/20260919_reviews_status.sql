-- Add status and page_slug columns to reviews table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='status') THEN
        ALTER TABLE "public"."reviews" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='page_slug') THEN
        ALTER TABLE "public"."reviews" ADD COLUMN "page_slug" text;
    END IF;
END $$;
