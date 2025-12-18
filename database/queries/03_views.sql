-- Useful Views
USE Peter_healthcare_management_system;

-- VIEW 1: Patient Summary View

CREATE OR REPLACE VIEW v_patient_summary AS
SELECT 
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.national_id,
    p.date_of_birth,
    p.gender,
    p.blood_type,
    p.phone,
    p.email,
    p.status AS patient_status,
    COUNT(DISTINCT pv.visit_id) AS total_visits,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COUNT(DISTINCT pr.prescription_id) AS total_prescriptions,
    COUNT(DISTINCT pa.allergy_id) AS total_allergies,
    MAX(pv.visit_date) AS last_visit_date,
    MIN(p.registration_date) AS registration_date
FROM patients p
LEFT JOIN patient_visits pv ON p.patient_id = pv.patient_id
LEFT JOIN appointments a ON p.patient_id = a.patient_id
LEFT JOIN prescriptions pr ON p.patient_id = pr.patient_id
LEFT JOIN patient_allergies pa ON p.patient_id = pa.patient_id
GROUP BY p.patient_id, p.first_name, p.last_name, p.national_id,
         p.date_of_birth, p.gender, p.blood_type, p.phone, 
         p.email, p.status;

-- VIEW 2: Doctor Schedule View
doctor schedules with appointment counts
-- Example usage:
--   SELECT * FROM v_doctor_schedule_summary WHERE doctor_id = 1;
--   SELECT * FROM v_doctor_schedule_summary WHERE day_of_week = 'Monday';

CREATE OR REPLACE VIEW v_doctor_schedule_summary AS
SELECT 
    d.doctor_id,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name AS specialty,
    dsched.day_of_week,
    dsched.start_time,
    dsched.end_time,
    dsched.location,
    dsched.max_appointments,
    COUNT(a.appointment_id) AS scheduled_count,
    (dsched.max_appointments - COUNT(a.appointment_id)) AS available_slots,
    dsched.is_available
FROM doctors d
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
INNER JOIN doctor_schedules dsched ON d.doctor_id = dsched.doctor_id
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
    AND DAYNAME(a.appointment_date) = dsched.day_of_week
    AND a.status_id IN (SELECT status_id FROM appointment_status WHERE status_name IN ('Scheduled', 'Confirmed'))
WHERE d.status = 'Active'
GROUP BY d.doctor_id, s.first_name, s.last_name, ds.specialty_name,
         dsched.day_of_week, dsched.start_time, dsched.end_time,
         dsched.location, dsched.max_appointments, dsched.is_available;

-- VIEW 3: Monthly Revenue Summary
revenue breakdown by service type
-- Example usage:
--   SELECT * FROM v_monthly_revenue WHERE month = '2024-01';
--   SELECT * FROM v_monthly_revenue ORDER BY month DESC LIMIT 12;

CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    DATE_FORMAT(i.invoice_date, '%Y-%m') AS month,
    COUNT(DISTINCT i.invoice_id) AS total_invoices,
    COUNT(DISTINCT i.patient_id) AS unique_patients,
    SUM(i.subtotal) AS subtotal,
    SUM(i.discount_amount) AS total_discounts,
    SUM(i.tax_amount) AS total_tax,
    SUM(i.total_amount) AS total_revenue,
    SUM(CASE WHEN pay.status = 'Completed' THEN pay.amount ELSE 0 END) AS paid_amount,
    SUM(i.total_amount) - SUM(CASE WHEN pay.status = 'Completed' THEN pay.amount ELSE 0 END) AS outstanding_amount
FROM invoices i
LEFT JOIN payments pay ON i.invoice_id = pay.invoice_id
GROUP BY DATE_FORMAT(i.invoice_date, '%Y-%m')
ORDER BY month DESC;

-- VIEW 4: Appointment Statistics by Doctor
appointment statistics
-- Example usage:
--   SELECT * FROM v_doctor_appointment_stats WHERE doctor_id = 1;
--   SELECT * FROM v_doctor_appointment_stats ORDER BY total_revenue DESC;

CREATE OR REPLACE VIEW v_doctor_appointment_stats AS
SELECT 
    d.doctor_id,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name AS specialty,
    COUNT(a.appointment_id) AS total_appointments,
    COUNT(CASE WHEN ast.status_name = 'Completed' THEN a.appointment_id END) AS completed_appointments,
    COUNT(CASE WHEN ast.status_name = 'Cancelled' THEN a.appointment_id END) AS cancelled_appointments,
    COUNT(CASE WHEN ast.status_name = 'No Show' THEN a.appointment_id END) AS no_show_appointments,
    COUNT(CASE WHEN a.appointment_date >= CURDATE() AND ast.status_name IN ('Scheduled', 'Confirmed') THEN a.appointment_id END) AS upcoming_appointments,
    AVG(at.fee) AS avg_appointment_fee,
    SUM(CASE WHEN ast.status_name = 'Completed' THEN at.fee ELSE 0 END) AS total_revenue
FROM doctors d
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
LEFT JOIN appointment_types at ON a.appointment_type_id = at.type_id
LEFT JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE d.status = 'Active'
GROUP BY d.doctor_id, s.first_name, s.last_name, ds.specialty_name;

-- VIEW 5: Patient Medical History Summary
medical history for patients
-- Example usage:
--   SELECT * FROM v_patient_medical_history WHERE patient_id = 1;
--   SELECT * FROM v_patient_medical_history WHERE diagnosis_name LIKE '%angina%';

CREATE OR REPLACE VIEW v_patient_medical_history AS
SELECT 
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    mr.record_id,
    mr.record_date,
    mr.record_time,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    mr.chief_complaint,
    d.diagnosis_name,
    d.icd_code,
    d.diagnosis_type,
    mr.assessment,
    mr.plan,
    COUNT(DISTINCT t.treatment_id) AS treatment_count,
    COUNT(DISTINCT pr.prescription_id) AS prescription_count
FROM patients p
INNER JOIN medical_records mr ON p.patient_id = mr.patient_id
LEFT JOIN doctors doc ON mr.doctor_id = doc.doctor_id
LEFT JOIN staff s ON doc.staff_id = s.staff_id
LEFT JOIN diagnoses d ON mr.record_id = d.record_id
LEFT JOIN treatments t ON mr.record_id = t.record_id
LEFT JOIN prescriptions pr ON mr.patient_id = pr.patient_id AND DATE(pr.prescription_date) = DATE(mr.record_date)
GROUP BY p.patient_id, p.first_name, p.last_name, mr.record_id,
         mr.record_date, mr.record_time, s.first_name, s.last_name,
         mr.chief_complaint, d.diagnosis_name, d.icd_code, 
         d.diagnosis_type, mr.assessment, mr.plan
ORDER BY mr.record_date DESC, mr.record_time DESC;

-- VIEW 6: Medication Prescription Summary
of all prescribed medications
-- Example usage:
--   SELECT * FROM v_medication_prescription_summary WHERE medication_name = 'Nitroglycerin';
--   SELECT * FROM v_medication_prescription_summary ORDER BY total_prescriptions DESC;

CREATE OR REPLACE VIEW v_medication_prescription_summary AS
SELECT 
    m.medication_id,
    m.medication_name,
    m.generic_name,
    m.medication_type,
    COUNT(DISTINCT pr.prescription_id) AS total_prescriptions,
    COUNT(DISTINCT pr.patient_id) AS unique_patients,
    SUM(pi.quantity) AS total_quantity_prescribed,
    AVG(pi.duration_days) AS avg_duration_days,
    MIN(pr.prescription_date) AS first_prescribed,
    MAX(pr.prescription_date) AS last_prescribed
FROM medications m
INNER JOIN prescription_items pi ON m.medication_id = pi.medication_id
INNER JOIN prescriptions pr ON pi.prescription_id = pr.prescription_id
GROUP BY m.medication_id, m.medication_name, m.generic_name, m.medication_type
ORDER BY total_prescriptions DESC;

-- VIEW 7: Lab Test Results Summary
of lab test results
-- Example usage:
--   SELECT * FROM v_lab_test_results_summary WHERE test_name = 'ECG';
--   SELECT * FROM v_lab_test_results_summary ORDER BY total_orders DESC;

CREATE OR REPLACE VIEW v_lab_test_results_summary AS
SELECT 
    lt.test_id,
    lt.test_name,
    lt.test_code,
    lc.category_name AS test_category,
    COUNT(DISTINCT lto.order_id) AS total_orders,
    COUNT(DISTINCT lr.result_id) AS total_results,
    COUNT(CASE WHEN lr.status = 'Normal' THEN lr.result_id END) AS normal_results,
    COUNT(CASE WHEN lr.status = 'Abnormal' THEN lr.result_id END) AS abnormal_results,
    COUNT(CASE WHEN lr.status = 'Critical' THEN lr.result_id END) AS critical_results,
    AVG(CAST(lr.result_value AS DECIMAL(10,2))) AS avg_result_value,
    MIN(lr.result_date) AS first_test_date,
    MAX(lr.result_date) AS last_test_date
FROM lab_tests lt
LEFT JOIN lab_categories lc ON lt.category_id = lc.category_id
LEFT JOIN lab_test_order_items ltoi ON lt.test_id = ltoi.test_id
LEFT JOIN lab_test_orders lto ON ltoi.order_id = lto.order_id
LEFT JOIN lab_results lr ON ltoi.order_item_id = lr.order_item_id
GROUP BY lt.test_id, lt.test_name, lt.test_code, lc.category_name
ORDER BY total_orders DESC;

-- VIEW 8: Insurance Coverage Summary
of insurance coverage by provider
-- Example usage:
--   SELECT * FROM v_insurance_coverage_summary WHERE provider_name = 'Bupa Arabia';
--   SELECT * FROM v_insurance_coverage_summary ORDER BY total_policies DESC;

CREATE OR REPLACE VIEW v_insurance_coverage_summary AS
SELECT 
    ip.provider_id,
    ip.provider_name,
    COUNT(DISTINCT pi.insurance_id) AS total_policies,
    COUNT(DISTINCT pi.patient_id) AS unique_patients,
    COUNT(DISTINCT CASE WHEN pi.status = 'Active' THEN pi.insurance_id END) AS active_policies,
    AVG(pi.coverage_percentage) AS avg_coverage_percentage,
    SUM(pi.max_coverage_amount) AS total_max_coverage,
    COUNT(DISTINCT ic.claim_id) AS total_claims,
    SUM(ic.claim_amount) AS total_claim_amount,
    SUM(ic.approved_amount) AS total_approved_amount
FROM insurance_providers ip
LEFT JOIN patient_insurance pi ON ip.provider_id = pi.insurance_provider_id
LEFT JOIN insurance_claims ic ON pi.insurance_id = ic.patient_insurance_id
GROUP BY ip.provider_id, ip.provider_name
ORDER BY total_policies DESC;

