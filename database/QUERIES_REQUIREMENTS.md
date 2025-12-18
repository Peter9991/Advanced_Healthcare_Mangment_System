# Required Queries for Healthcare Management System

Based on your project requirements, you need to implement these queries:

---

## Query 1: Find all appointments for a specific doctor on a given day

**Purpose**: Retrieve all appointments scheduled for a particular doctor on a specific date.

**Example**:
```sql
SELECT 
    a.appointment_id,
    a.appointment_date,
    a.appointment_time,
    p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    p.phone AS patient_phone,
    at.type_name AS appointment_type,
    ast.status_name AS appointment_status
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE a.doctor_id = ? 
  AND DATE(a.appointment_date) = ?
ORDER BY a.appointment_time;
```

**Your task**: Write this query based on your actual table structure.

---

## Query 2: List all patients who have been prescribed a specific medication

**Purpose**: Find all patients who have received a prescription for a particular medication.

**Example**:
```sql
SELECT DISTINCT
    p.patient_id,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.phone,
    pr.prescription_date,
    m.medication_name,
    pi.dosage,
    pi.frequency,
    pi.duration_days
FROM patients p
INNER JOIN prescriptions pr ON p.patient_id = pr.patient_id
INNER JOIN prescription_items pi ON pr.prescription_id = pi.prescription_id
INNER JOIN medications m ON pi.medication_id = m.medication_id
WHERE m.medication_name = ? 
  OR m.generic_name = ?
ORDER BY pr.prescription_date DESC;
```

**Your task**: Write this query based on your actual table structure.

---

## Query 3: Calculate the total revenue generated from appointments in a month

**Purpose**: Calculate the total income from appointments (consultation fees) for a specific month.

**Example**:
```sql
SELECT 
    DATE_FORMAT(a.appointment_date, '%Y-%m') AS month,
    COUNT(a.appointment_id) AS total_appointments,
    SUM(at.fee) AS total_revenue,
    AVG(at.fee) AS average_fee
FROM appointments a
INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
INNER JOIN appointment_status ast ON a.status_id = ast.status_id
WHERE DATE_FORMAT(a.appointment_date, '%Y-%m') = ?
  AND ast.status_name = 'Completed'
GROUP BY DATE_FORMAT(a.appointment_date, '%Y-%m');
```

**Alternative**: If appointments are linked to invoices:
```sql
SELECT 
    DATE_FORMAT(i.invoice_date, '%Y-%m') AS month,
    COUNT(DISTINCT i.invoice_id) AS total_invoices,
    SUM(i.total_amount) AS total_revenue
FROM invoices i
INNER JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
WHERE ii.service_type = 'Consultation'
  AND DATE_FORMAT(i.invoice_date, '%Y-%m') = ?
  AND i.status = 'Paid'
GROUP BY DATE_FORMAT(i.invoice_date, '%Y-%m');
```

**Your task**: Write this query based on your billing structure.

---

## Query 4: Find the most common diagnosis in the past year

**Purpose**: Identify the most frequently diagnosed condition in the last 12 months.

**Example**:
```sql
SELECT 
    d.diagnosis_name,
    d.icd_code,
    COUNT(*) AS diagnosis_count,
    COUNT(DISTINCT d.patient_id) AS patient_count
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
WHERE mr.record_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY d.diagnosis_name, d.icd_code
ORDER BY diagnosis_count DESC
LIMIT 10;
```

**Alternative**: If you want to include ICD code grouping:
```sql
SELECT 
    d.icd_code,
    d.diagnosis_name,
    COUNT(*) AS frequency,
    ROUND(COUNT(*) * 100.0 / (
        SELECT COUNT(*) 
        FROM diagnoses d2
        INNER JOIN medical_records mr2 ON d2.record_id = mr2.record_id
        WHERE mr2.record_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    ), 2) AS percentage
FROM diagnoses d
INNER JOIN medical_records mr ON d.record_id = mr.record_id
WHERE mr.record_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY d.icd_code, d.diagnosis_name
ORDER BY frequency DESC
LIMIT 1;
```

**Your task**: Write this query based on your diagnoses table structure.

---

## Additional Useful Queries (For Your Learning)

### Query 5: Find patients with upcoming appointments
```sql
SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    a.appointment_date,
    a.appointment_time,
    d.first_name AS doctor_first_name,
    d.last_name AS doctor_last_name
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN doctors d ON a.doctor_id = d.doctor_id
WHERE a.appointment_date >= CURDATE()
  AND a.status_id = (SELECT status_id FROM appointment_status WHERE status_name = 'Scheduled')
ORDER BY a.appointment_date, a.appointment_time;
```

### Query 6: Calculate average appointment duration by doctor
```sql
SELECT 
    d.doctor_id,
    d.first_name,
    d.last_name,
    COUNT(a.appointment_id) AS total_appointments,
    AVG(at.duration_minutes) AS avg_duration_minutes
FROM doctors d
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
LEFT JOIN appointment_types at ON a.appointment_type_id = at.type_id
GROUP BY d.doctor_id, d.first_name, d.last_name
ORDER BY total_appointments DESC;
```

### Query 7: Find patients with overdue payments
```sql
SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    i.invoice_number,
    i.invoice_date,
    i.due_date,
    i.total_amount,
    COALESCE(SUM(pay.amount), 0) AS paid_amount,
    (i.total_amount - COALESCE(SUM(pay.amount), 0)) AS outstanding_amount,
    DATEDIFF(CURDATE(), i.due_date) AS days_overdue
FROM invoices i
INNER JOIN patients p ON i.patient_id = p.patient_id
LEFT JOIN payments pay ON i.invoice_id = pay.invoice_id
WHERE i.status != 'Paid'
  AND i.due_date < CURDATE()
GROUP BY i.invoice_id, p.patient_id, p.first_name, p.last_name, 
         i.invoice_number, i.invoice_date, i.due_date, i.total_amount
HAVING outstanding_amount > 0
ORDER BY days_overdue DESC;
```

---

## 🎯 YOUR TASKS:

1. **After creating your database tables**, write these 4 required queries
2. **Test each query** with sample data
3. **Optimize queries** by adding indexes if needed
4. **Document your queries** - explain what each does
5. **Create views** for complex queries that will be used frequently

---

## 📝 Query Testing Checklist:

- [ ] Query 1: Find appointments for doctor on given day
- [ ] Query 2: List patients prescribed specific medication
- [ ] Query 3: Calculate monthly revenue from appointments
- [ ] Query 4: Find most common diagnosis in past year
- [ ] All queries return expected results
- [ ] Queries are optimized with proper indexes
- [ ] Queries handle edge cases (no results, NULL values)

Good luck! 🚀

