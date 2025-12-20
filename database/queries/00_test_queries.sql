-- Test Queries
USE HMS_Database;

-- Check record counts
SELECT 
    'Staff Roles' AS table_name, COUNT(*) AS record_count FROM staff_roles
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Staff', COUNT(*) FROM staff
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'Prescriptions', COUNT(*) FROM prescriptions
UNION ALL
SELECT 'Medical Records', COUNT(*) FROM medical_records
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices;

-- List doctors with specialties
SELECT 
    d.doctor_id,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name,
    d.license_number,
    d.consultation_fee
FROM doctors d
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
ORDER BY d.doctor_id;

-- List patients
SELECT 
    patient_id,
    CONCAT(first_name, ' ', last_name) AS patient_name,
    national_id,
    phone,
    email,
    status
FROM patients
ORDER BY patient_id;

-- List appointments
SELECT 
    a.appointment_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    a.appointment_date,
    a.appointment_time,
    ast.status_name AS status
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN doctors d ON a.doctor_id = d.doctor_id
INNER JOIN staff s ON d.staff_id = s.staff_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
ORDER BY a.appointment_date, a.appointment_time;

-- List medications
SELECT 
    medication_id,
    medication_name,
    generic_name,
    medication_type,
    strength,
    unit,
    price_per_unit,
    status
FROM medications
ORDER BY medication_name;

-- List diagnoses
SELECT 
    d.diagnosis_id,
    d.diagnosis_name,
    d.icd_code,
    d.diagnosis_type,
    mr.record_date,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
INNER JOIN patients p ON mr.patient_id = p.patient_id
ORDER BY mr.record_date DESC;
