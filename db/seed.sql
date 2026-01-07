-- Seed Categories
INSERT INTO categories (name, slug) VALUES 
('Fintech', 'fintech'),
('EdTech', 'edtech'),
('Lifestyle', 'lifestyle'),
('Enterprise', 'enterprise'),
('HealthTech', 'healthtech'),
('PropTech', 'proptech'),
('LegalTech', 'legaltech'),
('Charity & Waqf', 'charity-waqf'),
('E-commerce', 'ecommerce'),
('Halal Web3', 'halal-web3'),
('Gaming', 'gaming'),
('Media & Streaming', 'media-streaming')
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Organization
DO $$
DECLARE
    org_id UUID;
    cat_fintech_id UUID;
    prod_id UUID;
BEGIN
    INSERT INTO organizations (name, country_origin, verified_status)
    VALUES ('Example Islamic Finance', 'UK', true)
    RETURNING id INTO org_id;

    SELECT id INTO cat_fintech_id FROM categories WHERE slug = 'fintech';

    INSERT INTO products (org_id, category_id, name, product_type, description, website_url)
    VALUES (org_id, cat_fintech_id, 'HalalInvest', 'SaaS', 'Shariah-compliant investment platform.', 'https://example.com')
    RETURNING id INTO prod_id;

    INSERT INTO tech_stack (product_id, language, framework, cloud_provider)
    VALUES (prod_id, 'TypeScript', 'Node.js', 'AWS');
    
    INSERT INTO certifications (product_id, issuing_body, issue_date)
    VALUES (prod_id, 'Shariyah Review Bureau', '2025-01-01');
END $$;
