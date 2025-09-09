-- Create service_areas table for dynamic Shopify expert pages
CREATE TABLE IF NOT EXISTS service_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    meta_title VARCHAR(200) NOT NULL,
    meta_description TEXT NOT NULL,
    intro_text TEXT NOT NULL,
    hero_image TEXT,
    faq JSONB DEFAULT '[]'::jsonb,
    local_expertise TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_service_areas_slug ON service_areas(slug);
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON service_areas(active);

-- Insert sample data
INSERT INTO service_areas (slug, title, meta_title, meta_description, intro_text, hero_image, faq, local_expertise) VALUES
(
    'dubai',
    'Shopify Expert in Dubai',
    'Shopify Expert in Dubai | Professional Shopify Development',
    'Looking for a Shopify Expert in Dubai? I help businesses in Dubai design, develop, and grow their Shopify stores with local market expertise.',
    'I am a certified Shopify expert helping Dubai businesses build powerful online stores tailored to the UAE market. With deep understanding of local payment gateways, shipping providers, and e-commerce regulations.',
    '/placeholder.svg?height=600&width=1200&text=Dubai+Shopify+Expert',
    '[
        {
            "question": "How much does a Shopify expert in Dubai cost?",
            "answer": "Pricing depends on project scope, starting from $500 for basic setup services. Custom development projects typically range from $2000-$15000."
        },
        {
            "question": "Can you integrate UAE payment gateways?",
            "answer": "Yes, I support PayTabs, Telr, Stripe, and other UAE-compliant payment gateways with full PCI compliance."
        },
        {
            "question": "Do you provide ongoing support?",
            "answer": "I offer comprehensive maintenance packages including updates, security monitoring, and performance optimization."
        },
        {
            "question": "How long does a Shopify project take?",
            "answer": "Timeline varies by complexity. Basic stores take 2-3 weeks, while custom solutions may take 6-12 weeks."
        }
    ]'::jsonb,
    ARRAY[
        'Knowledge of UAE payment gateways (PayTabs, Telr, Stripe)',
        'Familiar with local shipping providers (Aramex, Fetchr, DHL)',
        'Work in Dubai time zone (GMT+4)',
        'Understanding of UAE e-commerce regulations',
        'Experience with Arabic language support',
        'Local market insights and best practices'
    ]
),
(
    'abu-dhabi',
    'Shopify Expert in Abu Dhabi',
    'Shopify Expert in Abu Dhabi | Professional Shopify Development',
    'Looking for a Shopify Expert in Abu Dhabi? I help businesses in Abu Dhabi design, develop, and grow their Shopify stores with government and enterprise expertise.',
    'I am a certified Shopify expert helping Abu Dhabi businesses build powerful online stores tailored to the UAE capital market. Specialized in government and enterprise-level e-commerce solutions.',
    '/placeholder.svg?height=600&width=1200&text=Abu+Dhabi+Shopify+Expert',
    '[
        {
            "question": "How much does a Shopify expert in Abu Dhabi cost?",
            "answer": "Pricing depends on project scope, starting from $500 for basic setup services. Enterprise solutions typically range from $5000-$25000."
        },
        {
            "question": "Do you work with Abu Dhabi government entities?",
            "answer": "Yes, I have experience working with government and semi-government entities in Abu Dhabi, ensuring compliance with all regulations."
        },
        {
            "question": "Can you handle enterprise-level projects?",
            "answer": "I specialize in large-scale Shopify Plus implementations for enterprise clients in Abu Dhabi."
        },
        {
            "question": "Do you provide Arabic language support?",
            "answer": "Yes, I can implement full RTL (right-to-left) Arabic language support with proper localization."
        }
    ]'::jsonb,
    ARRAY[
        'Knowledge of UAE payment gateways and banking systems',
        'Experience with Abu Dhabi government requirements',
        'Work in Abu Dhabi time zone (GMT+4)',
        'Understanding of UAE e-commerce regulations',
        'Enterprise and government project experience',
        'Shopify Plus certified for large-scale implementations'
    ]
),
(
    'usa',
    'Shopify Expert in USA',
    'Shopify Expert in USA | Professional Shopify Development Services',
    'Looking for a Shopify Expert in USA? I help American businesses design, develop, and grow their Shopify stores with local market expertise and US compliance.',
    'I am a certified Shopify expert helping US businesses build powerful online stores tailored to the American market. Expert in US tax systems, shipping networks, and compliance requirements.',
    '/placeholder.svg?height=600&width=1200&text=USA+Shopify+Expert',
    '[
        {
            "question": "How much does a Shopify expert in USA cost?",
            "answer": "Pricing varies by project scope, starting from $1000 for basic setup. Custom development typically ranges from $3000-$20000."
        },
        {
            "question": "Can you handle US tax compliance?",
            "answer": "Yes, I can implement automated tax calculations for all US states, including sales tax and VAT compliance."
        },
        {
            "question": "Do you integrate with US shipping carriers?",
            "answer": "I integrate with USPS, UPS, FedEx, and other major US shipping providers with real-time rates."
        },
        {
            "question": "Can you help with US payment processors?",
            "answer": "Yes, I work with Stripe, PayPal, Square, and other US-based payment processors for optimal conversion rates."
        }
    ]'::jsonb,
    ARRAY[
        'US tax system expertise (sales tax, state regulations)',
        'Integration with major US shipping carriers',
        'US payment processor optimization',
        'Understanding of US e-commerce regulations',
        'Experience with US consumer behavior',
        'Shopify Plus certified for enterprise solutions'
    ]
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_areas_updated_at 
    BEFORE UPDATE ON service_areas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
