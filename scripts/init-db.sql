-- Create Services Table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    user_story TEXT,
    gherkin TEXT,
    test_data TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    is_automated BOOLEAN DEFAULT false,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tests Table
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_case_id INTEGER REFERENCES test_cases(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    result VARCHAR(50) DEFAULT 'pending',
    execution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_type VARCHAR(50) DEFAULT 'manual',
    execution_location TEXT,
    execution_method TEXT,
    test_data TEXT,
    jira_link TEXT,
    bug_link TEXT,
    evidence TEXT,
    responsible_qa VARCHAR(255),
    responsible_dev VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bugs Table
CREATE TABLE IF NOT EXISTS bugs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    user_story TEXT,
    gherkin TEXT,
    evidence TEXT,
    status VARCHAR(50) DEFAULT 'open',
    observations TEXT,
    found_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    retested_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Improvements Table
CREATE TABLE IF NOT EXISTS improvements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    user_story TEXT,
    evidence TEXT,
    status VARCHAR(50) DEFAULT 'proposed',
    observations TEXT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Performance Test Plans Table
CREATE TABLE IF NOT EXISTS performance_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    test_type VARCHAR(100),
    target_metrics TEXT,
    test_data TEXT,
    execution_date TIMESTAMP,
    results TEXT,
    status VARCHAR(50) DEFAULT 'planned',
    observations TEXT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample services
INSERT INTO services (name, description) VALUES
('API Gateway', 'Serviço principal de gateway de APIs'),
('Auth Service', 'Serviço de autenticação e autorização'),
('Payment Service', 'Serviço de processamento de pagamentos'),
('Notification Service', 'Serviço de notificações e emails');

-- Create indexes for better performance
CREATE INDEX idx_tests_service ON tests(service_id);
CREATE INDEX idx_tests_type ON tests(type);
CREATE INDEX idx_tests_result ON tests(result);
CREATE INDEX idx_bugs_status ON bugs(status);
CREATE INDEX idx_bugs_service ON bugs(service_id);
CREATE INDEX idx_test_cases_service ON test_cases(service_id);
CREATE INDEX idx_test_cases_status ON test_cases(status);
