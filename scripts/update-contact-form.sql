-- Add new columns to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS project_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(100),
ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
ADD COLUMN IF NOT EXISTS how_did_you_hear VARCHAR(255);

-- Update the contact_messages table structure
COMMENT ON COLUMN contact_messages.company IS 'Company or organization name';
COMMENT ON COLUMN contact_messages.phone IS 'Phone number for contact';
COMMENT ON COLUMN contact_messages.project_type IS 'Type of project (website, app, etc.)';
COMMENT ON COLUMN contact_messages.budget_range IS 'Budget range for the project';
COMMENT ON COLUMN contact_messages.timeline IS 'Expected project timeline';
COMMENT ON COLUMN contact_messages.how_did_you_hear IS 'How they heard about the services';
