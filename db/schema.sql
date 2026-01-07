-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    country_origin VARCHAR(100),
    founded_date DATE,
    verified_status BOOLEAN DEFAULT false,
    social_links JSONB, -- Stores { "twitter": "...", "linkedin": "..." }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table (Recursive for sub-categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    product_type VARCHAR(50), -- e.g., SaaS, Mobile App, API
    description TEXT,
    pricing_model VARCHAR(50), -- e.g., Free, Subscription, One-time
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Technical Stack Table
CREATE TABLE IF NOT EXISTS tech_stack (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    language VARCHAR(100),
    framework VARCHAR(100),
    cloud_provider VARCHAR(100),
    is_open_source BOOLEAN DEFAULT false
);

-- 5. Integrations & Dev Tools
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    has_api BOOLEAN DEFAULT false,
    api_docs_url TEXT,
    has_sdk BOOLEAN DEFAULT false,
    webhook_support BOOLEAN DEFAULT false
);

-- 6. Certifications & Compliance
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    issuing_body VARCHAR(255), -- e.g., Shariyah Review Bureau
    certificate_url TEXT,
    issue_date DATE,
    expiry_date DATE
);

-- 7. Compliance Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    auditor_name VARCHAR(255),
    report_summary TEXT,
    status VARCHAR(50) DEFAULT 'Pending' -- e.g., Compliant, Under Review, Revoked
);
