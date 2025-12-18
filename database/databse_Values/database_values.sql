Seed Data
USE Peter_healthcare_management_system;

STAFF ROLES
INSERT INTO staff_roles (role_name, description) VALUES
('Admin', 'System Administrator'),
('Doctor', 'Medical Doctor'),
('Nurse', 'Registered Nurse'),
('Lab Technician', 'Laboratory Technician'),
('Pharmacist', 'Pharmacy Staff'),
('Receptionist', 'Front Desk Staff'),
('Radiologist', 'Radiology Specialist'),
('Accountant', 'Billing and Finance Staff');

DEPARTMENTS
INSERT INTO departments (department_name, department_code, location, phone, email, description) VALUES
('Cardiology', 'CARD', 'Building A, Floor 2', '01-234-5678', 'cardiology@hospital.com', 'Heart and cardiovascular care'),
('Neurology', 'NEURO', 'Building A, Floor 3', '01-234-5679', 'neurology@hospital.com', 'Brain and nervous system care'),
('Orthopedics', 'ORTHO', 'Building B, Floor 1', '01-234-5680', 'orthopedics@hospital.com', 'Bone and joint care'),
('Pediatrics', 'PED', 'Building B, Floor 2', '01-234-5681', 'pediatrics@hospital.com', 'Children healthcare'),
('Emergency', 'ER', 'Building C, Ground Floor', '01-234-5682', 'emergency@hospital.com', 'Emergency care'),
('General Medicine', 'GEN', 'Building A, Floor 1', '01-234-5683', 'general@hospital.com', 'General medical care'),
('Radiology', 'RAD', 'Building D, Floor 1', '01-234-5684', 'radiology@hospital.com', 'Imaging services'),
('Laboratory', 'LAB', 'Building D, Floor 2', '01-234-5685', 'lab@hospital.com', 'Laboratory services'),
('Pharmacy', 'PHARM', 'Building C, Floor 1', '01-234-5686', 'pharmacy@hospital.com', 'Pharmacy services');

STAFF
INSERT INTO staff (employee_id, first_name, last_name, date_of_birth, gender, phone, email, address, city, country, hire_date, department_id, role_id, salary, status) VALUES
('EMP001', 'Ahmed', 'Al-Saud', '1980-05-15', 'M', '0501234567', 'ahmed.alsaud@hospital.com', '123 Main St', 'Riyadh', 'Saudi Arabia', '2020-01-15', 
    (SELECT department_id FROM departments WHERE department_code = 'CARD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 25000.00, 'Active'),
('EMP002', 'Fatima', 'Al-Rashid', '1985-08-20', 'F', '0501234568', 'fatima.alrashid@hospital.com', '456 King St', 'Riyadh', 'Saudi Arabia', '2020-02-01', 
    (SELECT department_id FROM departments WHERE department_code = 'NEURO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 24000.00, 'Active'),
('EMP003', 'Mohammed', 'Al-Otaibi', '1990-03-10', 'M', '0501234569', 'mohammed.alotaibi@hospital.com', '789 Prince St', 'Riyadh', 'Saudi Arabia', '2021-03-01', 
    (SELECT department_id FROM departments WHERE department_code = 'ORTHO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 23000.00, 'Active'),
('EMP004', 'Sara', 'Al-Mansouri', '1988-11-25', 'F', '0501234570', 'sara.almansouri@hospital.com', '321 Queen St', 'Riyadh', 'Saudi Arabia', '2020-06-01', 
    (SELECT department_id FROM departments WHERE department_code = 'PED' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 22000.00, 'Active'),
('EMP005', 'Khalid', 'Al-Zahrani', '1982-07-12', 'M', '0501234571', 'khalid.alzahrani@hospital.com', '654 Park Ave', 'Riyadh', 'Saudi Arabia', '2019-09-01', 
    (SELECT department_id FROM departments WHERE department_code = 'RAD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Radiologist' LIMIT 1), 26000.00, 'Active'),
('EMP006', 'Noura', 'Al-Harbi', '1992-04-18', 'F', '0501234572', 'noura.alharbi@hospital.com', '987 Garden St', 'Riyadh', 'Saudi Arabia', '2021-01-15', 
    (SELECT department_id FROM departments WHERE department_code = 'ORTHO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Nurse' LIMIT 1), 12000.00, 'Active'),
('EMP007', 'Omar', 'Al-Shammari', '1987-09-30', 'M', '0501234573', 'omar.alshammari@hospital.com', '147 Oak St', 'Riyadh', 'Saudi Arabia', '2020-08-01', 
    (SELECT department_id FROM departments WHERE department_code = 'LAB' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Lab Technician' LIMIT 1), 15000.00, 'Active'),
('EMP008', 'Layla', 'Al-Ghamdi', '1991-12-05', 'F', '0501234574', 'layla.alghamdi@hospital.com', '258 Pine St', 'Riyadh', 'Saudi Arabia', '2021-02-01', 
    (SELECT department_id FROM departments WHERE department_code = 'PHARM' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Pharmacist' LIMIT 1), 14000.00, 'Active'),
('EMP009', 'Yousef', 'Al-Mutairi', '1989-06-22', 'M', '0501234575', 'yousef.almutairi@hospital.com', '369 Elm St', 'Riyadh', 'Saudi Arabia', '2020-04-01', 
    (SELECT department_id FROM departments WHERE department_code = 'ER' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Receptionist' LIMIT 1), 10000.00, 'Active'),
('EMP010', 'Hala', 'Al-Qahtani', '1993-01-14', 'F', '0501234576', 'hala.alqahtani@hospital.com', '741 Maple St', 'Riyadh', 'Saudi Arabia', '2021-05-01', 
    (SELECT department_id FROM departments WHERE department_code = 'CARD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Admin' LIMIT 1), 18000.00, 'Active');

Update departments with head of department
UPDATE departments SET head_of_department = 1 WHERE department_id = 1;
UPDATE departments SET head_of_department = 2 WHERE department_id = 2;
UPDATE departments SET head_of_department = 3 WHERE department_id = 3;
UPDATE departments SET head_of_department = 4 WHERE department_id = 4;

DOCTOR SPECIALTIES
INSERT INTO doctor_specialties (specialty_name, description, department_id) VALUES
('Cardiologist', 'Heart and cardiovascular specialist', 1),
('Neurologist', 'Brain and nervous system specialist', 2),
('Orthopedic Surgeon', 'Bone and joint surgery specialist', 3),
('Pediatrician', 'Children healthcare specialist', 4),
('Emergency Medicine', 'Emergency care specialist', 5),
('General Practitioner', 'General medical care', 6),
('Radiologist', 'Medical imaging specialist', 7);

DOCTORS
INSERT INTO doctors (staff_id, license_number, specialization_id, years_of_experience, consultation_fee, bio, status) VALUES
(1, 'DOC-LIC-001', 1, 15, 500.00, 'Experienced cardiologist with expertise in heart diseases', 'Active'),
(2, 'DOC-LIC-002', 2, 12, 450.00, 'Neurologist specializing in brain disorders', 'Active'),
(3, 'DOC-LIC-003', 3, 10, 600.00, 'Orthopedic surgeon with focus on joint replacement', 'Active'),
(4, 'DOC-LIC-004', 4, 8, 400.00, 'Pediatrician with expertise in child healthcare', 'Active'),
(5, 'DOC-LIC-005', 7, 13, 550.00, 'Radiologist specializing in medical imaging', 'Active');

DOCTOR QUALIFICATIONS
INSERT INTO doctor_qualifications (doctor_id, degree_type, institution_name, graduation_year, specialization, certificate_number) VALUES
(1, 'MD', 'King Saud University', 2005, 'Cardiology', 'CERT-001'),
(1, 'MBBS', 'King Saud University', 2000, 'General Medicine', 'CERT-002'),
(2, 'MD', 'King Faisal University', 2008, 'Neurology', 'CERT-003'),
(2, 'MBBS', 'King Faisal University', 2003, 'General Medicine', 'CERT-004'),
(3, 'MD', 'King Abdulaziz University', 2010, 'Orthopedic Surgery', 'CERT-005'),
(4, 'MD', 'Imam Muhammad Ibn Saud University', 2012, 'Pediatrics', 'CERT-006'),
(5, 'MD', 'King Saud University', 2007, 'Radiology', 'CERT-007');

DOCTOR SCHEDULES
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available, location, max_appointments) VALUES
(1, 'Monday', '09:00:00', '17:00:00', TRUE, 'Cardiology Clinic A', 20),
(1, 'Wednesday', '09:00:00', '17:00:00', TRUE, 'Cardiology Clinic A', 20),
(1, 'Friday', '09:00:00', '13:00:00', TRUE, 'Cardiology Clinic A', 10),
(2, 'Tuesday', '08:00:00', '16:00:00', TRUE, 'Neurology Clinic B', 18),
(2, 'Thursday', '08:00:00', '16:00:00', TRUE, 'Neurology Clinic B', 18),
(3, 'Monday', '10:00:00', '18:00:00', TRUE, 'Orthopedics Clinic C', 15),
(3, 'Wednesday', '10:00:00', '18:00:00', TRUE, 'Orthopedics Clinic C', 15),
(4, 'Sunday', '09:00:00', '15:00:00', TRUE, 'Pediatrics Clinic D', 25),
(4, 'Tuesday', '09:00:00', '15:00:00', TRUE, 'Pediatrics Clinic D', 25),
(5, 'Monday', '08:00:00', '16:00:00', TRUE, 'Radiology Department', 30),
(5, 'Wednesday', '08:00:00', '16:00:00', TRUE, 'Radiology Department', 30);

-- INSURANCE PROVIDERS
INSERT INTO insurance_providers (provider_name, provider_code, contact_person, phone, email, address, status) VALUES
('Bupa Arabia', 'BUPA', 'Ahmed Ali', '01-800-1234', 'contact@bupa.com', 'Riyadh, Saudi Arabia', 'Active'),
('MedGulf', 'MEDGULF', 'Fatima Hassan', '01-800-5678', 'contact@medgulf.com', 'Jeddah, Saudi Arabia', 'Active'),
('Tawuniya', 'TAWUNIYA', 'Mohammed Saleh', '01-800-9012', 'contact@tawuniya.com', 'Riyadh, Saudi Arabia', 'Active'),
('AXA Cooperative', 'AXA', 'Sara Ahmed', '01-800-3456', 'contact@axa.com', 'Riyadh, Saudi Arabia', 'Active');

-- PATIENTS
INSERT INTO patients (national_id, first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, city, country, marital_status, occupation, status) VALUES
('1234567890', 'Ali', 'Al-Mutairi', '1985-03-15', 'M', 'O+', '0501111111', 'ali.almutairi@email.com', '100 Main Street', 'Riyadh', 'Saudi Arabia', 'Married', 'Engineer', 'Active'),
('1234567891', 'Nora', 'Al-Shehri', '1990-07-22', 'F', 'A+', '0501111112', 'nora.alshehri@email.com', '200 King Road', 'Riyadh', 'Saudi Arabia', 'Single', 'Teacher', 'Active'),
('1234567892', 'Khalid', 'Al-Harbi', '1978-11-08', 'M', 'B+', '0501111113', 'khalid.alharbi@email.com', '300 Prince Avenue', 'Riyadh', 'Saudi Arabia', 'Married', 'Businessman', 'Active'),
('1234567893', 'Maha', 'Al-Qahtani', '1995-02-14', 'F', 'AB+', '0501111114', 'maha.alqahtani@email.com', '400 Queen Street', 'Riyadh', 'Saudi Arabia', 'Single', 'Student', 'Active'),
('1234567894', 'Fahad', 'Al-Otaibi', '1982-09-30', 'M', 'A-', '0501111115', 'fahad.alotaibi@email.com', '500 Park Lane', 'Riyadh', 'Saudi Arabia', 'Married', 'Doctor', 'Active'),
('1234567895', 'Lina', 'Al-Zahrani', '1988-05-18', 'F', 'O-', '0501111116', 'lina.alzahrani@email.com', '600 Garden Road', 'Riyadh', 'Saudi Arabia', 'Married', 'Nurse', 'Active'),
('1234567896', 'Saud', 'Al-Shammari', '1992-12-25', 'M', 'B-', '0501111117', 'saud.alshammari@email.com', '700 Oak Street', 'Riyadh', 'Saudi Arabia', 'Single', 'Accountant', 'Active'),
('1234567897', 'Reem', 'Al-Ghamdi', '1987-08-10', 'F', 'A+', '0501111118', 'reem.alghamdi@email.com', '800 Pine Avenue', 'Riyadh', 'Saudi Arabia', 'Married', 'Designer', 'Active'),
('1234567898', 'Yousef', 'Al-Mansouri', '1975-04-05', 'M', 'O+', '0501111119', 'yousef.almansouri@email.com', '900 Elm Street', 'Riyadh', 'Saudi Arabia', 'Married', 'Manager', 'Active'),
('1234567899', 'Hanan', 'Al-Rashid', '1993-01-20', 'F', 'AB-', '0501111120', 'hanan.alrashid@email.com', '1000 Maple Drive', 'Riyadh', 'Saudi Arabia', 'Single', 'Lawyer', 'Active');

-- PATIENT INSURANCE
INSERT INTO patient_insurance (patient_id, insurance_provider_id, policy_number, coverage_start_date, coverage_end_date, coverage_percentage, max_coverage_amount, deductible_amount, status) VALUES
(1, 1, 'POL-001-2023', '2023-01-01', '2023-12-31', 80.00, 50000.00, 500.00, 'Active'),
(2, 2, 'POL-002-2023', '2023-01-01', '2023-12-31', 75.00, 40000.00, 1000.00, 'Active'),
(3, 1, 'POL-003-2023', '2023-01-01', '2023-12-31', 85.00, 60000.00, 300.00, 'Active'),
(4, 3, 'POL-004-2023', '2023-01-01', '2023-12-31', 70.00, 30000.00, 1500.00, 'Active'),
(5, 4, 'POL-005-2023', '2023-01-01', '2023-12-31', 90.00, 80000.00, 200.00, 'Active'),
(6, 1, 'POL-006-2023', '2023-01-01', '2023-12-31', 80.00, 50000.00, 500.00, 'Active'),
(7, 2, 'POL-007-2023', '2023-01-01', '2023-12-31', 75.00, 40000.00, 1000.00, 'Active'),
(8, 3, 'POL-008-2023', '2023-01-01', '2023-12-31', 70.00, 30000.00, 1500.00, 'Active'),
(9, 4, 'POL-009-2023', '2023-01-01', '2023-12-31', 90.00, 80000.00, 200.00, 'Active'),
(10, 1, 'POL-010-2023', '2023-01-01', '2023-12-31', 80.00, 50000.00, 500.00, 'Active');

-- PATIENT ALLERGIES
INSERT INTO patient_allergies (patient_id, allergen_name, allergy_type, severity, reaction_description, diagnosed_date) VALUES
(1, 'Penicillin', 'Medication', 'Severe', 'Rash and difficulty breathing', '2020-05-10'),
(2, 'Peanuts', 'Food', 'Life-threatening', 'Anaphylaxis', '2018-03-15'),
(3, 'Latex', 'Environmental', 'Moderate', 'Skin irritation', '2019-07-20'),
(4, 'Aspirin', 'Medication', 'Mild', 'Mild rash', '2021-01-05'),
(6, 'Shellfish', 'Food', 'Severe', 'Swelling and hives', '2017-09-12');

-- PATIENT EMERGENCY CONTACTS
INSERT INTO patient_emergency_contacts (patient_id, contact_name, relationship, phone_primary, phone_secondary, email, address, is_primary_contact, can_make_decisions) VALUES
(1, 'Fatima Al-Mutairi', 'Spouse', '0502222221', NULL, 'fatima@email.com', '100 Main Street', TRUE, TRUE),
(2, 'Ahmed Al-Shehri', 'Parent', '0502222222', '0502222223', 'ahmed@email.com', '200 King Road', TRUE, TRUE),
(3, 'Nora Al-Harbi', 'Spouse', '0502222224', NULL, 'nora@email.com', '300 Prince Avenue', TRUE, TRUE),
(4, 'Khalid Al-Qahtani', 'Parent', '0502222225', NULL, 'khalid@email.com', '400 Queen Street', TRUE, TRUE),
(5, 'Maha Al-Otaibi', 'Spouse', '0502222226', NULL, 'maha@email.com', '500 Park Lane', TRUE, TRUE);

-- APPOINTMENT TYPES
INSERT INTO appointment_types (type_name, duration_minutes, fee, description, is_active) VALUES
('Consultation', 30, 300.00, 'General consultation', TRUE),
('Follow-up', 20, 200.00, 'Follow-up visit', TRUE),
('Emergency', 60, 500.00, 'Emergency consultation', TRUE),
('Surgery Consultation', 45, 400.00, 'Pre-surgery consultation', TRUE),
('Routine Check', 15, 150.00, 'Routine health check', TRUE);

-- APPOINTMENT STATUS
INSERT INTO appointment_status (status_name, description) VALUES
('Scheduled', 'Appointment is scheduled'),
('Confirmed', 'Appointment is confirmed'),
('In Progress', 'Appointment is currently in progress'),
('Completed', 'Appointment is completed'),
('Cancelled', 'Appointment is cancelled'),
('No Show', 'Patient did not show up');

-- APPOINTMENTS
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_type_id, status_id, reason_for_visit, created_by) VALUES
(1, 1, '2024-01-15', '10:00:00', 1, 4, 'Chest pain and shortness of breath', 9),
(2, 2, '2024-01-16', '09:00:00', 1, 4, 'Headaches and dizziness', 9),
(3, 3, '2024-01-17', '11:00:00', 1, 4, 'Knee pain after injury', 9),
(4, 4, '2024-01-18', '10:30:00', 1, 4, 'Child fever and cough', 9),
(1, 1, '2024-02-01', '14:00:00', 2, 1, 'Follow-up for heart condition', 9),
(5, 1, '2024-02-05', '09:00:00', 1, 1, 'Heart checkup', 9),
(6, 2, '2024-02-06', '10:00:00', 1, 1, 'Neurological examination', 9),
(7, 3, '2024-02-07', '11:00:00', 1, 1, 'Back pain consultation', 9),
(8, 4, '2024-02-08', '09:30:00', 1, 1, 'Child vaccination', 9),
(9, 1, '2024-02-10', '15:00:00', 1, 1, 'Cardiac screening', 9);

-- PATIENT VISITS
INSERT INTO patient_visits (patient_id, visit_date, visit_time, visit_type, department_id, doctor_id, chief_complaint, visit_status) VALUES
(1, '2024-01-15', '10:00:00', 'Consultation', 1, 1, 'Chest pain and shortness of breath', 'Completed'),
(2, '2024-01-16', '09:00:00', 'Consultation', 2, 2, 'Headaches and dizziness', 'Completed'),
(3, '2024-01-17', '11:00:00', 'Consultation', 3, 3, 'Knee pain after injury', 'Completed'),
(4, '2024-01-18', '10:30:00', 'Consultation', 4, 4, 'Child fever and cough', 'Completed'),
(5, '2024-01-20', '14:00:00', 'Emergency', 5, 1, 'Severe chest pain', 'Completed');

-- MEDICAL RECORDS
INSERT INTO medical_records (patient_id, visit_id, doctor_id, record_date, record_time, chief_complaint, history_of_present_illness, physical_examination, assessment, plan) VALUES
(1, 1, 1, '2024-01-15', '10:00:00', 'Chest pain and shortness of breath', 'Patient reports chest pain for 2 days, worsens with activity', 'BP: 140/90, HR: 95, Regular rhythm, No murmurs', 'Possible angina, need ECG and stress test', 'ECG ordered, stress test scheduled, prescribe nitroglycerin'),
(2, 2, 2, '2024-01-16', '09:00:00', 'Headaches and dizziness', 'Recurrent headaches for 1 month, associated with dizziness', 'Neurological exam normal, BP: 130/85', 'Tension headaches, rule out migraine', 'Prescribe pain medication, schedule MRI if symptoms persist'),
(3, 3, 3, '2024-01-17', '11:00:00', 'Knee pain after injury', 'Fell 1 week ago, knee pain and swelling', 'Swelling present, limited range of motion, tender to touch', 'Possible ligament injury', 'X-ray ordered, prescribe anti-inflammatory, follow-up in 2 weeks'),
(4, 4, 4, '2024-01-18', '10:30:00', 'Child fever and cough', 'Fever for 3 days, cough getting worse', 'Temp: 38.5C, Chest clear, Throat slightly red', 'Upper respiratory infection', 'Prescribe antibiotics and fever reducer, follow-up if not better in 3 days');

-- DIAGNOSES
INSERT INTO diagnoses (record_id, icd_code, diagnosis_name, diagnosis_type, severity, notes) VALUES
(1, 'I20.9', 'Angina pectoris, unspecified', 'Primary', 'Moderate', 'Requires further investigation'),
(2, 'G44.2', 'Tension-type headache', 'Primary', 'Mild', 'Monitor for migraine symptoms'),
(3, 'S83.5', 'Sprain of cruciate ligament of knee', 'Primary', 'Moderate', 'Requires imaging'),
(4, 'J06.9', 'Acute upper respiratory infection, unspecified', 'Primary', 'Mild', 'Viral infection, supportive care');

-- MEDICATIONS
INSERT INTO medications (medication_name, generic_name, medication_type, strength, unit, manufacturer, price_per_unit, requires_prescription, status) VALUES
('Aspirin', 'Acetylsalicylic acid', 'Tablet', '100', 'mg', 'Pharma Corp', 0.50, FALSE, 'Available'),
('Paracetamol', 'Acetaminophen', 'Tablet', '500', 'mg', 'Med Pharma', 0.75, FALSE, 'Available'),
('Amoxicillin', 'Amoxicillin', 'Capsule', '500', 'mg', 'Antibio Inc', 2.50, TRUE, 'Available'),
('Ibuprofen', 'Ibuprofen', 'Tablet', '400', 'mg', 'Pain Relief Co', 1.00, FALSE, 'Available'),
('Nitroglycerin', 'Nitroglycerin', 'Tablet', '0.5', 'mg', 'Cardio Pharma', 5.00, TRUE, 'Available'),
('Metformin', 'Metformin', 'Tablet', '500', 'mg', 'Diabetes Care', 1.50, TRUE, 'Available'),
('Atorvastatin', 'Atorvastatin', 'Tablet', '20', 'mg', 'Cholesterol Med', 3.00, TRUE, 'Available'),
('Omeprazole', 'Omeprazole', 'Capsule', '20', 'mg', 'Digestive Health', 2.00, TRUE, 'Available');

-- PRESCRIPTIONS
INSERT INTO prescriptions (patient_id, doctor_id, visit_id, prescription_date, status, instructions, refills_allowed, refills_remaining, expiry_date) VALUES
(1, 1, 1, '2024-01-15', 'Active', 'Take as needed for chest pain', 2, 2, '2024-07-15'),
(2, 2, 2, '2024-01-16', 'Active', 'Take with food, avoid driving if drowsy', 1, 1, '2024-04-16'),
(3, 3, 3, '2024-01-17', 'Active', 'Take with meals to reduce stomach upset', 0, 0, '2024-02-17'),
(4, 4, 4, '2024-01-18', 'Active', 'Complete full course even if feeling better', 0, 0, '2024-02-18');

-- PRESCRIPTION ITEMS
INSERT INTO prescription_items (prescription_id, medication_id, dosage, frequency, duration_days, quantity, instructions, status) VALUES
(1, 5, '0.5mg', 'As needed for chest pain, max 3 times per day', 30, 30, 'Place under tongue', 'Dispensed'),
(2, 4, '400mg', 'Twice daily', 7, 14, 'Take with food', 'Dispensed'),
(3, 4, '400mg', 'Three times daily', 10, 30, 'Take with meals', 'Dispensed'),
(4, 3, '500mg', 'Three times daily', 7, 21, 'Take with plenty of water', 'Dispensed');

-- LAB CATEGORIES
INSERT INTO lab_categories (category_name, description) VALUES
('Hematology', 'Blood cell analysis'),
('Biochemistry', 'Blood chemistry tests'),
('Microbiology', 'Bacterial and viral testing'),
('Immunology', 'Immune system testing'),
('Pathology', 'Tissue and cell analysis');

-- LAB TESTS
INSERT INTO lab_tests (test_name, test_code, category_id, description, normal_range_min, normal_range_max, unit, price, turnaround_time_hours, is_active) VALUES
('Complete Blood Count', 'CBC', 1, 'Full blood count analysis', NULL, NULL, NULL, 150.00, 2, TRUE),
('Blood Glucose', 'GLU', 2, 'Blood sugar level', 70.00, 100.00, 'mg/dL', 50.00, 1, TRUE),
('Cholesterol Total', 'CHOL', 2, 'Total cholesterol level', 0.00, 200.00, 'mg/dL', 80.00, 4, TRUE),
('ECG', 'ECG', 1, 'Electrocardiogram', NULL, NULL, NULL, 200.00, 1, TRUE),
('Urine Analysis', 'UA', 3, 'Complete urine analysis', NULL, NULL, NULL, 100.00, 2, TRUE);

-- LAB TEST ORDERS
INSERT INTO lab_test_orders (patient_id, doctor_id, visit_id, order_date, order_time, priority, status, ordered_by) VALUES
(1, 1, 1, '2024-01-15', '10:30:00', 'Urgent', 'Completed', 7),
(1, 1, 1, '2024-01-15', '10:30:00', 'Routine', 'Completed', 7),
(2, 2, 2, '2024-01-16', '09:30:00', 'Routine', 'Completed', 7),
(3, 3, 3, '2024-01-17', '11:30:00', 'Routine', 'Completed', 7);

-- LAB TEST ORDER ITEMS
INSERT INTO lab_test_order_items (order_id, test_id, status) VALUES
(1, 4, 'Completed'),
(2, 3, 'Completed'),
(3, 1, 'Completed'),
(4, 1, 'Completed');

-- LAB RESULTS
INSERT INTO lab_results (order_item_id, test_id, result_value, unit, reference_range, status, performed_by, verified_by, result_date, result_time, notes) VALUES
(1, 4, 'Normal sinus rhythm', NULL, 'Normal', 'Normal', 7, 7, '2024-01-15', '11:00:00', 'No abnormalities detected'),
(2, 3, '220', 'mg/dL', '0-200', 'Abnormal', 7, 7, '2024-01-15', '14:30:00', 'Elevated cholesterol, recommend diet and exercise'),
(3, 1, 'Normal', NULL, 'Normal ranges', 'Normal', 7, 7, '2024-01-16', '11:30:00', 'All values within normal limits'),
(4, 1, 'Slightly elevated WBC', NULL, 'Normal ranges', 'Abnormal', 7, 7, '2024-01-17', '12:00:00', 'Mild elevation, likely due to inflammation');

-- RADIOLOGY ORDERS
INSERT INTO radiology_orders (patient_id, doctor_id, visit_id, study_type, body_part, order_date, order_time, priority, clinical_indication, status) VALUES
(3, 3, 3, 'X-Ray', 'Right Knee', '2024-01-17', '11:30:00', 'Routine', 'Rule out fracture after injury', 'Completed'),
(2, 2, 2, 'MRI', 'Brain', '2024-01-16', '09:30:00', 'Urgent', 'Rule out structural abnormalities', 'Scheduled');

-- RADIOLOGY RESULTS
INSERT INTO radiology_results (radiology_order_id, study_date, study_time, findings, impression, recommendations, radiologist_id, report_date) VALUES
(1, '2024-01-17', '14:00:00', 'No fracture seen. Mild soft tissue swelling noted.', 'No acute fracture. Soft tissue injury likely.', 'Continue conservative treatment, follow-up if symptoms worsen', 5, '2024-01-17');

-- PAYMENT METHODS
INSERT INTO payment_methods (method_name, description, is_active) VALUES
('Cash', 'Cash payment', TRUE),
('Credit Card', 'Credit card payment', TRUE),
('Debit Card', 'Debit card payment', TRUE),
('Bank Transfer', 'Bank wire transfer', TRUE),
('Insurance', 'Insurance coverage', TRUE),
('Mobile Payment', 'Mobile payment apps', TRUE);

-- BILLING CODES
INSERT INTO billing_codes (code, description, category, price, is_active) VALUES
('99213', 'Office visit, established patient', 'Consultation', 300.00, TRUE),
('99214', 'Office visit, detailed examination', 'Consultation', 400.00, TRUE),
('93000', 'ECG, complete', 'Diagnostic', 200.00, TRUE),
('85025', 'Complete blood count', 'Lab Test', 150.00, TRUE),
('71020', 'Chest X-ray', 'Radiology', 250.00, TRUE);

-- SERVICE CHARGES
INSERT INTO service_charges (service_name, service_type, base_price, department_id, is_active) VALUES
('Cardiology Consultation', 'Consultation', 500.00, 1, TRUE),
('Neurology Consultation', 'Consultation', 450.00, 2, TRUE),
('Orthopedic Consultation', 'Consultation', 600.00, 3, TRUE),
('Pediatric Consultation', 'Consultation', 400.00, 4, TRUE),
('Emergency Visit', 'Emergency', 500.00, 5, TRUE);

-- INVOICES
INSERT INTO invoices (invoice_number, patient_id, visit_id, invoice_date, due_date, subtotal, discount_amount, tax_amount, total_amount, status, created_by) VALUES
('INV-2024-001', 1, 1, '2024-01-15', '2024-01-22', 700.00, 0.00, 105.00, 805.00, 'Paid', 10),
('INV-2024-002', 2, 2, '2024-01-16', '2024-01-23', 600.00, 0.00, 90.00, 690.00, 'Paid', 10),
('INV-2024-003', 3, 3, '2024-01-17', '2024-01-24', 950.00, 50.00, 135.00, 1035.00, 'Paid', 10),
('INV-2024-004', 4, 4, '2024-01-18', '2024-01-25', 550.00, 0.00, 82.50, 632.50, 'Pending', 10);

-- INVOICE ITEMS
INSERT INTO invoice_items (invoice_id, service_type, service_id, description, quantity, unit_price, total_price, billing_code_id) VALUES
(1, 'Consultation', 1, 'Cardiology Consultation', 1, 500.00, 500.00, 2),
(1, 'Procedure', 1, 'ECG', 1, 200.00, 200.00, 3),
(2, 'Consultation', 2, 'Neurology Consultation', 1, 450.00, 450.00, 2),
(2, 'Lab Test', 3, 'Complete Blood Count', 1, 150.00, 150.00, 4),
(3, 'Consultation', 3, 'Orthopedic Consultation', 1, 600.00, 600.00, 2),
(3, 'Radiology', 1, 'Knee X-Ray', 1, 250.00, 250.00, 5),
(4, 'Consultation', 4, 'Pediatric Consultation', 1, 400.00, 400.00, 2),
(4, 'Medication', 4, 'Amoxicillin', 1, 52.50, 52.50, NULL);

-- PAYMENTS
INSERT INTO payments (invoice_id, payment_date, payment_time, amount, payment_method_id, transaction_reference, received_by, status) VALUES
(1, '2024-01-15', '15:30:00', 805.00, 2, 'CC-2024-001', 10, 'Completed'),
(2, '2024-01-16', '16:00:00', 690.00, 2, 'CC-2024-002', 10, 'Completed'),
(3, '2024-01-17', '17:00:00', 1035.00, 1, 'CASH-2024-003', 10, 'Completed');

-- INSURANCE CLAIM STATUS
INSERT INTO insurance_claim_status (status_name, description) VALUES
('Submitted', 'Claim has been submitted'),
('Under Review', 'Claim is being reviewed'),
('Approved', 'Claim has been approved'),
('Partially Approved', 'Claim partially approved'),
('Rejected', 'Claim has been rejected'),
('Paid', 'Claim has been paid');

-- INSURANCE CLAIMS
INSERT INTO insurance_claims (invoice_id, patient_insurance_id, claim_number, claim_date, claim_amount, approved_amount, status_id, submitted_date, processed_date) VALUES
(1, 1, 'CLM-2024-001', '2024-01-15', 644.00, 644.00, 6, '2024-01-15', '2024-01-20'),
(2, 2, 'CLM-2024-002', '2024-01-16', 517.50, 517.50, 6, '2024-01-16', '2024-01-21'),
(3, 3, 'CLM-2024-003', '2024-01-17', 879.75, 879.75, 6, '2024-01-17', '2024-01-22');

-- ROOMS
INSERT INTO rooms (room_number, department_id, room_type, capacity, floor_number, status) VALUES
('101', 1, 'Private', 1, 1, 'Available'),
('102', 1, 'Private', 1, 1, 'Occupied'),
('201', 2, 'Ward', 4, 2, 'Available'),
('301', 3, 'Private', 1, 3, 'Available'),
('401', 4, 'Ward', 6, 4, 'Available'),
('ER-01', 5, 'Emergency', 1, 0, 'Available'),
('ICU-01', 1, 'ICU', 1, 2, 'Occupied'),
('OT-01', 3, 'Operation Theater', 1, 3, 'Available');

-- BEDS
INSERT INTO beds (room_id, bed_number, bed_type, status) VALUES
(1, 'A', 'Regular', 'Available'),
(2, 'A', 'Regular', 'Occupied'),
(3, 'A', 'Regular', 'Available'),
(3, 'B', 'Regular', 'Available'),
(3, 'C', 'Regular', 'Available'),
(3, 'D', 'Regular', 'Available'),
(5, 'A', 'Regular', 'Available'),
(5, 'B', 'Regular', 'Available'),
(7, 'A', 'ICU', 'Occupied'),
(6, 'A', 'Emergency', 'Available');

-- ADMISSIONS
INSERT INTO admissions (patient_id, admission_date, admission_time, admission_type, department_id, admitting_doctor_id, diagnosis_on_admission, expected_discharge_date, status) VALUES
(1, '2024-01-20', '08:00:00', 'Emergency', 1, 1, 'Acute myocardial infarction', '2024-01-25', 'Admitted'),
(5, '2024-01-21', '10:00:00', 'Elective', 3, 3, 'Knee replacement surgery', '2024-01-24', 'Admitted');

-- BED ASSIGNMENTS
INSERT INTO bed_assignments (bed_id, patient_id, admission_id, assigned_date, assigned_time, status) VALUES
(7, 1, 1, '2024-01-20', '08:30:00', 'Active'),
(2, 5, 2, '2024-01-21', '10:30:00', 'Active');

-- TIME SLOTS
INSERT INTO time_slots (slot_time, duration_minutes, is_active) VALUES
('08:00:00', 30, TRUE),
('08:30:00', 30, TRUE),
('09:00:00', 30, TRUE),
('09:30:00', 30, TRUE),
('10:00:00', 30, TRUE),
('10:30:00', 30, TRUE),
('11:00:00', 30, TRUE),
('11:30:00', 30, TRUE),
('12:00:00', 30, TRUE),
('14:00:00', 30, TRUE),
('14:30:00', 30, TRUE),
('15:00:00', 30, TRUE),
('15:30:00', 30, TRUE),
('16:00:00', 30, TRUE);

End of Seed Data

