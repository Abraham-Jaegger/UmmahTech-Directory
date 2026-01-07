DO $$
DECLARE
    org_id UUID;
    cat_edtech_id UUID;
    cat_fintech_id UUID;
    cat_lifestyle_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_edtech_id FROM categories WHERE slug = 'edtech';
    SELECT id INTO cat_fintech_id FROM categories WHERE slug = 'fintech';
    SELECT id INTO cat_lifestyle_id FROM categories WHERE slug = 'lifestyle';

    -- Tarteel
    INSERT INTO organizations (name, country_origin, verified_status)
    VALUES ('Tarteel Inc.', 'USA', true)
    RETURNING id INTO org_id;

    INSERT INTO products (org_id, category_id, name, product_type, description, website_url)
    VALUES (org_id, cat_edtech_id, 'Tarteel', 'Mobile App', 'AI-powered Quran memorization companion that listens to your recitation and corrects your mistakes.', 'https://tarteel.io')
    RETURNING id INTO prod_id;

    INSERT INTO tech_stack (product_id, language, framework, cloud_provider)
    VALUES (prod_id, 'Python', 'PyTorch', 'AWS');

    -- Quran.com
    INSERT INTO organizations (name, country_origin, verified_status)
    VALUES ('Quran.com', 'Global', true)
    RETURNING id INTO org_id;

    INSERT INTO products (org_id, category_id, name, product_type, description, website_url)
    VALUES (org_id, cat_edtech_id, 'Quran.com', 'Web Platform', 'The world''s most popular open-source Quran platform.', 'https://quran.com')
    RETURNING id INTO prod_id;
    
    INSERT INTO tech_stack (product_id, language, framework, is_open_source)
    VALUES (prod_id, 'TypeScript', 'Next.js', true);

    -- Wahed Invest
    INSERT INTO organizations (name, country_origin, verified_status)
    VALUES ('Wahed Inc.', 'USA', true)
    RETURNING id INTO org_id;

    INSERT INTO products (org_id, category_id, name, product_type, description, website_url)
    VALUES (org_id, cat_fintech_id, 'Wahed Invest', 'Fintech App', 'An automated investment platform designed for ethical and Shariah-compliant investing.', 'https://wahedinvest.com')
    RETURNING id INTO prod_id;
    
    INSERT INTO certifications (product_id, issuing_body, issue_date)
    VALUES (prod_id, 'Shariyah Review Bureau', '2024-01-01');

    -- Muzz
    INSERT INTO organizations (name, country_origin, verified_status)
    VALUES ('Muzz', 'UK', true)
    RETURNING id INTO org_id;

    INSERT INTO products (org_id, category_id, name, product_type, description, website_url)
    VALUES (org_id, cat_lifestyle_id, 'Muzz', 'Mobile App', 'The world''s largest muslim marriage and social app.', 'https://muzz.com')
    RETURNING id INTO prod_id;

END $$;
