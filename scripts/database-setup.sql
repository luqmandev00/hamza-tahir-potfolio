-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'completed',
  client VARCHAR(255),
  duration VARCHAR(100),
  highlights TEXT[] DEFAULT '{}',
  date_completed DATE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  author_id UUID,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS code_snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  difficulty VARCHAR(50) DEFAULT 'beginner',
  usage_frequency VARCHAR(50) DEFAULT 'medium',
  slug VARCHAR(255) UNIQUE NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price VARCHAR(100),
  popular BOOLEAN DEFAULT false,
  icon VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_code_snippets_published ON code_snippets(published);
CREATE INDEX IF NOT EXISTS idx_code_snippets_featured ON code_snippets(featured);
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON code_snippets(language);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- RLS Policies for public read access
CREATE POLICY "Allow public read access to published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to published code snippets" ON code_snippets
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to published services" ON services
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read access to site settings" ON site_settings
  FOR SELECT USING (true);

-- Allow public insert for contact messages
CREATE POLICY "Allow public insert to contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (key, value, type, description) VALUES
  ('site_title', 'Hamza Tahir - Full-Stack Developer', 'string', 'Main site title'),
  ('site_description', 'Professional full-stack WordPress and Shopify developer creating stunning, high-performance websites and e-commerce solutions.', 'string', 'Site description'),
  ('full_name', 'Hamza Tahir', 'string', 'Full name'),
  ('tagline', 'Full-Stack WordPress & Shopify Developer', 'string', 'Professional tagline'),
  ('bio', 'I create stunning, high-performance websites and e-commerce solutions that drive results. Specializing in WordPress, Shopify, and modern web technologies.', 'string', 'Biography'),
  ('email', 'hamza@example.com', 'string', 'Contact email'),
  ('phone', '+1 (555) 123-4567', 'string', 'Phone number'),
  ('location', 'New York, NY', 'string', 'Location'),
  ('enable_blog', 'true', 'boolean', 'Enable blog section'),
  ('enable_projects', 'true', 'boolean', 'Enable projects section'),
  ('enable_snippets', 'true', 'boolean', 'Enable code snippets section'),
  ('enable_contact_form', 'true', 'boolean', 'Enable contact form'),
  ('enable_dark_mode', 'true', 'boolean', 'Enable dark mode toggle'),
  ('skills', '["WordPress Development", "Shopify Development", "React.js", "Next.js", "PHP", "JavaScript", "TypeScript", "Node.js"]', 'json', 'Technical skills')
ON CONFLICT (key) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_snippets_updated_at BEFORE UPDATE ON code_snippets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
