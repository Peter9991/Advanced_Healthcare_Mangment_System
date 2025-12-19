-- ============================================================================
-- Healthcare Management System - Complete Schema for AWS RDS Deployment
-- ============================================================================
-- This script combines all schema files for deployment to Amazon RDS MySQL
-- Note: The database should already be created when you create the RDS instance
-- ============================================================================

USE HMS_Database;

-- ============================================================================
-- 01: Doctors & Staff Tables
-- ============================================================================

-- STAFF_ROLES
CREATE TABLE staff_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DEPARTMENTS
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    head_of_department INT,
    location VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_department_name (department_name),
    INDEX idx_department_code (department_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- STAFF
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('M', 'F', 'Other'),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    hire_date DATE NOT NULL,
    department_id INT,
    role_id INT NOT NULL,
    salary DECIMAL(10,2),
    status ENUM('Active', 'On Leave', 'Terminated', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (role_id) 
        REFERENCES staff_roles(role_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_employee_id (employee_id),
    INDEX idx_name (last_name, first_name),
    INDEX idx_department_id (department_id),
    INDEX idx_role_id (role_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE departments
ADD CONSTRAINT fk_departments_head_of_department
FOREIGN KEY (head_of_department) 
    REFERENCES staff(staff_id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;

-- DOCTOR_SPECIALTIES
CREATE TABLE doctor_specialties (
    specialty_id INT AUTO_INCREMENT PRIMARY KEY,
    specialty_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_specialty_name (specialty_name),
    INDEX idx_department_id (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOCTORS
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    specialization_id INT,
    years_of_experience INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    bio TEXT,
    qualifications_text TEXT,
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (specialization_id) 
        REFERENCES doctor_specialties(specialty_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_license_number (license_number),
    INDEX idx_staff_id (staff_id),
    INDEX idx_specialization_id (specialization_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOCTOR_QUALIFICATIONS
CREATE TABLE doctor_qualifications (
    qualification_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    degree_type ENUM('MBBS', 'MD', 'PhD', 'Diploma', 'Certificate', 'MSc', 'BSc', 'Other') NOT NULL,
    institution_name VARCHAR(200) NOT NULL,
    graduation_year YEAR,
    specialization VARCHAR(100),
    certificate_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_degree_type (degree_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOCTOR_SCHEDULES
CREATE TABLE doctor_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    location VARCHAR(200),
    max_appointments INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- STAFF_SHIFTS
CREATE TABLE staff_shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    shift_date DATE NOT NULL,
    shift_type ENUM('Morning', 'Afternoon', 'Night', 'On-Call') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Absent', 'Cancelled') DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) 
        REFERENCES staff(staff_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_staff_id (staff_id),
    INDEX idx_shift_date (shift_date),
    INDEX idx_shift_type (shift_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 02: Patient Management Tables
-- ============================================================================

-- PATIENTS
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    passport_number VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    occupation VARCHAR(100),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive', 'Deceased') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_national_id (national_id),
    INDEX idx_name (last_name, first_name),
    INDEX idx_status (status),
    INDEX idx_registration_date (registration_date),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_CONTACTS
CREATE TABLE patient_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    contact_type ENUM('Primary', 'Secondary', 'Emergency') NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_contact_type (contact_type),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSURANCE_PROVIDERS
CREATE TABLE insurance_providers (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(100) UNIQUE NOT NULL,
    provider_code VARCHAR(20) UNIQUE,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider_name (provider_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_INSURANCE
CREATE TABLE patient_insurance (
    insurance_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    insurance_provider_id INT NOT NULL,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    coverage_start_date DATE NOT NULL,
    coverage_end_date DATE,
    coverage_percentage DECIMAL(5,2) DEFAULT 0.00,
    max_coverage_amount DECIMAL(10,2),
    deductible_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('Active', 'Expired', 'Pending', 'Suspended') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (insurance_provider_id) 
        REFERENCES insurance_providers(provider_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_policy_number (policy_number),
    INDEX idx_status (status),
    INDEX idx_coverage_dates (coverage_start_date, coverage_end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_MEDICAL_HISTORY
CREATE TABLE patient_medical_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    condition_name VARCHAR(200) NOT NULL,
    icd_code VARCHAR(20),
    diagnosis_date DATE,
    treatment_description TEXT,
    current_status ENUM('Active', 'Resolved', 'Chronic', 'In Remission') DEFAULT 'Active',
    doctor_notes TEXT,
    diagnosed_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_condition_name (condition_name),
    INDEX idx_status (current_status),
    INDEX idx_diagnosis_date (diagnosis_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_ALLERGIES
CREATE TABLE patient_allergies (
    allergy_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    allergen_name VARCHAR(200) NOT NULL,
    allergy_type ENUM('Medication', 'Food', 'Environmental', 'Latex', 'Other') NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe', 'Life-threatening') NOT NULL,
    reaction_description TEXT,
    diagnosed_date DATE,
    diagnosed_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_allergen_name (allergen_name),
    INDEX idx_allergy_type (allergy_type),
    INDEX idx_severity (severity),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_EMERGENCY_CONTACTS
CREATE TABLE patient_emergency_contacts (
    emergency_contact_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    relationship ENUM('Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Guardian', 'Other') NOT NULL,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    can_make_decisions BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_is_primary (is_primary_contact),
    INDEX idx_relationship (relationship)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_DOCUMENTS
CREATE TABLE patient_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    document_type ENUM('ID', 'Passport', 'Insurance', 'Medical Report', 'Consent Form', 'Lab Result', 'X-Ray', 'Other') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT,
    verified_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (uploaded_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    FOREIGN KEY (verified_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_document_type (document_type),
    INDEX idx_uploaded_date (uploaded_date),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PATIENT_VISITS
CREATE TABLE patient_visits (
    visit_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    visit_type ENUM('Consultation', 'Follow-up', 'Emergency', 'Routine Check', 'Surgery Consultation', 'Other') NOT NULL,
    department_id INT,
    doctor_id INT,
    chief_complaint TEXT,
    visit_status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
    notes TEXT,
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
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_visit_date (visit_date),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_department_id (department_id),
    INDEX idx_visit_status (visit_status),
    INDEX idx_visit_datetime (visit_date, visit_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 03: Appointments Tables
-- ============================================================================

-- APPOINTMENT_TYPES
CREATE TABLE appointment_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    duration_minutes INT DEFAULT 30,
    fee DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type_name (type_name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APPOINTMENT_STATUS
CREATE TABLE appointment_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TIME_SLOTS
CREATE TABLE time_slots (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    slot_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slot_time (slot_time),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APPOINTMENTS
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type_id INT NOT NULL,
    status_id INT NOT NULL,
    reason_for_visit TEXT,
    notes TEXT,
    created_by INT,
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
    FOREIGN KEY (appointment_type_id) 
        REFERENCES appointment_types(type_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (status_id) 
        REFERENCES appointment_status(status_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (created_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_appointment_datetime (appointment_date, appointment_time),
    INDEX idx_status_id (status_id),
    INDEX idx_type_id (appointment_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- APPOINTMENT_REMINDERS
CREATE TABLE appointment_reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    reminder_type ENUM('SMS', 'Email', 'Phone', 'Push Notification') NOT NULL,
    reminder_date DATE NOT NULL,
    reminder_time TIME NOT NULL,
    sent_status BOOLEAN DEFAULT FALSE,
    sent_at DATETIME,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (appointment_id) 
        REFERENCES appointments(appointment_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_reminder_datetime (reminder_date, reminder_time),
    INDEX idx_sent_status (sent_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOCTOR_AVAILABILITY
CREATE TABLE doctor_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot_start TIME NOT NULL,
    time_slot_end TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    reason_if_unavailable VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_date (date),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 04: Medical Records Tables
-- ============================================================================

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

-- ============================================================================
-- 05: Prescriptions & Pharmacy Tables
-- ============================================================================

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

-- ============================================================================
-- 06: Laboratory & Diagnostics Tables
-- ============================================================================

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

-- ============================================================================
-- 07: Billing & Finance Tables
-- ============================================================================

-- BILLING_CODES
CREATE TABLE billing_codes (
    code_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SERVICE_CHARGES
CREATE TABLE service_charges (
    charge_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(200) UNIQUE NOT NULL,
    service_type VARCHAR(100),
    base_price DECIMAL(10,2) NOT NULL,
    department_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_service_name (service_name),
    INDEX idx_service_type (service_type),
    INDEX idx_department_id (department_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PAYMENT_METHODS
CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_method_name (method_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INVOICES
CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    visit_id INT,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Draft', 'Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled', 'Refunded') DEFAULT 'Pending',
    created_by INT,
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
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_patient_id (patient_id),
    INDEX idx_invoice_date (invoice_date),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INVOICE_ITEMS
CREATE TABLE invoice_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    service_type ENUM('Consultation', 'Lab Test', 'Radiology', 'Medication', 'Procedure', 'Room', 'Surgery', 'Other') NOT NULL,
    service_id INT,
    description VARCHAR(500) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    billing_code_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) 
        REFERENCES invoices(invoice_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (billing_code_id) 
        REFERENCES billing_codes(code_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_service_type (service_type),
    INDEX idx_billing_code_id (billing_code_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PAYMENTS
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    payment_date DATE NOT NULL,
    payment_time TIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method_id INT NOT NULL,
    transaction_reference VARCHAR(100),
    received_by INT,
    notes TEXT,
    status ENUM('Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) 
        REFERENCES invoices(invoice_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (payment_method_id) 
        REFERENCES payment_methods(method_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (received_by) 
        REFERENCES staff(staff_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_method_id (payment_method_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSURANCE_CLAIM_STATUS
CREATE TABLE insurance_claim_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSURANCE_CLAIMS
CREATE TABLE insurance_claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    patient_insurance_id INT NOT NULL,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    claim_date DATE NOT NULL,
    claim_amount DECIMAL(10,2) NOT NULL,
    approved_amount DECIMAL(10,2),
    status_id INT NOT NULL,
    submitted_date DATE,
    processed_date DATE,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) 
        REFERENCES invoices(invoice_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (patient_insurance_id) 
        REFERENCES patient_insurance(insurance_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (status_id) 
        REFERENCES insurance_claim_status(status_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_claim_number (claim_number),
    INDEX idx_claim_date (claim_date),
    INDEX idx_status_id (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DISCOUNTS
CREATE TABLE discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    discount_type ENUM('Percentage', 'Fixed Amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    reason TEXT,
    approved_by INT NOT NULL,
    approved_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) 
        REFERENCES invoices(invoice_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (approved_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_approved_by (approved_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- REFUNDS
CREATE TABLE refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_reason TEXT,
    refund_date DATE NOT NULL,
    processed_by INT NOT NULL,
    status ENUM('Pending', 'Processed', 'Cancelled', 'Rejected') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payment_id) 
        REFERENCES payments(payment_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    FOREIGN KEY (processed_by) 
        REFERENCES staff(staff_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_payment_id (payment_id),
    INDEX idx_refund_date (refund_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 08: Facilities & Operations Tables
-- ============================================================================

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

-- ============================================================================
-- Schema Deployment Complete
-- ============================================================================
-- Total Tables Created: 73
-- Verify deployment with: SELECT COUNT(*) FROM information_schema.tables 
--                         WHERE table_schema = 'HMS_Database';
-- ============================================================================

