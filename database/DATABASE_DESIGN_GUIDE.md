# Database Design Guide - Healthcare Management System

## Reference: Saudi German Hospital Structure

Based on real hospital operations, here's a comprehensive guide to design your 50+ table database.

---

## 📋 Table Categories & Design Guidelines

### 1. CORE PATIENT MANAGEMENT (8-10 tables)

#### `patients` (Main Patient Table)
**Columns to include:**
- patient_id (PK, AUTO_INCREMENT)
- national_id / passport_number (UNIQUE)
- first_name, last_name, middle_name
- date_of_birth
- gender (ENUM: 'M', 'F', 'Other')
- blood_type (ENUM: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
- phone, email, address
- marital_status
- occupation
- registration_date
- status (ENUM: 'Active', 'Inactive', 'Deceased')
- created_at, updated_at

**Your task**: Write CREATE TABLE statement with proper data types and constraints.

---

#### `patient_contacts`
- contact_id (PK)
- patient_id (FK → patients)
- contact_type (ENUM: 'Primary', 'Secondary', 'Emergency')
- name, phone, email, relationship
- is_primary (BOOLEAN)

---

#### `patient_insurance`
- insurance_id (PK)
- patient_id (FK → patients)
- insurance_provider_id (FK → insurance_providers)
- policy_number (UNIQUE)
- coverage_start_date, coverage_end_date
- coverage_percentage
- max_coverage_amount
- status (ENUM: 'Active', 'Expired', 'Pending')

---

#### `patient_medical_history`
- history_id (PK)
- patient_id (FK → patients)
- condition_name
- diagnosis_date
- treatment_description
- current_status (ENUM: 'Active', 'Resolved', 'Chronic')
- doctor_notes

---

#### `patient_allergies`
- allergy_id (PK)
- patient_id (FK → patients)
- allergen_name
- allergy_type (ENUM: 'Medication', 'Food', 'Environmental', 'Other')
- severity (ENUM: 'Mild', 'Moderate', 'Severe', 'Life-threatening')
- reaction_description
- diagnosed_date

---

#### `patient_emergency_contacts`
- emergency_contact_id (PK)
- patient_id (FK → patients)
- contact_name
- relationship (ENUM: 'Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other')
- phone_primary, phone_secondary
- address
- is_primary_contact (BOOLEAN)

---

#### `patient_documents`
- document_id (PK)
- patient_id (FK → patients)
- document_type (ENUM: 'ID', 'Insurance', 'Medical Report', 'Consent Form', 'Other')
- document_name
- file_path / file_url
- uploaded_date
- uploaded_by (FK → staff)

---

#### `patient_visits`
- visit_id (PK)
- patient_id (FK → patients)
- visit_date, visit_time
- visit_type (ENUM: 'Consultation', 'Follow-up', 'Emergency', 'Routine Check')
- department_id (FK → departments)
- doctor_id (FK → doctors)
- chief_complaint
- visit_status (ENUM: 'Scheduled', 'In Progress', 'Completed', 'Cancelled')

---

### 2. DOCTOR & STAFF MANAGEMENT (8-10 tables)

#### `doctors`
- doctor_id (PK)
- staff_id (FK → staff) OR direct fields
- license_number (UNIQUE)
- specialization_id (FK → specializations)
- years_of_experience
- consultation_fee
- status (ENUM: 'Active', 'On Leave', 'Inactive')
- bio, qualifications_text

---

#### `doctor_specialties`
- specialty_id (PK)
- specialty_name (UNIQUE)
- description
- department_id (FK → departments)

**Examples**: Cardiology, Neurology, Orthopedics, Pediatrics, etc.

---

#### `doctor_schedules`
- schedule_id (PK)
- doctor_id (FK → doctors)
- day_of_week (ENUM: 'Monday', 'Tuesday', ..., 'Sunday')
- start_time, end_time
- is_available (BOOLEAN)
- location (VARCHAR: 'Clinic A', 'Ward 3', etc.)

---

#### `doctor_qualifications`
- qualification_id (PK)
- doctor_id (FK → doctors)
- degree_type (ENUM: 'MBBS', 'MD', 'PhD', 'Diploma', 'Certificate')
- institution_name
- graduation_year
- specialization
- certificate_number

---

#### `staff`
- staff_id (PK)
- employee_id (UNIQUE)
- first_name, last_name
- date_of_birth
- gender
- phone, email
- address
- hire_date
- department_id (FK → departments)
- role_id (FK → staff_roles)
- salary
- status (ENUM: 'Active', 'On Leave', 'Terminated')

---

#### `staff_roles`
- role_id (PK)
- role_name (UNIQUE)
- description
- permissions (JSON or separate permissions table)

**Examples**: Admin, Doctor, Nurse, Lab Technician, Receptionist, Pharmacist, etc.

---

#### `staff_departments`
- department_id (PK)
- department_name (UNIQUE)
- department_code
- head_of_department (FK → staff)
- description
- location

---

#### `staff_shifts`
- shift_id (PK)
- staff_id (FK → staff)
- shift_date
- shift_type (ENUM: 'Morning', 'Afternoon', 'Night')
- start_time, end_time
- status (ENUM: 'Scheduled', 'Completed', 'Absent')

---

### 3. APPOINTMENTS & SCHEDULING (5-6 tables)

#### `appointments`
- appointment_id (PK)
- patient_id (FK → patients)
- doctor_id (FK → doctors)
- appointment_date, appointment_time
- appointment_type_id (FK → appointment_types)
- status_id (FK → appointment_status)
- reason_for_visit
- notes
- created_at, updated_at

---

#### `appointment_types`
- type_id (PK)
- type_name (UNIQUE)
- duration_minutes
- fee
- description

**Examples**: Consultation, Follow-up, Emergency, Surgery Consultation

---

#### `appointment_status`
- status_id (PK)
- status_name (UNIQUE)

**Values**: Scheduled, Confirmed, In Progress, Completed, Cancelled, No Show

---

#### `appointment_reminders`
- reminder_id (PK)
- appointment_id (FK → appointments)
- reminder_type (ENUM: 'SMS', 'Email', 'Phone')
- reminder_date, reminder_time
- sent_status (BOOLEAN)
- sent_at

---

#### `doctor_availability`
- availability_id (PK)
- doctor_id (FK → doctors)
- date
- time_slot_start, time_slot_end
- is_available (BOOLEAN)
- reason_if_unavailable

---

#### `time_slots`
- slot_id (PK)
- slot_time (TIME)
- duration_minutes
- is_active (BOOLEAN)

---

### 4. MEDICAL RECORDS & TREATMENT (10-12 tables)

#### `medical_records`
- record_id (PK)
- patient_id (FK → patients)
- visit_id (FK → patient_visits)
- doctor_id (FK → doctors)
- record_date, record_time
- chief_complaint
- history_of_present_illness
- physical_examination
- assessment
- plan
- created_at, updated_at

---

#### `diagnoses`
- diagnosis_id (PK)
- record_id (FK → medical_records)
- icd_code (International Classification of Diseases)
- diagnosis_name
- diagnosis_type (ENUM: 'Primary', 'Secondary', 'Differential')
- severity
- notes

---

#### `treatments`
- treatment_id (PK)
- record_id (FK → medical_records)
- treatment_name
- treatment_type (ENUM: 'Medication', 'Procedure', 'Therapy', 'Surgery')
- start_date, end_date
- frequency
- instructions
- status (ENUM: 'Ongoing', 'Completed', 'Discontinued')

---

#### `treatment_plans`
- plan_id (PK)
- patient_id (FK → patients)
- doctor_id (FK → doctors)
- plan_name
- start_date, end_date
- goals
- status (ENUM: 'Active', 'Completed', 'Cancelled')
- created_at

---

#### `vital_signs`
- vital_id (PK)
- record_id (FK → medical_records)
- patient_id (FK → patients)
- measurement_date, measurement_time
- temperature, blood_pressure_systolic, blood_pressure_diastolic
- heart_rate, respiratory_rate
- oxygen_saturation, weight, height
- bmi (calculated or stored)
- measured_by (FK → staff)

---

#### `clinical_notes`
- note_id (PK)
- record_id (FK → medical_records)
- note_type (ENUM: 'Progress', 'Nursing', 'Physician', 'Consultation')
- note_text
- created_by (FK → staff)
- created_at

---

#### `progress_notes`
- progress_id (PK)
- patient_id (FK → patients)
- visit_id (FK → patient_visits)
- subjective (patient's description)
- objective (clinical findings)
- assessment
- plan
- created_by (FK → staff)
- created_at

---

#### `discharge_summaries`
- discharge_id (PK)
- patient_id (FK → patients)
- admission_id (FK → admissions)
- discharge_date, discharge_time
- discharge_type (ENUM: 'Routine', 'Against Medical Advice', 'Transfer', 'Death')
- diagnosis_at_discharge
- treatment_summary
- follow_up_instructions
- discharge_physician (FK → doctors)
- created_at

---

#### `surgical_procedures`
- procedure_id (PK)
- patient_id (FK → patients)
- procedure_name
- icd_pcs_code (Procedure Coding System)
- scheduled_date, scheduled_time
- actual_start_time, actual_end_time
- surgeon_id (FK → doctors)
- anesthesiologist_id (FK → doctors)
- procedure_type (ENUM: 'Major', 'Minor')
- status (ENUM: 'Scheduled', 'In Progress', 'Completed', 'Cancelled')
- outcome
- complications

---

#### `anesthesia_records`
- anesthesia_id (PK)
- procedure_id (FK → surgical_procedures)
- anesthesiologist_id (FK → doctors)
- anesthesia_type
- medications_used
- start_time, end_time
- complications
- recovery_notes

---

#### `operation_theater_bookings`
- booking_id (PK)
- procedure_id (FK → surgical_procedures)
- theater_number
- booking_date, booking_time
- duration_minutes
- status (ENUM: 'Booked', 'In Use', 'Completed', 'Cancelled')
- equipment_required (JSON or separate table)

---

### 5. PRESCRIPTIONS & PHARMACY (6-8 tables)

#### `prescriptions`
- prescription_id (PK)
- patient_id (FK → patients)
- doctor_id (FK → doctors)
- visit_id (FK → patient_visits)
- prescription_date
- status (ENUM: 'Active', 'Completed', 'Cancelled')
- instructions
- refills_allowed
- expiry_date
- created_at

---

#### `prescription_items`
- item_id (PK)
- prescription_id (FK → prescriptions)
- medication_id (FK → medications)
- dosage
- frequency
- duration_days
- quantity
- instructions
- status (ENUM: 'Pending', 'Dispensed', 'Cancelled')

---

#### `medications`
- medication_id (PK)
- medication_name (UNIQUE)
- generic_name
- medication_type (ENUM: 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Other')
- strength
- unit (ENUM: 'mg', 'ml', 'g', 'units')
- manufacturer
- price_per_unit
- requires_prescription (BOOLEAN)
- status (ENUM: 'Available', 'Discontinued', 'Out of Stock')

---

#### `medication_inventory`
- inventory_id (PK)
- medication_id (FK → medications)
- batch_number
- expiry_date
- quantity_in_stock
- reorder_level
- supplier_id (FK → pharmacy_suppliers)
- location
- last_restocked_date

---

#### `pharmacy_suppliers`
- supplier_id (PK)
- supplier_name (UNIQUE)
- contact_person
- phone, email
- address
- status (ENUM: 'Active', 'Inactive')

---

#### `medication_interactions`
- interaction_id (PK)
- medication_id_1 (FK → medications)
- medication_id_2 (FK → medications)
- interaction_type (ENUM: 'Severe', 'Moderate', 'Mild')
- description
- recommendation

---

#### `dosage_instructions`
- instruction_id (PK)
- instruction_text (UNIQUE)

**Examples**: "Take with food", "Take on empty stomach", "Take before bedtime", etc.

---

### 6. LABORATORY & DIAGNOSTICS (6-8 tables)

#### `lab_tests`
- test_id (PK)
- test_name (UNIQUE)
- test_code
- category_id (FK → lab_categories)
- description
- normal_range_min, normal_range_max
- unit
- price
- turnaround_time_hours

---

#### `lab_test_orders`
- order_id (PK)
- patient_id (FK → patients)
- doctor_id (FK → doctors)
- visit_id (FK → patient_visits)
- order_date, order_time
- priority (ENUM: 'Routine', 'Urgent', 'STAT')
- status (ENUM: 'Ordered', 'In Progress', 'Completed', 'Cancelled')
- instructions
- ordered_by (FK → staff)

---

#### `lab_results`
- result_id (PK)
- order_id (FK → lab_test_orders)
- test_id (FK → lab_tests)
- result_value
- unit
- reference_range
- status (ENUM: 'Normal', 'Abnormal', 'Critical')
- performed_by (FK → staff)
- verified_by (FK → staff)
- result_date, result_time
- notes

---

#### `lab_categories`
- category_id (PK)
- category_name (UNIQUE)

**Examples**: Hematology, Biochemistry, Microbiology, Immunology, Pathology

---

#### `radiology_orders`
- radiology_order_id (PK)
- patient_id (FK → patients)
- doctor_id (FK → doctors)
- visit_id (FK → patient_visits)
- study_type (ENUM: 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography', 'Other')
- body_part
- order_date, order_time
- priority
- clinical_indication
- status (ENUM: 'Ordered', 'Scheduled', 'In Progress', 'Completed', 'Cancelled')

---

#### `radiology_results`
- result_id (PK)
- radiology_order_id (FK → radiology_orders)
- study_date, study_time
- findings
- impression
- recommendations
- radiologist_id (FK → doctors)
- image_files (JSON or separate table)
- report_date

---

#### `imaging_studies`
- study_id (PK)
- radiology_order_id (FK → radiology_orders)
- study_name
- modality (ENUM: 'X-Ray', 'CT', 'MRI', 'US', 'Nuclear')
- body_part
- contrast_used (BOOLEAN)
- images_count
- storage_path

---

#### `pathology_reports`
- report_id (PK)
- patient_id (FK → patients)
- order_id (FK → lab_test_orders)
- specimen_type
- collection_date
- received_date
- report_date
- gross_description
- microscopic_description
- diagnosis
- pathologist_id (FK → doctors)
- status

---

### 7. BILLING & FINANCE (8-10 tables)

#### `invoices`
- invoice_id (PK)
- invoice_number (UNIQUE)
- patient_id (FK → patients)
- visit_id (FK → patient_visits)
- invoice_date
- due_date
- subtotal
- discount_amount
- tax_amount
- total_amount
- status (ENUM: 'Draft', 'Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')
- created_by (FK → staff)
- created_at

---

#### `invoice_items`
- item_id (PK)
- invoice_id (FK → invoices)
- service_type (ENUM: 'Consultation', 'Lab Test', 'Radiology', 'Medication', 'Procedure', 'Room', 'Other')
- service_id (can reference different tables)
- description
- quantity
- unit_price
- total_price
- billing_code_id (FK → billing_codes)

---

#### `payments`
- payment_id (PK)
- invoice_id (FK → invoices)
- payment_date, payment_time
- amount
- payment_method_id (FK → payment_methods)
- transaction_reference
- received_by (FK → staff)
- notes
- status (ENUM: 'Pending', 'Completed', 'Failed', 'Refunded')

---

#### `payment_methods`
- method_id (PK)
- method_name (UNIQUE)

**Values**: Cash, Credit Card, Debit Card, Bank Transfer, Insurance, Mobile Payment

---

#### `insurance_claims`
- claim_id (PK)
- invoice_id (FK → invoices)
- patient_insurance_id (FK → patient_insurance)
- claim_number (UNIQUE)
- claim_date
- claim_amount
- approved_amount
- status_id (FK → insurance_claim_status)
- submitted_date
- processed_date
- rejection_reason
- notes

---

#### `insurance_claim_status`
- status_id (PK)
- status_name (UNIQUE)

**Values**: Submitted, Under Review, Approved, Partially Approved, Rejected, Paid

---

#### `billing_codes`
- code_id (PK)
- code (UNIQUE) - e.g., CPT codes
- description
- category
- price
- is_active (BOOLEAN)

---

#### `service_charges`
- charge_id (PK)
- service_name (UNIQUE)
- service_type
- base_price
- department_id (FK → departments)
- is_active (BOOLEAN)

---

#### `discounts`
- discount_id (PK)
- invoice_id (FK → invoices)
- discount_type (ENUM: 'Percentage', 'Fixed Amount')
- discount_value
- reason
- approved_by (FK → staff)
- approved_date

---

#### `refunds`
- refund_id (PK)
- payment_id (FK → payments)
- refund_amount
- refund_reason
- refund_date
- processed_by (FK → staff)
- status (ENUM: 'Pending', 'Processed', 'Cancelled')

---

### 8. DEPARTMENT & FACILITY MANAGEMENT (5-6 tables)

#### `departments`
- department_id (PK)
- department_name (UNIQUE)
- department_code
- head_of_department (FK → staff)
- location
- phone, email
- description
- status (ENUM: 'Active', 'Inactive')

---

#### `rooms`
- room_id (PK)
- room_number (UNIQUE)
- department_id (FK → departments)
- room_type (ENUM: 'Ward', 'Private', 'ICU', 'Operation Theater', 'Emergency', 'Consultation')
- capacity
- floor_number
- status (ENUM: 'Available', 'Occupied', 'Maintenance', 'Reserved')

---

#### `beds`
- bed_id (PK)
- room_id (FK → rooms)
- bed_number
- bed_type (ENUM: 'Regular', 'ICU', 'Emergency')
- status (ENUM: 'Available', 'Occupied', 'Maintenance', 'Reserved')

---

#### `bed_assignments`
- assignment_id (PK)
- bed_id (FK → beds)
- patient_id (FK → patients)
- admission_id (FK → admissions)
- assigned_date, assigned_time
- discharged_date, discharged_time
- status (ENUM: 'Active', 'Discharged')

---

#### `equipment`
- equipment_id (PK)
- equipment_name
- equipment_type
- serial_number (UNIQUE)
- department_id (FK → departments)
- manufacturer
- purchase_date
- warranty_expiry
- status (ENUM: 'Available', 'In Use', 'Maintenance', 'Out of Service')
- location

---

#### `equipment_maintenance`
- maintenance_id (PK)
- equipment_id (FK → equipment)
- maintenance_type (ENUM: 'Preventive', 'Corrective', 'Calibration')
- scheduled_date
- performed_date
- performed_by (company/person)
- cost
- notes
- next_maintenance_date
- status (ENUM: 'Scheduled', 'Completed', 'Overdue')

---

### 9. ADDITIONAL HOSPITAL OPERATIONS (4-6 tables)

#### `admissions`
- admission_id (PK)
- patient_id (FK → patients)
- admission_date, admission_time
- admission_type (ENUM: 'Emergency', 'Elective', 'Transfer')
- department_id (FK → departments)
- admitting_doctor_id (FK → doctors)
- diagnosis_on_admission
- expected_discharge_date
- actual_discharge_date
- status (ENUM: 'Admitted', 'Discharged', 'Transferred')

---

#### `discharges`
- discharge_id (PK) - can be same as discharge_summaries or separate
- admission_id (FK → admissions)
- discharge_date, discharge_time
- discharge_type
- discharge_instructions
- follow_up_date
- discharged_by (FK → staff)

---

#### `transfers`
- transfer_id (PK)
- patient_id (FK → patients)
- from_department_id (FK → departments)
- to_department_id (FK → departments)
- from_room_id (FK → rooms)
- to_room_id (FK → rooms)
- transfer_date, transfer_time
- reason
- authorized_by (FK → staff)
- status (ENUM: 'Pending', 'Completed', 'Cancelled')

---

#### `patient_consents`
- consent_id (PK)
- patient_id (FK → patients)
- consent_type (ENUM: 'Treatment', 'Surgery', 'Anesthesia', 'Research', 'Information Sharing')
- consent_date
- consent_status (ENUM: 'Given', 'Refused', 'Pending')
- witness_name
- witness_signature
- document_path
- expires_date

---

#### `incident_reports`
- incident_id (PK)
- incident_date, incident_time
- patient_id (FK → patients) - nullable
- staff_id (FK → staff) - nullable
- incident_type (ENUM: 'Patient Fall', 'Medication Error', 'Equipment Failure', 'Security', 'Other')
- severity (ENUM: 'Minor', 'Moderate', 'Major', 'Critical')
- description
- action_taken
- reported_by (FK → staff)
- status (ENUM: 'Reported', 'Under Investigation', 'Resolved')

---

#### `audit_logs`
- log_id (PK)
- table_name
- record_id
- action (ENUM: 'INSERT', 'UPDATE', 'DELETE')
- old_values (JSON)
- new_values (JSON)
- user_id (FK → staff)
- ip_address
- timestamp

---

## 🎯 YOUR TASKS:

1. **Review this guide** - Understand each table category
2. **Create E-R Diagram** - Use a tool to visualize relationships
3. **Write SQL CREATE statements** - For each table with:
   - Proper data types (INT, VARCHAR, DATE, DATETIME, ENUM, etc.)
   - Primary keys
   - Foreign keys with ON DELETE/UPDATE rules
   - Constraints (UNIQUE, NOT NULL, CHECK)
   - Indexes for performance
4. **Test your schema** - Create the database and verify relationships
5. **Add sample data** - Insert test records to validate your design

---

## 💡 Tips:

- Use appropriate data types (don't use VARCHAR for dates!)
- Add indexes on foreign keys and frequently queried columns
- Use ENUM for fixed value sets
- Consider soft deletes (status fields) instead of hard deletes
- Add created_at and updated_at timestamps where relevant
- Normalize properly but don't over-normalize
- Consider future scalability

---

## 📝 Next Steps After Database Creation:

1. Test all relationships
2. Write the required queries (from project requirements)
3. Create views for complex queries
4. Set up stored procedures if needed
5. Document your schema

Good luck! 🚀

