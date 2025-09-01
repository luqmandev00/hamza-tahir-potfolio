-- Create a bucket for storing images (if using Supabase Storage)
-- This would typically be done through the Supabase dashboard
-- But we'll add a table to track uploaded images

CREATE TABLE IF NOT EXISTS uploaded_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploaded_images_created_at ON uploaded_images(created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_uploaded_by ON uploaded_images(uploaded_by);

-- Add RLS policies if needed
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert images
CREATE POLICY "Allow authenticated users to upload images" ON uploaded_images
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow public read access to images
CREATE POLICY "Allow public read access to images" ON uploaded_images
    FOR SELECT TO public USING (true);
