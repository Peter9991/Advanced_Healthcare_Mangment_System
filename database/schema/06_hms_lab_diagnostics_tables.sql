-- Laboratory & Diagnostics Tables
USE HMS_Database;

-- LAB_CATEGORIES
CREATE TABLE lab_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LAB_TESTS
CREATE TABLE lab_tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(200) UNIQUE NOT NULL,
    test_code VARCHAR(50) UNIQUE,
    category_id INT,
    description TEXT,
    normal_range_min DECIMAL(10,2),
    normal_range_max DECIMAL(10,2),
    unit VARCHAR(20),
    price DECIMAL(10,2) DEFAULT 0.00,
    turnaround_time_hours INT DEFAULT 24,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) 
        REFERENCES lab_categories(category_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_test_name (test_name),
    INDEX idx_test_code (test_code),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LAB_TEST_ORDERS
CREATE TABLE lab_test_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    visit_id INT,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    priority ENUM('Routine', 'Urgent', 'STAT', 'ASAP') DEFAULT 'Routine',
    status ENUM('Ordered', 'In Progress', 'Completed', 'Cancelled', 'Rejected') DEFAULT 'Ordered',
    instructions TEXT,
    ordered_by INT,
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
    FOREIGN KEY (ordered_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_order_date (order_date),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LAB_TEST_ORDER_ITEMS
CREATE TABLE lab_test_order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    test_id INT NOT NULL,
    status ENUM('Ordered', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Ordered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) 
        REFERENCES lab_test_orders(order_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (test_id) 
        REFERENCES lab_tests(test_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_order_id (order_id),
    INDEX idx_test_id (test_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LAB_RESULTS
CREATE TABLE lab_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    test_id INT NOT NULL,
    result_value VARCHAR(200),
    unit VARCHAR(20),
    reference_range VARCHAR(100),
    status ENUM('Normal', 'Abnormal', 'Critical', 'Pending') DEFAULT 'Pending',
    performed_by INT,
    verified_by INT,
    result_date DATE,
    result_time TIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_item_id) 
        REFERENCES lab_test_order_items(order_item_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (test_id) 
        REFERENCES lab_tests(test_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (performed_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (verified_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_order_item_id (order_item_id),
    INDEX idx_test_id (test_id),
    INDEX idx_status (status),
    INDEX idx_result_date (result_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RADIOLOGY_ORDERS
CREATE TABLE radiology_orders (
    radiology_order_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    visit_id INT,
    study_type ENUM('X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography', 'Nuclear Medicine', 'Other') NOT NULL,
    body_part VARCHAR(200),
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    priority ENUM('Routine', 'Urgent', 'STAT') DEFAULT 'Routine',
    clinical_indication TEXT,
    status ENUM('Ordered', 'Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Ordered',
    scheduled_date DATE,
    scheduled_time TIME,
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
    INDEX idx_order_date (order_date),
    INDEX idx_status (status),
    INDEX idx_study_type (study_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RADIOLOGY_RESULTS
CREATE TABLE radiology_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    radiology_order_id INT NOT NULL,
    study_date DATE NOT NULL,
    study_time TIME NOT NULL,
    findings TEXT,
    impression TEXT,
    recommendations TEXT,
    radiologist_id INT NOT NULL,
    image_files JSON,
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (radiology_order_id) 
        REFERENCES radiology_orders(radiology_order_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (radiologist_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_radiology_order_id (radiology_order_id),
    INDEX idx_radiologist_id (radiologist_id),
    INDEX idx_study_date (study_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- IMAGING_STUDIES
CREATE TABLE imaging_studies (
    study_id INT AUTO_INCREMENT PRIMARY KEY,
    radiology_order_id INT NOT NULL,
    study_name VARCHAR(200) NOT NULL,
    modality ENUM('X-Ray', 'CT', 'MRI', 'US', 'Nuclear', 'Mammography', 'Other') NOT NULL,
    body_part VARCHAR(200),
    contrast_used BOOLEAN DEFAULT FALSE,
    images_count INT DEFAULT 0,
    storage_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (radiology_order_id) 
        REFERENCES radiology_orders(radiology_order_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_radiology_order_id (radiology_order_id),
    INDEX idx_modality (modality)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATHOLOGY_REPORTS
CREATE TABLE pathology_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    order_id INT,
    specimen_type VARCHAR(200),
    collection_date DATE,
    received_date DATE,
    report_date DATE,
    gross_description TEXT,
    microscopic_description TEXT,
    diagnosis TEXT,
    pathologist_id INT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (order_id) 
        REFERENCES lab_test_orders(order_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (pathologist_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_order_id (order_id),
    INDEX idx_pathologist_id (pathologist_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

