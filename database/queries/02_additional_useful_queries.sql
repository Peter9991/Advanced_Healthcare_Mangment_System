-- Additional Useful Queries
USE Peter_healthcare_management_system;

-- QUERY 5: Find patients with upcoming appointments

SELECT 
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.phone,
    p.email,
    a.appointment_date,
    a.appointment_time,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name AS doctor_specialty,
    at.type_name AS appointment_type,
    ast.status_name AS appointment_status,
    a.reason_for_visit,
    DATEDIFF(a.appointment_date, CURDATE()) AS days_until_appointment
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN doctors d ON a.doctor_id = d.doctor_id
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE a.appointment_date >= CURDATE()
  AND ast.status_name IN ('Scheduled', 'Confirmed')
ORDER BY a.appointment_date, a.appointment_time;

-- QUERY 6: Calculate average appointment duration by doctor

SELECT 
    d.doctor_id,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name AS specialty,
    COUNT(a.appointment_id) AS total_appointments,
    AVG(at.duration_minutes) AS avg_duration_minutes,
    SUM(at.duration_minutes) AS total_duration_minutes,
    MIN(at.duration_minutes) AS min_duration,
    MAX(at.duration_minutes) AS max_duration,
    AVG(at.fee) AS avg_appointment_fee,
    SUM(CASE WHEN ast.status_name = 'Completed' THEN at.fee ELSE 0 END) AS total_revenue
FROM doctors d
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
LEFT JOIN appointment_types at ON a.appointment_type_id = at.type_id
LEFT JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE (ast.status_name = 'Completed' OR ast.status_name IS NULL)
GROUP BY d.doctor_id, s.first_name, s.last_name, ds.specialty_name
ORDER BY total_appointments DESC;

-- QUERY 7: Find patients with overdue payments

SELECT 
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.phone,
    p.email,
    i.invoice_number,
    i.invoice_date,
    i.due_date,
    i.total_amount,
    COALESCE(SUM(pay.amount), 0) AS paid_amount,
    (i.total_amount - COALESCE(SUM(pay.amount), 0)) AS outstanding_amount,
    DATEDIFF(CURDATE(), i.due_date) AS days_overdue,
    i.status AS invoice_status,
    CASE 
        WHEN DATEDIFF(CURDATE(), i.due_date) <= 30 THEN '1-30 days'
        WHEN DATEDIFF(CURDATE(), i.due_date) <= 60 THEN '31-60 days'
        WHEN DATEDIFF(CURDATE(), i.due_date) <= 90 THEN '61-90 days'
        ELSE 'Over 90 days'
    END AS overdue_category
FROM invoices i
INNER JOIN patients p ON i.patient_id = p.patient_id
LEFT JOIN payments pay ON i.invoice_id = pay.invoice_id AND pay.status = 'Completed'
WHERE i.status NOT IN ('Paid', 'Cancelled', 'Refunded')
  AND i.due_date < CURDATE()  -- Will show INV-2024-004 if current date > 2024-01-25
GROUP BY i.invoice_id, p.patient_id, p.first_name, p.last_name, 
         p.phone, p.email, i.invoice_number, i.invoice_date, 
         i.due_date, i.total_amount, i.status
HAVING outstanding_amount > 0
ORDER BY days_overdue DESC, outstanding_amount DESC;

-- QUERY 8: Patient visit history with diagnoses

SELECT 
    pv.visit_id,
    pv.visit_date,
    pv.visit_time,
    pv.visit_type,
    d.department_name,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    mr.chief_complaint,
    di.diagnosis_name,
    di.icd_code,
    di.diagnosis_type,
    mr.assessment,
    mr.plan
FROM patient_visits pv
INNER JOIN patients p ON pv.patient_id = p.patient_id
LEFT JOIN departments d ON pv.department_id = d.department_id
LEFT JOIN doctors doc ON pv.doctor_id = doc.doctor_id
LEFT JOIN staff s ON doc.staff_id = s.staff_id
LEFT JOIN medical_records mr ON pv.visit_id = mr.visit_id
LEFT JOIN diagnoses di ON mr.record_id = di.record_id
WHERE p.patient_id = 1  -- Patient: Ali Al-Mutairi (has visit and diagnosis in seed data)
ORDER BY pv.visit_date DESC, pv.visit_time DESC;

-- QUERY 9: Doctor schedule and availability

SELECT 
    d.doctor_id,
    CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,
    ds.specialty_name,
    dsched.day_of_week,
    dsched.start_time,
    dsched.end_time,
    dsched.location,
    COUNT(a.appointment_id) AS scheduled_appointments,
    dsched.max_appointments,
    (dsched.max_appointments - COUNT(a.appointment_id)) AS available_slots
FROM doctors d
INNER JOIN staff s ON d.staff_id = s.staff_id
LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
INNER JOIN doctor_schedules dsched ON d.doctor_id = dsched.doctor_id
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
    AND DAYNAME(a.appointment_date) = dsched.day_of_week
    AND a.status_id IN (SELECT status_id FROM appointment_status WHERE status_name IN ('Scheduled', 'Confirmed'))
WHERE dsched.is_available = TRUE
GROUP BY d.doctor_id, s.first_name, s.last_name, ds.specialty_name,
         dsched.day_of_week, dsched.start_time, dsched.end_time,
         dsched.location, dsched.max_appointments
ORDER BY d.doctor_id, 
    FIELD(dsched.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- QUERY 10: Medication inventory status
Check medication stock levels and expiring soon items

SELECT 
    m.medication_id,
    m.medication_name,
    m.generic_name,
    m.medication_type,
    m.strength,
    m.unit,
    SUM(mi.quantity_in_stock) AS total_stock,
    MIN(mi.expiry_date) AS earliest_expiry,
    MAX(mi.reorder_level) AS reorder_level,
    CASE 
        WHEN SUM(mi.quantity_in_stock) <= MAX(mi.reorder_level) THEN 'Low Stock'
        WHEN SUM(mi.quantity_in_stock) <= MAX(mi.reorder_level) * 1.5 THEN 'Reorder Soon'
        ELSE 'In Stock'
    END AS stock_status,
    COUNT(CASE WHEN mi.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 END) AS expiring_soon_count
FROM medications m
LEFT JOIN medication_inventory mi ON m.medication_id = mi.medication_id
WHERE m.status = 'Available'
GROUP BY m.medication_id, m.medication_name, m.generic_name, 
         m.medication_type, m.strength, m.unit
HAVING total_stock IS NOT NULL
ORDER BY 
    CASE stock_status
        WHEN 'Low Stock' THEN 1
        WHEN 'Reorder Soon' THEN 2
        ELSE 3
    END,
    earliest_expiry ASC;

-- QUERY 11: Lab test results summary

SELECT 
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    lto.order_date,
    lt.test_name,
    lt.test_code,
    lr.result_value,
    lr.unit,
    lr.reference_range,
    lr.status AS result_status,
    lr.notes,
    CONCAT(s1.first_name, ' ', s1.last_name) AS performed_by,
    CONCAT(s2.first_name, ' ', s2.last_name) AS verified_by,
    lr.result_date
FROM lab_test_orders lto
INNER JOIN patients p ON lto.patient_id = p.patient_id
INNER JOIN lab_test_order_items ltoi ON lto.order_id = ltoi.order_id
INNER JOIN lab_tests lt ON ltoi.test_id = lt.test_id
LEFT JOIN lab_results lr ON ltoi.order_item_id = lr.order_item_id
LEFT JOIN staff s1 ON lr.performed_by = s1.staff_id
LEFT JOIN staff s2 ON lr.verified_by = s2.staff_id
WHERE p.patient_id = 1  -- Patient: Ali Al-Mutairi (has lab tests in seed data)
ORDER BY lto.order_date DESC, lt.test_name;

-- QUERY 12: Insurance claims status

SELECT 
    ic.claim_id,
    ic.claim_number,
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    ip.provider_name AS insurance_provider,
    pi.policy_number,
    i.invoice_number,
    i.invoice_date,
    ic.claim_date,
    ic.claim_amount,
    ic.approved_amount,
    (ic.claim_amount - COALESCE(ic.approved_amount, 0)) AS rejected_amount,
    ics.status_name AS claim_status,
    ic.submitted_date,
    ic.processed_date,
    DATEDIFF(COALESCE(ic.processed_date, CURDATE()), ic.submitted_date) AS days_in_process,
    ic.rejection_reason
FROM insurance_claims ic
INNER JOIN invoices i ON ic.invoice_id = i.invoice_id
INNER JOIN patients p ON i.patient_id = p.patient_id
INNER JOIN patient_insurance pi ON ic.patient_insurance_id = pi.insurance_id
INNER JOIN insurance_providers ip ON pi.insurance_provider_id = ip.provider_id
INNER JOIN insurance_claim_status ics ON ic.status_id = ics.status_id
ORDER BY ic.claim_date DESC;

-- QUERY 13: Active prescriptions with refills remaining

SELECT 
    pr.prescription_id,
    p.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    pr.prescription_date,
    pr.expiry_date,
    pr.refills_allowed,
    pr.refills_remaining,
    pr.status AS prescription_status,
    m.medication_name,
    pi.dosage,
    pi.frequency,
    pi.duration_days,
    pi.quantity,
    DATEDIFF(pr.expiry_date, CURDATE()) AS days_until_expiry,
    CONCAT(s.first_name, ' ', s.last_name) AS prescribing_doctor
FROM prescriptions pr
INNER JOIN patients p ON pr.patient_id = p.patient_id
INNER JOIN prescription_items pi ON pr.prescription_id = pi.prescription_id
INNER JOIN medications m ON pi.medication_id = m.medication_id
INNER JOIN doctors d ON pr.doctor_id = d.doctor_id
INNER JOIN staff s ON d.staff_id = s.staff_id
WHERE pr.status = 'Active'
  AND pr.refills_remaining > 0
  AND pr.expiry_date >= '2024-01-01'  -- Adjusted to include seed data (or use CURDATE() for actual current date)
ORDER BY pr.expiry_date ASC, pr.refills_remaining DESC;

-- QUERY 14: Department statistics

SELECT 
    d.department_id,
    d.department_name,
    d.department_code,
    CONCAT(s.first_name, ' ', s.last_name) AS head_of_department,
    COUNT(DISTINCT st.staff_id) AS total_staff,
    COUNT(DISTINCT doc.doctor_id) AS total_doctors,
    COUNT(DISTINCT pv.visit_id) AS total_visits,
    COUNT(DISTINCT CASE WHEN pv.visit_date >= '2024-01-01' THEN pv.visit_id END) AS visits_january_2024,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COUNT(DISTINCT CASE WHEN a.appointment_date >= '2024-01-01' THEN a.appointment_id END) AS appointments_january_2024
FROM departments d
LEFT JOIN staff st ON d.department_id = st.department_id
LEFT JOIN doctors doc ON st.staff_id = doc.staff_id
LEFT JOIN patient_visits pv ON d.department_id = pv.department_id
LEFT JOIN appointments a ON doc.doctor_id = a.doctor_id
LEFT JOIN staff s ON d.head_of_department = s.staff_id
WHERE d.status = 'Active'
GROUP BY d.department_id, d.department_name, d.department_code, 
         s.first_name, s.last_name
ORDER BY total_visits DESC;

