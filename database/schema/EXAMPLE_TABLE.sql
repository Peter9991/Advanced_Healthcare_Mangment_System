-- EXAMPLE TABLE STRUCTURE
-- This is a template to help you understand the format
-- Delete this file once you start creating your actual tables

-- Example: Patients Table
-- This is just an example - you should create your own based on the guide

CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    occupation VARCHAR(100),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive', 'Deceased') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better query performance
    INDEX idx_national_id (national_id),
    INDEX idx_name (last_name, first_name),
    INDEX idx_status (status),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example: Patient Contacts Table (showing foreign key relationship)
CREATE TABLE IF NOT EXISTS patient_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    contact_type ENUM('Primary', 'Secondary', 'Emergency') NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_patient_id (patient_id),
    INDEX idx_contact_type (contact_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TIPS FOR YOUR TABLES:
-- 1. Always use AUTO_INCREMENT for primary keys
-- 2. Use appropriate data types (INT, VARCHAR, DATE, DATETIME, ENUM, TEXT, BOOLEAN)
-- 3. Add NOT NULL constraints where data is required
-- 4. Use UNIQUE constraints for fields that must be unique
-- 5. Add FOREIGN KEY constraints with ON DELETE/UPDATE rules:
--    - CASCADE: Delete/update related records
--    - SET NULL: Set foreign key to NULL
--    - RESTRICT: Prevent deletion/update if related records exist
-- 6. Add indexes on foreign keys and frequently queried columns
-- 7. Use ENUM for fixed value sets
-- 8. Add created_at and updated_at timestamps for audit trails
-- 9. Use utf8mb4 charset for international character support

