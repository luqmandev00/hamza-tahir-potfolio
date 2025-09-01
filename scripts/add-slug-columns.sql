-- Add slug columns to existing tables for URL generation

-- Add slug column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add slug column to blog_posts table  
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add slug column to code_snippets table
ALTER TABLE code_snippets ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Update existing projects with slugs
UPDATE projects 
SET slug = generate_slug(title) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- Update existing blog posts with slugs
UPDATE blog_posts 
SET slug = generate_slug(title) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- Update existing code snippets with slugs
UPDATE code_snippets 
SET slug = generate_slug(title) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- Add unique constraints on slug columns
ALTER TABLE projects ADD CONSTRAINT projects_slug_unique UNIQUE (slug);
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);
ALTER TABLE code_snippets ADD CONSTRAINT code_snippets_slug_unique UNIQUE (slug);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_code_snippets_slug ON code_snippets(slug);

-- Create trigger function to auto-generate slugs on insert/update
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title) || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-generating slugs
DROP TRIGGER IF EXISTS projects_auto_slug ON projects;
CREATE TRIGGER projects_auto_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();

DROP TRIGGER IF EXISTS blog_posts_auto_slug ON blog_posts;
CREATE TRIGGER blog_posts_auto_slug
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();

DROP TRIGGER IF EXISTS code_snippets_auto_slug ON code_snippets;
CREATE TRIGGER code_snippets_auto_slug
  BEFORE INSERT OR UPDATE ON code_snippets
  FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();
