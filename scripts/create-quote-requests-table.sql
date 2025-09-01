-- Create quote_requests table with proper column names
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(20),
  projectType VARCHAR(100) NOT NULL,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  description TEXT NOT NULL,
  requirements TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);
