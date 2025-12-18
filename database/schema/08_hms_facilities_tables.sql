-- Facilities Tables (Run after 04_hms_medical_records_tables.sql)
USE Peter_healthcare_management_system;

-- ROOMS
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    room_type ENUM('Ward', 'Private', 'ICU', 'Operation Theater', 'Emergency', 'Consultation', 'Isolation', 'Other') NOT NULL,
    capacity INT DEFAULT 1,
    floor_number INT,
    status ENUM('Available', 'Occupied', 'Maintenance', 'Reserved', 'Out of Service') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_room_number (room_number),
    INDEX idx_department_id (department_id),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BEDS
CREATE TABLE beds (
    bed_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    bed_number VARCHAR(20) NOT NULL,
    bed_type ENUM('Regular', 'ICU', 'Emergency', 'Isolation') DEFAULT 'Regular',
    status ENUM('Available', 'Occupied', 'Maintenance', 'Reserved') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) 
        REFERENCES rooms(room_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_room_id (room_id),
    INDEX idx_bed_number (bed_number),
    INDEX idx_status (status),
    UNIQUE KEY unique_bed (room_id, bed_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BED_ASSIGNMENTS
CREATE TABLE bed_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    bed_id INT NOT NULL,
    patient_id INT NOT NULL,
    admission_id INT,
    assigned_date DATE NOT NULL,
    assigned_time TIME NOT NULL,
    discharged_date DATE,
    discharged_time TIME,
    status ENUM('Active', 'Discharged', 'Transferred') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bed_id) 
        REFERENCES beds(bed_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (admission_id) 
        REFERENCES admissions(admission_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_bed_id (bed_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_admission_id (admission_id),
    INDEX idx_status (status),
    INDEX idx_assigned_date (assigned_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EQUIPMENT
CREATE TABLE equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(200) NOT NULL,
    equipment_type VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    department_id INT,
    manufacturer VARCHAR(200),
    model_number VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    status ENUM('Available', 'In Use', 'Maintenance', 'Out of Service', 'Retired') DEFAULT 'Available',
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_equipment_name (equipment_name),
    INDEX idx_serial_number (serial_number),
    INDEX idx_department_id (department_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EQUIPMENT_MAINTENANCE
CREATE TABLE equipment_maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    maintenance_type ENUM('Preventive', 'Corrective', 'Calibration', 'Inspection') NOT NULL,
    scheduled_date DATE,
    performed_date DATE,
    performed_by VARCHAR(200),
    cost DECIMAL(10,2),
    notes TEXT,
    next_maintenance_date DATE,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Overdue', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (equipment_id) 
        REFERENCES equipment(equipment_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_equipment_id (equipment_id),
    INDEX idx_maintenance_type (maintenance_type),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_CONSENTS
CREATE TABLE patient_consents (
    consent_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    consent_type ENUM('Treatment', 'Surgery', 'Anesthesia', 'Research', 'Information Sharing', 'Photography', 'Other') NOT NULL,
    consent_date DATE NOT NULL,
    consent_status ENUM('Given', 'Refused', 'Pending', 'Withdrawn') DEFAULT 'Pending',
    witness_name VARCHAR(200),
    witness_signature VARCHAR(500),
    document_path VARCHAR(500),
    expires_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_consent_type (consent_type),
    INDEX idx_consent_status (consent_status),
    INDEX idx_consent_date (consent_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INCIDENT_REPORTS
CREATE TABLE incident_reports (
    incident_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_date DATE NOT NULL,
    incident_time TIME NOT NULL,
    patient_id INT,
    staff_id INT,
    incident_type ENUM('Patient Fall', 'Medication Error', 'Equipment Failure', 'Security', 'Infection', 'Other') NOT NULL,
    severity ENUM('Minor', 'Moderate', 'Major', 'Critical') NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_by INT NOT NULL,
    status ENUM('Reported', 'Under Investigation', 'Resolved', 'Closed') DEFAULT 'Reported',
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (staff_id) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (reported_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_incident_date (incident_date),
    INDEX idx_patient_id (patient_id),
    INDEX idx_staff_id (staff_id),
    INDEX idx_incident_type (incident_type),
    INDEX idx_severity (severity),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AUDIT_LOGS
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_action (action),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

