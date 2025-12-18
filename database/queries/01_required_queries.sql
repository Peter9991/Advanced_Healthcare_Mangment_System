-- Required Queries
USE Peter_healthcare_management_system;

-- QUERY 1: Find all appointments for a specific doctor on a given day

SELECT 
    a.appointment_id,
    a.appointment_date,
    a.appointment_time,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.phone AS patient_phone,
    p.email AS patient_email,
    at.type_name AS appointment_type,
    at.duration_minutes,
    at.fee AS appointment_fee,
    ast.status_name AS appointment_status,
    a.reason_for_visit,
    a.notes
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE a.doctor_id = 1  -- Doctor: Ahmed Al-Saud (Cardiologist)
  AND DATE(a.appointment_date) = '2024-01-15'  -- Date from seed data
ORDER BY a.appointment_time;

-- QUERY 2: List all patients who have been prescribed a specific medication

SELECT DISTINCT
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.date_of_birth,
    p.phone,
    p.email,
    pr.prescription_date,
    m.medication_name,
    m.generic_name,
    pi.dosage,
    pi.frequency,
    pi.duration_days,
    pi.quantity,
    pi.instructions,
    pr.status AS prescription_status,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name
FROM patients p
INNER JOIN prescriptions pr ON p.patient_id = pr.patient_id
INNER JOIN prescription_items pi ON pr.prescription_id = pi.prescription_id
INNER JOIN medications m ON pi.medication_id = m.medication_id
INNER JOIN doctors d ON pr.doctor_id = d.doctor_id
INNER JOIN staff s ON d.staff_id = s.staff_id
WHERE m.medication_name = 'Nitroglycerin'  -- Medication from seed data
   OR m.generic_name = 'Nitroglycerin'
ORDER BY pr.prescription_date DESC;

-- QUERY 3: Calculate the total revenue generated from appointments in a month
SELECT 
    DATE_FORMAT(a.appointment_date, '%Y-%m') AS month,
    COUNT(a.appointment_id) AS total_appointments,
    SUM(at.fee) AS total_revenue,
    AVG(at.fee) AS average_fee,
    MIN(at.fee) AS min_fee,
    MAX(at.fee) AS max_fee
FROM appointments a
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE DATE_FORMAT(a.appointment_date, '%Y-%m') = '2024-01'  -- January 2024 (has seed data)
  AND ast.status_name = 'Completed'
GROUP BY DATE_FORMAT(a.appointment_date, '%Y-%m');

SELECT 
    DATE_FORMAT(i.invoice_date, '%Y-%m') AS month,
    COUNT(DISTINCT i.invoice_id) AS total_invoices,
    COUNT(DISTINCT ii.item_id) AS total_services,
    SUM(i.total_amount) AS total_revenue,
    AVG(i.total_amount) AS average_invoice_amount,
    SUM(i.subtotal) AS subtotal,
    SUM(i.tax_amount) AS total_tax,
    SUM(i.discount_amount) AS total_discounts
FROM invoices i
INNER JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
WHERE ii.service_type = 'Consultation'
  AND DATE_FORMAT(i.invoice_date, '%Y-%m') = '2024-01'  -- January 2024 (has seed data)
  AND i.status = 'Paid'
GROUP BY DATE_FORMAT(i.invoice_date, '%Y-%m');

SELECT 
    DATE_FORMAT(a.appointment_date, '%Y-%m') AS month,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN ast.status_name = 'Completed' THEN a.appointment_id END) AS completed_appointments,
    SUM(CASE WHEN ast.status_name = 'Completed' THEN at.fee ELSE 0 END) AS scheduled_revenue,
    COALESCE(SUM(DISTINCT i.total_amount), 0) AS paid_revenue
FROM appointments a
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
LEFT JOIN patient_visits pv ON a.patient_id = pv.patient_id 
    AND DATE(a.appointment_date) = DATE(pv.visit_date)
LEFT JOIN invoices i ON pv.visit_id = i.visit_id AND i.status = 'Paid'
WHERE DATE_FORMAT(a.appointment_date, '%Y-%m') = '2024-01'  -- January 2024 (has seed data)
GROUP BY DATE_FORMAT(a.appointment_date, '%Y-%m');

-- QUERY 4: Find the most common diagnosis in the past year
SELECT 
    d.diagnosis_name,
    d.icd_code,
    COUNT(*) AS diagnosis_count,
    COUNT(DISTINCT mr.patient_id) AS patient_count,
    MIN(mr.record_date) AS first_occurrence,
    MAX(mr.record_date) AS last_occurrence
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
WHERE mr.record_date >= '2024-01-01'  -- Adjusted to include seed data (or use DATE_SUB(CURDATE(), INTERVAL 1 YEAR) for actual past year)
GROUP BY d.diagnosis_name, d.icd_code
ORDER BY diagnosis_count DESC
LIMIT 10;

SELECT 
    d.icd_code,
    d.diagnosis_name,
    COUNT(*) AS frequency,
    COUNT(DISTINCT mr.patient_id) AS unique_patients,
    ROUND(COUNT(*) * 100.0 / (
        SELECT COUNT(*) 
        FROM diagnoses d2
        INNER JOIN medical_records mr2 ON d2.record_id = mr2.record_id
        WHERE mr2.record_date >= '2024-01-01'  -- Adjusted for seed data
    ), 2) AS percentage_of_all_diagnoses
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
WHERE mr.record_date >= '2024-01-01'  -- Adjusted for seed data (or use DATE_SUB(CURDATE(), INTERVAL 1 YEAR))
GROUP BY d.icd_code, d.diagnosis_name
ORDER BY frequency DESC
LIMIT 1;

SELECT 
    d.diagnosis_name,
    d.icd_code,
    d.diagnosis_type,
    COUNT(*) AS frequency,
    COUNT(DISTINCT mr.patient_id) AS patient_count
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
WHERE mr.record_date >= '2024-01-01'  -- Adjusted for seed data (or use DATE_SUB(CURDATE(), INTERVAL 1 YEAR))
  AND d.diagnosis_type = 'Primary'  -- Filter by diagnosis type if needed
GROUP BY d.diagnosis_name, d.icd_code, d.diagnosis_type
ORDER BY frequency DESC
LIMIT 10;

