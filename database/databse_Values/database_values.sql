-- Seed Data
USE HMS_Database;

-- STAFF ROLES
INSERT INTO staff_roles (role_name, description) VALUES
('Admin', 'System Administrator'),
('Doctor', 'Medical Doctor'),
('Nurse', 'Registered Nurse'),
('Lab Technician', 'Laboratory Technician'),
('Pharmacist', 'Pharmacy Staff'),
('Receptionist', 'Front Desk Staff'),
('Radiologist', 'Radiology Specialist'),
('Accountant', 'Billing and Finance Staff'),
('Database Administrator', 'Database Administrator with SQL query access');

-- DEPARTMENTS
INSERT INTO departments (department_name, department_code, location, phone, email, description) VALUES
('Cardiology', 'CARD', 'Building A, Floor 2', '02-234-5678', 'cardiology@hospital.com', 'Heart and cardiovascular care'),
('Neurology', 'NEURO', 'Building A, Floor 3', '02-234-5679', 'neurology@hospital.com', 'Brain and nervous system care'),
('Orthopedics', 'ORTHO', 'Building B, Floor 1', '02-234-5680', 'orthopedics@hospital.com', 'Bone and joint care'),
('Pediatrics', 'PED', 'Building B, Floor 2', '02-234-5681', 'pediatrics@hospital.com', 'Children healthcare'),
('Emergency', 'ER', 'Building C, Ground Floor', '02-234-5682', 'emergency@hospital.com', 'Emergency care'),
('General Medicine', 'GEN', 'Building A, Floor 1', '02-234-5683', 'general@hospital.com', 'General medical care'),
('Radiology', 'RAD', 'Building D, Floor 1', '02-234-5684', 'radiology@hospital.com', 'Imaging services'),
('Laboratory', 'LAB', 'Building D, Floor 2', '02-234-5685', 'lab@hospital.com', 'Laboratory services'),
('Pharmacy', 'PHARM', 'Building C, Floor 1', '02-234-5686', 'pharmacy@hospital.com', 'Pharmacy services');

-- STAFF
INSERT INTO staff (employee_id, first_name, last_name, date_of_birth, gender, phone, email, address, city, country, hire_date, department_id, role_id, salary, status) VALUES
('EMP001', 'Peter', 'Ibrahim', '1980-05-15', 'M', '01001234567', 'peter.ibrahim@hospital.com', '123 Tahrir Square', 'Cairo', 'Egypt', '2020-01-15', 
    (SELECT department_id FROM departments WHERE department_code = 'CARD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 25000.00, 'Active'),
('EMP002', 'Sotir', 'Hassan', '1985-08-20', 'M', '01001234568', 'sotir.hassan@hospital.com', '456 Zamalek Street', 'Cairo', 'Egypt', '2020-02-01', 
    (SELECT department_id FROM departments WHERE department_code = 'NEURO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 24000.00, 'Active'),
('EMP003', 'Ahmed', 'Mohamed', '1990-03-10', 'M', '01001234569', 'ahmed.mohamed@hospital.com', '789 Maadi Corniche', 'Cairo', 'Egypt', '2021-03-01', 
    (SELECT department_id FROM departments WHERE department_code = 'ORTHO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 23000.00, 'Active'),
('EMP004', 'Fatima', 'Ali', '1988-11-25', 'F', '01001234570', 'fatima.ali@hospital.com', '321 Heliopolis Avenue', 'Cairo', 'Egypt', '2020-06-01', 
    (SELECT department_id FROM departments WHERE department_code = 'PED' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 22000.00, 'Active'),
('EMP005', 'Khaled', 'Mahmoud', '1982-07-12', 'M', '01001234571', 'khaled.mahmoud@hospital.com', '654 Nasr City', 'Cairo', 'Egypt', '2019-09-01', 
    (SELECT department_id FROM departments WHERE department_code = 'RAD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Radiologist' LIMIT 1), 26000.00, 'Active'),
('EMP006', 'Nour', 'Hassan', '1992-04-18', 'F', '01001234572', 'nour.hassan@hospital.com', '987 Dokki Street', 'Giza', 'Egypt', '2021-01-15', 
    (SELECT department_id FROM departments WHERE department_code = 'ORTHO' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Nurse' LIMIT 1), 12000.00, 'Active'),
('EMP007', 'Omar', 'Sayed', '1987-09-30', 'M', '01001234573', 'omar.sayed@hospital.com', '147 Mohandessin', 'Giza', 'Egypt', '2020-08-01', 
    (SELECT department_id FROM departments WHERE department_code = 'LAB' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Lab Technician' LIMIT 1), 15000.00, 'Active'),
('EMP008', 'Layla', 'Ibrahim', '1991-12-05', 'F', '01001234574', 'layla.ibrahim@hospital.com', '258 6th October City', 'Giza', 'Egypt', '2021-02-01', 
    (SELECT department_id FROM departments WHERE department_code = 'PHARM' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Pharmacist' LIMIT 1), 14000.00, 'Active'),
('EMP009', 'Youssef', 'Mostafa', '1989-06-22', 'M', '01001234575', 'youssef.mostafa@hospital.com', '369 New Cairo', 'Cairo', 'Egypt', '2020-04-01', 
    (SELECT department_id FROM departments WHERE department_code = 'ER' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Receptionist' LIMIT 1), 10000.00, 'Active'),
('EMP010', 'Hala', 'Ahmed', '1993-01-14', 'F', '01001234576', 'hala.ahmed@hospital.com', '741 Alexandria Road', 'Alexandria', 'Egypt', '2021-05-01', 
    (SELECT department_id FROM departments WHERE department_code = 'CARD' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Admin' LIMIT 1), 18000.00, 'Active'),
('EMP011', 'Abdallah', 'Mohamed', '1983-06-10', 'M', '01001234577', 'abdallah.mohamed@hospital.com', '852 New Cairo District', 'Cairo', 'Egypt', '2019-03-15', 
    (SELECT department_id FROM departments WHERE department_code = 'GEN' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Doctor' LIMIT 1), 23500.00, 'Active'),
('EMP012', 'Mohamed', 'Database', '1985-09-20', 'M', '01001234578', 'db.admin@hospital.com', '999 IT Department', 'Cairo', 'Egypt', '2020-01-10', 
    (SELECT department_id FROM departments WHERE department_code = 'LAB' LIMIT 1), 
    (SELECT role_id FROM staff_roles WHERE role_name = 'Database Administrator' LIMIT 1), 20000.00, 'Active');

-- Update departments with head of department
UPDATE departments SET head_of_department = 1 WHERE department_id = 1;
UPDATE departments SET head_of_department = 2 WHERE department_id = 2;
UPDATE departments SET head_of_department = 3 WHERE department_id = 3;
UPDATE departments SET head_of_department = 4 WHERE department_id = 4;

-- DOCTOR SPECIALTIES
INSERT INTO doctor_specialties (specialty_name, description, department_id) VALUES
('Cardiologist', 'Heart and cardiovascular specialist', 1),
('Neurologist', 'Brain and nervous system specialist', 2),
('Orthopedic Surgeon', 'Bone and joint surgery specialist', 3),
('Pediatrician', 'Children healthcare specialist', 4),
('Emergency Medicine', 'Emergency care specialist', 5),
('General Practitioner', 'General medical care', 6),
('Radiologist', 'Medical imaging specialist', 7);

-- DOCTORS
INSERT INTO doctors (staff_id, license_number, specialization_id, years_of_experience, consultation_fee, bio, status) VALUES
(1, 'DOC-LIC-001', 1, 15, 500.00, 'Dr. Peter Ibrahim - Experienced cardiologist with expertise in heart diseases and cardiovascular care', 'Active'),
(2, 'DOC-LIC-002', 2, 12, 450.00, 'Dr. Sotir Hassan - Neurologist specializing in brain disorders and neurological conditions', 'Active'),
(3, 'DOC-LIC-003', 3, 10, 600.00, 'Orthopedic surgeon with focus on joint replacement and bone surgery', 'Active'),
(4, 'DOC-LIC-004', 4, 8, 400.00, 'Pediatrician with expertise in child healthcare and development', 'Active'),
(5, 'DOC-LIC-005', 7, 13, 550.00, 'Radiologist specializing in medical imaging and diagnostic radiology', 'Active'),
(11, 'DOC-LIC-006', 6, 14, 350.00, 'Dr. Abdallah Mohamed - General Practitioner with extensive experience in primary care and family medicine', 'Active');

-- DOCTOR QUALIFICATIONS
INSERT INTO doctor_qualifications (doctor_id, degree_type, institution_name, graduation_year, specialization, certificate_number) VALUES
((SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'MD', 'Cairo University', 2005, 'Cardiology', 'CERT-001'),
((SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'MBBS', 'Cairo University', 2000, 'General Medicine', 'CERT-002'),
((SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 'MD', 'Ain Shams University', 2008, 'Neurology', 'CERT-003'),
((SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 'MBBS', 'Ain Shams University', 2003, 'General Medicine', 'CERT-004'),
((SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 'MD', 'Alexandria University', 2010, 'Orthopedic Surgery', 'CERT-005'),
((SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), 'MD', 'Mansoura University', 2012, 'Pediatrics', 'CERT-006'),
((SELECT doctor_id FROM doctors WHERE staff_id = 5 LIMIT 1), 'MD', 'Cairo University', 2007, 'Radiology', 'CERT-007'),
((SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'MD', 'Ain Shams University', 2006, 'General Medicine', 'CERT-008'),
((SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'MBBS', 'Ain Shams University', 2001, 'General Medicine', 'CERT-009');

-- DOCTOR SCHEDULES
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, is_available, location, max_appointments) VALUES
((SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Monday', '09:00:00', '17:00:00', TRUE, 'Cardiology Clinic A', 20),
((SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Wednesday', '09:00:00', '17:00:00', TRUE, 'Cardiology Clinic A', 20),
((SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Friday', '09:00:00', '13:00:00', TRUE, 'Cardiology Clinic A', 10),
((SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 'Tuesday', '08:00:00', '16:00:00', TRUE, 'Neurology Clinic B', 18),
((SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 'Thursday', '08:00:00', '16:00:00', TRUE, 'Neurology Clinic B', 18),
((SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 'Monday', '10:00:00', '18:00:00', TRUE, 'Orthopedics Clinic C', 15),
((SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 'Wednesday', '10:00:00', '18:00:00', TRUE, 'Orthopedics Clinic C', 15),
((SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), 'Sunday', '09:00:00', '15:00:00', TRUE, 'Pediatrics Clinic D', 25),
((SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), 'Tuesday', '09:00:00', '15:00:00', TRUE, 'Pediatrics Clinic D', 25),
((SELECT doctor_id FROM doctors WHERE staff_id = 5 LIMIT 1), 'Monday', '08:00:00', '16:00:00', TRUE, 'Radiology Department', 30),
((SELECT doctor_id FROM doctors WHERE staff_id = 5 LIMIT 1), 'Wednesday', '08:00:00', '16:00:00', TRUE, 'Radiology Department', 30),
((SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'Sunday', '09:00:00', '17:00:00', TRUE, 'General Medicine Clinic E', 25),
((SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'Tuesday', '09:00:00', '17:00:00', TRUE, 'General Medicine Clinic E', 25),
((SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'Thursday', '09:00:00', '17:00:00', TRUE, 'General Medicine Clinic E', 25);

-- INSURANCE PROVIDERS
INSERT INTO insurance_providers (provider_name, provider_code, contact_person, phone, email, address, status) VALUES
('Allianz Egypt', 'ALLIANZ', 'Ahmed Ali', '02-800-1234', 'contact@allianz-egypt.com', 'Cairo, Egypt', 'Active'),
('AXA Egypt', 'AXA-EGY', 'Fatima Hassan', '02-800-5678', 'contact@axa-egypt.com', 'Cairo, Egypt', 'Active'),
('MetLife Egypt', 'METLIFE', 'Mohammed Saleh', '02-800-9012', 'contact@metlife-egypt.com', 'Cairo, Egypt', 'Active'),
('Misr Insurance', 'MISR', 'Sara Ahmed', '02-800-3456', 'contact@misr-insurance.com', 'Cairo, Egypt', 'Active');

-- PATIENTS
INSERT INTO patients (national_id, first_name, last_name, middle_name, date_of_birth, gender, blood_type, phone, email, address, city, country, postal_code, marital_status, occupation, status) VALUES
('29012345678901', 'Mahmoud', 'Ali', 'Mostafa', '1985-03-15', 'M', 'O+', '01012345678', 'mahmoud.mostafa.ali@email.com', '100 Tahrir Square, Downtown', 'Cairo', 'Egypt', '11511', 'Married', 'Software Engineer', 'Active'),
('29012345678902', 'Nour', 'Ahmed', 'Hassan', '1990-07-22', 'F', 'A+', '01012345679', 'nour.ahmed@email.com', '200 Zamalek Street', 'Cairo', 'Egypt', '11211', 'Single', 'High School Teacher', 'Active'),
('29012345678903', 'Khaled', 'Mohamed', 'Ibrahim', '1978-11-08', 'M', 'B+', '01012345680', 'khaled.mohamed@email.com', '300 Maadi Corniche', 'Cairo', 'Egypt', '11431', 'Married', 'Business Owner', 'Active'),
('29012345678904', 'Mona', 'Sayed', 'Mahmoud', '1995-02-14', 'F', 'AB+', '01012345681', 'mona.sayed@email.com', '400 Heliopolis Avenue', 'Cairo', 'Egypt', '11341', 'Single', 'Medical Student', 'Active'),
('29012345678905', 'Fady', 'Ibrahim', 'Hassan', '1982-09-30', 'M', 'A-', '01012345682', 'fady.ibrahim@email.com', '500 Nasr City', 'Cairo', 'Egypt', '11765', 'Married', 'Cardiologist', 'Active'),
('29012345678906', 'Lina', 'Mahmoud', 'Ahmed', '1988-05-18', 'F', 'O-', '01012345683', 'lina.mahmoud@email.com', '600 Dokki Street', 'Giza', 'Egypt', '12311', 'Married', 'Registered Nurse', 'Active'),
('29012345678907', 'Samy', 'Hassan', 'Mohamed', '1992-12-25', 'M', 'B-', '01012345684', 'samy.hassan@email.com', '700 Mohandessin', 'Giza', 'Egypt', '12411', 'Single', 'Certified Public Accountant', 'Active'),
('29012345678908', 'Reem', 'Ibrahim', 'Sayed', '1987-08-10', 'F', 'A+', '01012345685', 'reem.ibrahim@email.com', '800 6th October City', 'Giza', 'Egypt', '12573', 'Married', 'Graphic Designer', 'Active'),
('29012345678909', 'Youssef', 'Mostafa', 'Ali', '1975-04-05', 'M', 'O+', '01012345686', 'youssef.mostafa@email.com', '900 New Cairo', 'Cairo', 'Egypt', '11835', 'Married', 'Operations Manager', 'Active'),
('29012345678910', 'Hanan', 'Ahmed', 'Mahmoud', '1993-01-20', 'F', 'AB-', '01012345687', 'hanan.ahmed@email.com', '1000 Alexandria Corniche', 'Alexandria', 'Egypt', '21511', 'Single', 'Corporate Lawyer', 'Active'),
('29012345678911', 'Sarah', 'Mohamed', 'Hassan', '1991-06-12', 'F', 'B+', '01012345688', 'sarah.mohamed@email.com', '1100 Mansoura Street', 'Mansoura', 'Egypt', '35511', 'Married', 'Marketing Manager', 'Active'),
('29012345678912', 'Amr', 'Sayed', 'Ibrahim', '1989-03-25', 'M', 'A+', '01012345689', 'amr.sayed@email.com', '1200 Tanta City', 'Tanta', 'Egypt', '31511', 'Single', 'Engineer', 'Active');

-- PATIENT INSURANCE
INSERT INTO patient_insurance (patient_id, insurance_provider_id, policy_number, coverage_start_date, coverage_end_date, coverage_percentage, max_coverage_amount, deductible_amount, status) VALUES
(1, 1, 'POL-001-2024', '2024-01-01', '2024-12-31', 80.00, 50000.00, 500.00, 'Active'),
(2, 2, 'POL-002-2024', '2024-01-01', '2024-12-31', 75.00, 40000.00, 1000.00, 'Active'),
(3, 1, 'POL-003-2024', '2024-01-01', '2024-12-31', 85.00, 60000.00, 300.00, 'Active'),
(4, 3, 'POL-004-2024', '2024-01-01', '2024-12-31', 70.00, 30000.00, 1500.00, 'Active'),
(5, 4, 'POL-005-2024', '2024-01-01', '2024-12-31', 90.00, 80000.00, 200.00, 'Active'),
(6, 1, 'POL-006-2024', '2024-01-01', '2024-12-31', 80.00, 50000.00, 500.00, 'Active'),
(7, 2, 'POL-007-2024', '2024-01-01', '2024-12-31', 75.00, 40000.00, 1000.00, 'Active'),
(8, 3, 'POL-008-2024', '2024-01-01', '2024-12-31', 70.00, 30000.00, 1500.00, 'Active'),
(9, 4, 'POL-009-2024', '2024-01-01', '2024-12-31', 90.00, 80000.00, 200.00, 'Active'),
(10, 1, 'POL-010-2024', '2024-01-01', '2024-12-31', 80.00, 50000.00, 500.00, 'Active'),
(11, 2, 'POL-011-2024', '2024-01-01', '2024-12-31', 75.00, 40000.00, 1000.00, 'Active'),
(12, 3, 'POL-012-2024', '2024-01-01', '2024-12-31', 70.00, 30000.00, 1500.00, 'Active');

-- PATIENT ALLERGIES
INSERT INTO patient_allergies (patient_id, allergen_name, allergy_type, severity, reaction_description, diagnosed_date) VALUES
(1, 'Penicillin', 'Medication', 'Severe', 'Rash and difficulty breathing', '2020-05-10'),
(2, 'Peanuts', 'Food', 'Life-threatening', 'Anaphylaxis', '2018-03-15'),
(3, 'Latex', 'Environmental', 'Moderate', 'Skin irritation', '2019-07-20'),
(4, 'Aspirin', 'Medication', 'Mild', 'Mild rash', '2021-01-05'),
(6, 'Shellfish', 'Food', 'Severe', 'Swelling and hives', '2017-09-12'),
(8, 'Dust', 'Environmental', 'Moderate', 'Sneezing and watery eyes', '2019-11-20');

-- PATIENT EMERGENCY CONTACTS
INSERT INTO patient_emergency_contacts (patient_id, contact_name, relationship, phone_primary, phone_secondary, email, address, is_primary_contact, can_make_decisions) VALUES
(1, 'Fatima Mostafa Ali', 'Spouse', '01022345678', NULL, 'fatima.ali@email.com', '100 Tahrir Square', TRUE, TRUE),
(2, 'Ahmed Hassan', 'Parent', '01022345679', '01022345680', 'ahmed.hassan@email.com', '200 Zamalek Street', TRUE, TRUE),
(3, 'Nour Ibrahim', 'Spouse', '01022345681', NULL, 'nour.ibrahim@email.com', '300 Maadi Corniche', TRUE, TRUE),
(4, 'Khaled Sayed', 'Parent', '01022345682', NULL, 'khaled.sayed@email.com', '400 Heliopolis Avenue', TRUE, TRUE),
(5, 'Mona Hassan', 'Spouse', '01022345683', NULL, 'mona.hassan@email.com', '500 Nasr City', TRUE, TRUE),
(6, 'Samy Mahmoud', 'Spouse', '01022345684', NULL, 'samy.mahmoud@email.com', '600 Dokki Street', TRUE, TRUE);

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
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-01-15', '10:00:00', 1, 4, 'Chest pain and shortness of breath', 9),
(2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), '2024-01-16', '09:00:00', 1, 4, 'Headaches and dizziness', 9),
(3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), '2024-01-17', '11:00:00', 1, 4, 'Knee pain after injury', 9),
(4, (SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), '2024-01-18', '10:30:00', 1, 4, 'Child fever and cough', 9),
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-02-01', '14:00:00', 2, 1, 'Follow-up for heart condition', 9),
(5, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-02-05', '09:00:00', 1, 1, 'Heart checkup', 9),
(6, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), '2024-02-06', '10:00:00', 1, 1, 'Neurological examination', 9),
(7, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), '2024-02-07', '11:00:00', 1, 1, 'Back pain consultation', 9),
(8, (SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), '2024-02-08', '09:30:00', 1, 1, 'Child vaccination', 9),
(9, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-02-10', '15:00:00', 1, 1, 'Cardiac screening', 9),
(12, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-02-12', '11:00:00', 1, 1, 'Routine heart checkup', 9),
(11, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), '2024-02-13', '10:00:00', 1, 1, 'Headache evaluation', 9),
-- Dr. Abdallah appointments
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-15', '10:00:00', 1, 1, 'General health checkup', 9),
(2, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-16', '11:00:00', 1, 1, 'Routine physical examination', 9),
(3, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-18', '09:00:00', 1, 1, 'Annual checkup', 9),
(5, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-20', '14:00:00', 1, 1, 'Follow-up consultation', 9),
(7, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-22', '10:30:00', 1, 1, 'General consultation', 9),
(8, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-23', '11:00:00', 1, 1, 'Health screening', 9),
(10, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-25', '09:00:00', 1, 1, 'Routine checkup', 9),
(12, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-02-27', '15:00:00', 1, 1, 'General medical consultation', 9),
-- Completed appointments for Dr. Abdallah
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-20', '10:00:00', 1, 4, 'General health checkup - Completed', 9),
(4, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-25', '11:00:00', 1, 4, 'Routine physical examination - Completed', 9),
(6, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-28', '09:30:00', 1, 4, 'Annual checkup - Completed', 9);

-- PATIENT VISITS
INSERT INTO patient_visits (patient_id, visit_date, visit_time, visit_type, department_id, doctor_id, chief_complaint, visit_status) VALUES
(1, '2024-01-15', '10:00:00', 'Consultation', 1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Chest pain and shortness of breath', 'Completed'),
(2, '2024-01-16', '09:00:00', 'Consultation', 2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 'Headaches and dizziness', 'Completed'),
(3, '2024-01-17', '11:00:00', 'Consultation', 3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 'Knee pain after injury', 'Completed'),
(4, '2024-01-18', '10:30:00', 'Consultation', 4, (SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), 'Child fever and cough', 'Completed'),
(5, '2024-01-20', '14:00:00', 'Emergency', 5, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Severe chest pain', 'Completed'),
(12, '2024-01-22', '09:00:00', 'Consultation', 1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Heart palpitations', 'Completed'),
-- Patient visits for Dr. Abdallah
(1, '2024-01-20', '10:00:00', 'Consultation', 6, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'General health checkup', 'Completed'),
(4, '2024-01-25', '11:00:00', 'Consultation', 6, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'Routine physical examination', 'Completed'),
(6, '2024-01-28', '09:30:00', 'Consultation', 6, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), 'Annual checkup', 'Completed');

-- MEDICAL RECORDS
INSERT INTO medical_records (patient_id, visit_id, doctor_id, record_date, record_time, chief_complaint, history_of_present_illness, physical_examination, assessment, plan) VALUES
(1, 1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-01-15', '10:00:00', 'Chest pain and shortness of breath', 'Patient reports chest pain for 2 days, worsens with activity', 'BP: 140/90, HR: 95, Regular rhythm, No murmurs', 'Possible angina, need ECG and stress test', 'ECG ordered, stress test scheduled, prescribe nitroglycerin'),
(2, 2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), '2024-01-16', '09:00:00', 'Headaches and dizziness', 'Recurrent headaches for 1 month, associated with dizziness', 'Neurological exam normal, BP: 130/85', 'Tension headaches, rule out migraine', 'Prescribe pain medication, schedule MRI if symptoms persist'),
(3, 3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), '2024-01-17', '11:00:00', 'Knee pain after injury', 'Fell 1 week ago, knee pain and swelling', 'Swelling present, limited range of motion, tender to touch', 'Possible ligament injury', 'X-ray ordered, prescribe anti-inflammatory, follow-up in 2 weeks'),
(4, 4, (SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), '2024-01-18', '10:30:00', 'Child fever and cough', 'Fever for 3 days, cough getting worse', 'Temp: 38.5C, Chest clear, Throat slightly red', 'Upper respiratory infection', 'Prescribe antibiotics and fever reducer, follow-up if not better in 3 days'),
(12, 6, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), '2024-01-22', '09:00:00', 'Heart palpitations', 'Patient reports irregular heartbeat for 1 week', 'BP: 135/88, HR: 88, Irregular rhythm noted', 'Possible arrhythmia, requires further investigation', 'ECG and Holter monitor ordered, follow-up in 1 week'),
-- Medical records for Dr. Abdallah's patients
(1, 7, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-20', '10:00:00', 'General health checkup', 'Patient reports feeling well, no specific complaints', 'BP: 120/80, HR: 72, Regular rhythm, Lungs clear, Abdomen soft', 'Healthy adult, no acute issues', 'Routine blood work ordered, follow-up in 6 months'),
(4, 8, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-25', '11:00:00', 'Routine physical examination', 'Annual checkup, patient feels healthy', 'BP: 118/75, HR: 68, All systems normal', 'Normal physical examination', 'Routine screening tests ordered, continue healthy lifestyle'),
(6, 9, (SELECT doctor_id FROM doctors WHERE staff_id = 11 LIMIT 1), '2024-01-28', '09:30:00', 'Annual checkup', 'Patient reports occasional fatigue', 'BP: 125/82, HR: 75, Slight anemia suspected', 'Possible iron deficiency anemia', 'Complete blood count ordered, iron supplements prescribed if needed');

-- DIAGNOSES
INSERT INTO diagnoses (record_id, icd_code, diagnosis_name, diagnosis_type, severity, notes) VALUES
(1, 'I20.9', 'Angina pectoris, unspecified', 'Primary', 'Moderate', 'Requires further investigation'),
(2, 'G44.2', 'Tension-type headache', 'Primary', 'Mild', 'Monitor for migraine symptoms'),
(3, 'S83.5', 'Sprain of cruciate ligament of knee', 'Primary', 'Moderate', 'Requires imaging'),
(4, 'J06.9', 'Acute upper respiratory infection, unspecified', 'Primary', 'Mild', 'Viral infection, supportive care'),
(5, 'I49.9', 'Cardiac arrhythmia, unspecified', 'Primary', 'Mild', 'Requires monitoring');

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
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 1, '2024-01-15', 'Active', 'Take as needed for chest pain', 2, 2, '2024-07-15'),
(2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 2, '2024-01-16', 'Active', 'Take with food, avoid driving if drowsy', 1, 1, '2024-04-16'),
(3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 3, '2024-01-17', 'Active', 'Take with meals to reduce stomach upset', 0, 0, '2024-02-17'),
(4, (SELECT doctor_id FROM doctors WHERE staff_id = 4 LIMIT 1), 4, '2024-01-18', 'Active', 'Complete full course even if feeling better', 0, 0, '2024-02-18'),
(12, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 6, '2024-01-22', 'Active', 'Take once daily with breakfast', 1, 1, '2024-04-22');

-- PRESCRIPTION ITEMS
INSERT INTO prescription_items (prescription_id, medication_id, dosage, frequency, duration_days, quantity, instructions, status) VALUES
(1, 5, '0.5mg', 'As needed for chest pain, max 3 times per day', 30, 30, 'Place under tongue', 'Dispensed'),
(2, 4, '400mg', 'Twice daily', 7, 14, 'Take with food', 'Dispensed'),
(3, 4, '400mg', 'Three times daily', 10, 30, 'Take with meals', 'Dispensed'),
(4, 3, '500mg', 'Three times daily', 7, 21, 'Take with plenty of water', 'Dispensed'),
(5, 7, '20mg', 'Once daily', 30, 30, 'Take with breakfast', 'Dispensed');

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
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 1, '2024-01-15', '10:30:00', 'Urgent', 'Completed', 7),
(1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 1, '2024-01-15', '10:30:00', 'Routine', 'Completed', 7),
(2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 2, '2024-01-16', '09:30:00', 'Routine', 'Completed', 7),
(3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 3, '2024-01-17', '11:30:00', 'Routine', 'Completed', 7),
(12, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 6, '2024-01-22', '09:30:00', 'Routine', 'Completed', 7);

-- LAB TEST ORDER ITEMS
INSERT INTO lab_test_order_items (order_id, test_id, status) VALUES
(1, 4, 'Completed'),
(2, 3, 'Completed'),
(3, 1, 'Completed'),
(4, 1, 'Completed'),
(5, 4, 'Completed');

-- LAB RESULTS
INSERT INTO lab_results (order_item_id, test_id, result_value, unit, reference_range, status, performed_by, verified_by, result_date, result_time, notes) VALUES
(1, 4, 'Normal sinus rhythm', NULL, 'Normal', 'Normal', 7, 7, '2024-01-15', '11:00:00', 'No abnormalities detected'),
(2, 3, '220', 'mg/dL', '0-200', 'Abnormal', 7, 7, '2024-01-15', '14:30:00', 'Elevated cholesterol, recommend diet and exercise'),
(3, 1, 'Normal', NULL, 'Normal ranges', 'Normal', 7, 7, '2024-01-16', '11:30:00', 'All values within normal limits'),
(4, 1, 'Slightly elevated WBC', NULL, 'Normal ranges', 'Abnormal', 7, 7, '2024-01-17', '12:00:00', 'Mild elevation, likely due to inflammation'),
(5, 4, 'Sinus arrhythmia noted', NULL, 'Normal', 'Abnormal', 7, 7, '2024-01-22', '10:00:00', 'Mild arrhythmia, requires monitoring');

-- RADIOLOGY ORDERS
INSERT INTO radiology_orders (patient_id, doctor_id, visit_id, study_type, body_part, order_date, order_time, priority, clinical_indication, status) VALUES
(3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 3, 'X-Ray', 'Right Knee', '2024-01-17', '11:30:00', 'Routine', 'Rule out fracture after injury', 'Completed'),
(2, (SELECT doctor_id FROM doctors WHERE staff_id = 2 LIMIT 1), 2, 'MRI', 'Brain', '2024-01-16', '09:30:00', 'Urgent', 'Rule out structural abnormalities', 'Scheduled'),
(12, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 6, 'Ultrasound', 'Heart', '2024-01-22', '09:30:00', 'Routine', 'Evaluate heart function for arrhythmia (Echocardiogram)', 'Scheduled');

-- RADIOLOGY RESULTS
INSERT INTO radiology_results (radiology_order_id, study_date, study_time, findings, impression, recommendations, radiologist_id, report_date) VALUES
(1, '2024-01-17', '14:00:00', 'No fracture seen. Mild soft tissue swelling noted.', 'No acute fracture. Soft tissue injury likely.', 'Continue conservative treatment, follow-up if symptoms worsen', (SELECT doctor_id FROM doctors WHERE staff_id = 5 LIMIT 1), '2024-01-17');

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
('INV-2024-004', 4, 4, '2024-01-18', '2024-01-25', 550.00, 0.00, 82.50, 632.50, 'Pending', 10),
('INV-2024-005', 12, 6, '2024-01-22', '2024-01-29', 500.00, 0.00, 75.00, 575.00, 'Paid', 10);

-- INVOICE ITEMS
INSERT INTO invoice_items (invoice_id, service_type, service_id, description, quantity, unit_price, total_price, billing_code_id) VALUES
(1, 'Consultation', 1, 'Cardiology Consultation', 1, 500.00, 500.00, 2),
(1, 'Procedure', 1, 'ECG', 1, 200.00, 200.00, 3),
(2, 'Consultation', 2, 'Neurology Consultation', 1, 450.00, 450.00, 2),
(2, 'Lab Test', 3, 'Complete Blood Count', 1, 150.00, 150.00, 4),
(3, 'Consultation', 3, 'Orthopedic Consultation', 1, 600.00, 600.00, 2),
(3, 'Radiology', 1, 'Knee X-Ray', 1, 250.00, 250.00, 5),
(4, 'Consultation', 4, 'Pediatric Consultation', 1, 400.00, 400.00, 2),
(4, 'Medication', 4, 'Amoxicillin', 1, 52.50, 52.50, NULL),
(5, 'Consultation', 1, 'Cardiology Consultation', 1, 500.00, 500.00, 2);

-- PAYMENTS
INSERT INTO payments (invoice_id, payment_date, payment_time, amount, payment_method_id, transaction_reference, received_by, status) VALUES
(1, '2024-01-15', '15:30:00', 805.00, 2, 'CC-2024-001', 10, 'Completed'),
(2, '2024-01-16', '16:00:00', 690.00, 2, 'CC-2024-002', 10, 'Completed'),
(3, '2024-01-17', '17:00:00', 1035.00, 1, 'CASH-2024-003', 10, 'Completed'),
(5, '2024-01-22', '16:30:00', 575.00, 2, 'CC-2024-005', 10, 'Completed');

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
(3, 3, 'CLM-2024-003', '2024-01-17', 879.75, 879.75, 6, '2024-01-17', '2024-01-22'),
(5, 12, 'CLM-2024-005', '2024-01-22', 460.00, 460.00, 6, '2024-01-22', '2024-01-27');

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
(1, '2024-01-20', '08:00:00', 'Emergency', 1, (SELECT doctor_id FROM doctors WHERE staff_id = 1 LIMIT 1), 'Acute myocardial infarction', '2024-01-25', 'Admitted'),
(5, '2024-01-21', '10:00:00', 'Elective', 3, (SELECT doctor_id FROM doctors WHERE staff_id = 3 LIMIT 1), 'Knee replacement surgery', '2024-01-24', 'Admitted');

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

-- End of Seed Data
