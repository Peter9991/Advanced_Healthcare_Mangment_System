-- Medical Records Tables
USE Peter_healthcare_management_system;

-- MEDICAL_RECORDS
CREATE TABLE medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    visit_id INT,
    doctor_id INT NOT NULL,
    record_date DATE NOT NULL,
    record_time TIME NOT NULL,
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    physical_examination TEXT,
    assessment TEXT,
    plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (visit_id) 
        REFERENCES patient_visits(visit_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_visit_id (visit_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_record_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DIAGNOSES
CREATE TABLE diagnoses (
    diagnosis_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    icd_code VARCHAR(20),
    diagnosis_name VARCHAR(200) NOT NULL,
    diagnosis_type ENUM('Primary', 'Secondary', 'Differential', 'Provisional') NOT NULL,
    severity VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_record_id (record_id),
    INDEX idx_icd_code (icd_code),
    INDEX idx_diagnosis_name (diagnosis_name),
    INDEX idx_diagnosis_type (diagnosis_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TREATMENTS
CREATE TABLE treatments (
    treatment_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    treatment_name VARCHAR(200) NOT NULL,
    treatment_type ENUM('Medication', 'Procedure', 'Therapy', 'Surgery', 'Other') NOT NULL,
    start_date DATE,
    end_date DATE,
    frequency VARCHAR(100),
    instructions TEXT,
    status ENUM('Ongoing', 'Completed', 'Discontinued', 'Pending') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_record_id (record_id),
    INDEX idx_treatment_name (treatment_name),
    INDEX idx_treatment_type (treatment_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TREATMENT_PLANS
CREATE TABLE treatment_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    goals TEXT,
    status ENUM('Active', 'Completed', 'Cancelled', 'On Hold') DEFAULT 'Active',
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
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- VITAL_SIGNS
CREATE TABLE vital_signs (
    vital_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT,
    patient_id INT NOT NULL,
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    temperature DECIMAL(4,2),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    heart_rate INT,
    respiratory_rate INT,
    oxygen_saturation DECIMAL(5,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(5,2),
    pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
    measured_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (measured_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_record_id (record_id),
    INDEX idx_measurement_datetime (measurement_date, measurement_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CLINICAL_NOTES
CREATE TABLE clinical_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT,
    note_type ENUM('Progress', 'Nursing', 'Physician', 'Consultation', 'Discharge', 'Other') NOT NULL,
    note_text TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (created_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_record_id (record_id),
    INDEX idx_note_type (note_type),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PROGRESS_NOTES
CREATE TABLE progress_notes (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    visit_id INT,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (visit_id) 
        REFERENCES patient_visits(visit_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (created_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_visit_id (visit_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ADMISSIONS
CREATE TABLE admissions (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    admission_date DATE NOT NULL,
    admission_time TIME NOT NULL,
    admission_type ENUM('Emergency', 'Elective', 'Transfer', 'Observation') NOT NULL,
    department_id INT,
    admitting_doctor_id INT NOT NULL,
    diagnosis_on_admission TEXT,
    expected_discharge_date DATE,
    actual_discharge_date DATE,
    status ENUM('Admitted', 'Discharged', 'Transferred', 'Cancelled') DEFAULT 'Admitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (admitting_doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_admission_date (admission_date),
    INDEX idx_department_id (department_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DISCHARGE_SUMMARIES
CREATE TABLE discharge_summaries (
    discharge_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    admission_id INT,
    discharge_date DATE NOT NULL,
    discharge_time TIME NOT NULL,
    discharge_type ENUM('Routine', 'Against Medical Advice', 'Transfer', 'Death', 'Other') NOT NULL,
    diagnosis_at_discharge TEXT,
    treatment_summary TEXT,
    follow_up_instructions TEXT,
    follow_up_date DATE,
    discharge_physician INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (admission_id) 
        REFERENCES admissions(admission_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (discharge_physician) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_admission_id (admission_id),
    INDEX idx_discharge_date (discharge_date),
    INDEX idx_discharge_type (discharge_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SURGICAL_PROCEDURES
CREATE TABLE surgical_procedures (
    procedure_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    procedure_name VARCHAR(200) NOT NULL,
    icd_pcs_code VARCHAR(20),
    scheduled_date DATE,
    scheduled_time TIME,
    actual_start_time DATETIME,
    actual_end_time DATETIME,
    surgeon_id INT NOT NULL,
    anesthesiologist_id INT,
    procedure_type ENUM('Major', 'Minor', 'Emergency') NOT NULL,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed') DEFAULT 'Scheduled',
    outcome TEXT,
    complications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (surgeon_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (anesthesiologist_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_surgeon_id (surgeon_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ANESTHESIA_RECORDS
CREATE TABLE anesthesia_records (
    anesthesia_id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id INT NOT NULL,
    anesthesiologist_id INT NOT NULL,
    anesthesia_type VARCHAR(100) NOT NULL,
    medications_used TEXT,
    start_time DATETIME,
    end_time DATETIME,
    complications TEXT,
    recovery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (procedure_id) 
        REFERENCES surgical_procedures(procedure_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (anesthesiologist_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_procedure_id (procedure_id),
    INDEX idx_anesthesiologist_id (anesthesiologist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OPERATION_THEATER_BOOKINGS
CREATE TABLE operation_theater_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_id INT NOT NULL,
    theater_number VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    equipment_required JSON,
    status ENUM('Booked', 'In Use', 'Completed', 'Cancelled') DEFAULT 'Booked',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (procedure_id) 
        REFERENCES surgical_procedures(procedure_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_procedure_id (procedure_id),
    INDEX idx_booking_datetime (booking_date, booking_time),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TRANSFERS
CREATE TABLE transfers (
    transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    from_department_id INT,
    to_department_id INT NOT NULL,
    from_room_id INT,
    to_room_id INT,
    transfer_date DATE NOT NULL,
    transfer_time TIME NOT NULL,
    reason TEXT,
    authorized_by INT NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (from_department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (to_department_id) 
        REFERENCES departments(department_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (authorized_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_transfer_date (transfer_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

