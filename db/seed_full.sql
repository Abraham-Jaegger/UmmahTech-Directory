-- Full Seed Data

-- Ensure Categories Exist
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

DO $$
DECLARE
    -- Category IDs
    cat_fintech UUID;
    cat_edtech UUID;
    cat_lifestyle UUID;
    cat_enterprise UUID;
    cat_health UUID;
    cat_prop UUID;
    cat_legal UUID;
    cat_charity UUID;
    cat_social UUID;
    cat_ecommerce UUID;
    cat_web3 UUID;
    cat_gaming UUID;
    cat_media UUID;
    
    -- Org IDs
    org_wahed UUID;
    org_zoya UUID;
    org_launchgood UUID;
    org_salamapp UUID;
    org_muzz UUID;
    org_islamicgps UUID;
    org_tammweel UUID;
    
    -- Product IDs
    p_wahed UUID;
    p_zoya UUID;
    p_lg UUID;
    p_salam UUID;
    p_muzz UUID;
    p_tamm UUID;
    
BEGIN
    -- Get Category IDs
    SELECT id INTO cat_fintech FROM categories WHERE slug = 'fintech';
    SELECT id INTO cat_edtech FROM categories WHERE slug = 'edtech';
    SELECT id INTO cat_lifestyle FROM categories WHERE slug = 'lifestyle';
    SELECT id INTO cat_enterprise FROM categories WHERE slug = 'enterprise';
    SELECT id INTO cat_health FROM categories WHERE slug = 'healthtech';
    SELECT id INTO cat_prop FROM categories WHERE slug = 'proptech';
    SELECT id INTO cat_legal FROM categories WHERE slug = 'legaltech';
    SELECT id INTO cat_charity FROM categories WHERE slug = 'charity-waqf';
    SELECT id INTO cat_ecommerce FROM categories WHERE slug = 'ecommerce';
    SELECT id INTO cat_web3 FROM categories WHERE slug = 'halal-web3';
    SELECT id INTO cat_gaming FROM categories WHERE slug = 'gaming';
    SELECT id INTO cat_media FROM categories WHERE slug = 'media-streaming';

    -- 1. FINTECH
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Wahed Invest', 'USA', true) RETURNING id INTO org_wahed;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_wahed, cat_fintech, 'Wahed Invest', 'Mobile App', 'Ethical and Shariah-compliant robo-advisor.', 'https://wahedinvest.com');
    
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Zoya', 'USA', true) RETURNING id INTO org_zoya;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_zoya, cat_fintech, 'Zoya', 'Mobile App', 'Screen stocks for Shariah compliance instantly.', 'https://zoya.finance');
    
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('FinaMaze', 'UAE', true) RETURNING id INTO org_tammweel; -- Reusing var
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_tammweel, cat_fintech, 'FinaMaze', 'Platform', 'AI Digital Wealth Manager for MENA.', 'https://finamaze.com');

    -- 2. EDTECH
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Bayyinah Institute', 'USA', true) RETURNING id INTO org_salamapp; -- Var reuse
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_edtech, 'Bayyinah TV', 'Portal', 'Quranic Arabic and Tefseer education platform.', 'https://bayyinahtv.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Studio Arabiya', 'Egypt', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_edtech, 'Studio Arabiya', 'Platform', 'Online Arabic and Quran classes.', 'https://studioarabiya.com');
    
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Tarteel', 'USA', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_edtech, 'Tarteel AI', 'App', 'AI-powered Quran memorization companion.', 'https://tarteel.io');

    -- 3. CHARITY & WAQF
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('LaunchGood', 'USA', true) RETURNING id INTO org_launchgood;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_launchgood, cat_charity, 'LaunchGood', 'Platform', 'Global crowdfunding platform for Muslims.', 'https://launchgood.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('GlobalSadaqah', 'Malaysia', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_charity, 'GlobalSadaqah', 'Platform', 'CSR, Zakat, and Sadaqah management.', 'https://globalsadaqah.com');

    -- 4. LIFESTYLE
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Muzz', 'UK', true) RETURNING id INTO org_muzz;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_muzz, cat_lifestyle, 'Muzz', 'App', 'Halal dating and marriage app.', 'https://muzz.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Pillars', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_lifestyle, 'Pillars', 'App', 'Privacy-focused prayer app.', 'https://getpillars.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Zabihah', 'USA', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_lifestyle, 'Zabihah', 'Platform', 'World’s largest guide to Halal restaurants.', 'https://zabihah.com');

    -- 5. ENTERPRISE
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('DinarStandard', 'USA', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_enterprise, 'Growth Strategy', 'Service', 'Research and advisory for Islamic Economy.', 'https://dinarstandard.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Ethis', 'Malaysia', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_enterprise, 'Ethis Group', 'Platform', 'Ethical investment and crowdfunding.', 'https://ethis.co');

    -- 6. HALAL WEB3
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Islamic Coin', 'UAE', false) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_web3, 'Haqq Network', 'Blockchain', 'Shariah-compliant blockchain network.', 'https://haqq.network');
    
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Marhaba DeFi', 'Australia', false) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_web3, 'Marhaba', 'DeFi', 'Halal decentralized financial platform.', 'https://marhabadefi.com');

    -- 7. MEDIA
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Alchemiya', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_media, 'Alchemiya', 'Streaming', 'Netflix for Muslim culture and content.', 'https://alchemiya.com');
    
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Islam Channel', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_media, 'Islam Channel', 'TV', 'Leading Islamic media broadcaster.', 'https://islamchannel.tv');

    -- 8. E-COMMERCE
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Modanisa', 'Turkey', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_ecommerce, 'Modanisa', 'Marketplace', 'Modest fashion e-commerce leader.', 'https://modanisa.com');

    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('HalalBooking', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_ecommerce, 'HalalBooking', 'Platform', 'Search and book halal-friendly holidays.', 'https://halalbooking.com');
    
    -- 9. HEALTHTECH
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Mindful Muslim', 'Singapore', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_health, 'Mindful Muslim', 'App', 'Islamic mindfulness and sleep app.', 'https://mindfulmuslim.com');

    -- 10. PROPTECH
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Pfida', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_prop, 'Pfida', 'Platform', 'Ethical home financing and savings.', 'https://pfida.com');

    -- 11. GAMING
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Muslim Gamer', 'USA', false) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_gaming, 'Muslim 3D', 'Game', 'Educational exploration of Islamic history.', 'https://muslim3d.com');

    -- 12. LEGALTECH
    INSERT INTO organizations (name, country_origin, verified_status) VALUES ('Wasiyyah', 'UK', true) RETURNING id INTO org_salamapp;
    INSERT INTO products (org_id, category_id, name, product_type, description, website_url) 
    VALUES (org_salamapp, cat_legal, 'MyWasiyyah', 'Service', 'Islamic estate planning and wills.', 'https://wasiyyah.com');

END $$;
