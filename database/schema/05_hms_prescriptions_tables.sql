-- Prescriptions & Pharmacy Tables
USE Peter_healthcare_management_system;

-- MEDICATIONS
CREATE TABLE medications (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    medication_name VARCHAR(200) UNIQUE NOT NULL,
    generic_name VARCHAR(200),
    medication_type ENUM('Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler', 'Other') NOT NULL,
    strength VARCHAR(50),
    unit ENUM('mg', 'ml', 'g', 'units', 'mcg', 'IU') NOT NULL,
    manufacturer VARCHAR(200),
    price_per_unit DECIMAL(10,2) DEFAULT 0.00,
    requires_prescription BOOLEAN DEFAULT TRUE,
    status ENUM('Available', 'Discontinued', 'Out of Stock', 'Restricted') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_medication_name (medication_name),
    INDEX idx_generic_name (generic_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PHARMACY_SUPPLIERS
CREATE TABLE pharmacy_suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(200) UNIQUE NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_supplier_name (supplier_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MEDICATION_INVENTORY
CREATE TABLE medication_inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id INT NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    reorder_level INT DEFAULT 10,
    supplier_id INT,
    location VARCHAR(200),
    last_restocked_date DATE,
    unit_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (medication_id) 
        REFERENCES medications(medication_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (supplier_id) 
        REFERENCES pharmacy_suppliers(supplier_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_medication_id (medication_id),
    INDEX idx_batch_number (batch_number),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MEDICATION_INTERACTIONS
CREATE TABLE medication_interactions (
    interaction_id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id_1 INT NOT NULL,
    medication_id_2 INT NOT NULL,
    interaction_type ENUM('Severe', 'Moderate', 'Mild', 'Unknown') NOT NULL,
    description TEXT,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (medication_id_1) 
        REFERENCES medications(medication_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (medication_id_2) 
        REFERENCES medications(medication_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_medication_1 (medication_id_1),
    INDEX idx_medication_2 (medication_id_2),
    INDEX idx_interaction_type (interaction_type),
    UNIQUE KEY unique_interaction (medication_id_1, medication_id_2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOSAGE_INSTRUCTIONS
CREATE TABLE dosage_instructions (
    instruction_id INT AUTO_INCREMENT PRIMARY KEY,
    instruction_text VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_instruction_text (instruction_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PRESCRIPTIONS
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    visit_id INT,
    prescription_date DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Cancelled', 'Expired') DEFAULT 'Active',
    instructions TEXT,
    refills_allowed INT DEFAULT 0,
    refills_remaining INT DEFAULT 0,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (visit_id) 
        REFERENCES patient_visits(visit_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_prescription_date (prescription_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PRESCRIPTION_ITEMS
CREATE TABLE prescription_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medication_id INT NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration_days INT,
    quantity INT NOT NULL,
    instructions TEXT,
    status ENUM('Pending', 'Dispensed', 'Cancelled', 'Out of Stock') DEFAULT 'Pending',
    dispensed_date DATE,
    dispensed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prescription_id) 
        REFERENCES prescriptions(prescription_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (medication_id) 
        REFERENCES medications(medication_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (dispensed_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_prescription_id (prescription_id),
    INDEX idx_medication_id (medication_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

