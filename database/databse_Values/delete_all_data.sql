-- Delete All Seed Data
USE HMS_Database;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Delete data from all tables (in reverse dependency order)
-- Start with child tables first, then parent tables

-- Facilities & Additional Tables
DELETE FROM bed_assignments;
DELETE FROM beds;
DELETE FROM rooms;
DELETE FROM equipment_maintenance;
DELETE FROM equipment;
DELETE FROM patient_consents;
DELETE FROM incident_reports;
DELETE FROM audit_logs;

-- Billing Tables
DELETE FROM refunds;
DELETE FROM discounts;
DELETE FROM insurance_claims;
DELETE FROM insurance_claim_status;
DELETE FROM payments;
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM service_charges;
DELETE FROM billing_codes;
DELETE FROM payment_methods;

-- Lab & Diagnostics Tables
DELETE FROM pathology_reports;
DELETE FROM imaging_studies;
DELETE FROM radiology_results;
DELETE FROM radiology_orders;
DELETE FROM lab_results;
DELETE FROM lab_test_order_items;
DELETE FROM lab_test_orders;
DELETE FROM lab_tests;
DELETE FROM lab_categories;

-- Prescriptions Tables
DELETE FROM prescription_items;
DELETE FROM prescriptions;
DELETE FROM medication_interactions;
DELETE FROM medication_inventory;
DELETE FROM dosage_instructions;
DELETE FROM pharmacy_suppliers;
DELETE FROM medications;

-- Medical Records Tables
DELETE FROM transfers;
DELETE FROM operation_theater_bookings;
DELETE FROM anesthesia_records;
DELETE FROM surgical_procedures;
DELETE FROM discharge_summaries;
DELETE FROM admissions;
DELETE FROM progress_notes;
DELETE FROM clinical_notes;
DELETE FROM vital_signs;
DELETE FROM treatment_plans;
DELETE FROM treatments;
DELETE FROM diagnoses;
DELETE FROM medical_records;

-- Appointments Tables
DELETE FROM doctor_availability;
DELETE FROM appointment_reminders;
DELETE FROM appointments;
DELETE FROM time_slots;
DELETE FROM appointment_status;
DELETE FROM appointment_types;

-- Patient Tables
DELETE FROM patient_visits;
DELETE FROM patient_documents;
DELETE FROM patient_emergency_contacts;
DELETE FROM patient_allergies;
DELETE FROM patient_medical_history;
DELETE FROM patient_insurance;
DELETE FROM patient_contacts;
DELETE FROM patients;
DELETE FROM insurance_providers;

-- Doctors & Staff Tables
DELETE FROM staff_shifts;
DELETE FROM doctor_schedules;
DELETE FROM doctor_qualifications;
DELETE FROM doctors;
DELETE FROM doctor_specialties;
DELETE FROM staff;
DELETE FROM departments;
DELETE FROM staff_roles;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset AUTO_INCREMENT counters to start from 1
ALTER TABLE bed_assignments AUTO_INCREMENT = 1;
ALTER TABLE beds AUTO_INCREMENT = 1;
ALTER TABLE rooms AUTO_INCREMENT = 1;
ALTER TABLE equipment_maintenance AUTO_INCREMENT = 1;
ALTER TABLE equipment AUTO_INCREMENT = 1;
ALTER TABLE patient_consents AUTO_INCREMENT = 1;
ALTER TABLE incident_reports AUTO_INCREMENT = 1;
ALTER TABLE audit_logs AUTO_INCREMENT = 1;
ALTER TABLE refunds AUTO_INCREMENT = 1;
ALTER TABLE discounts AUTO_INCREMENT = 1;
ALTER TABLE insurance_claims AUTO_INCREMENT = 1;
ALTER TABLE insurance_claim_status AUTO_INCREMENT = 1;
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE invoice_items AUTO_INCREMENT = 1;
ALTER TABLE invoices AUTO_INCREMENT = 1;
ALTER TABLE service_charges AUTO_INCREMENT = 1;
ALTER TABLE billing_codes AUTO_INCREMENT = 1;
ALTER TABLE payment_methods AUTO_INCREMENT = 1;
ALTER TABLE pathology_reports AUTO_INCREMENT = 1;
ALTER TABLE imaging_studies AUTO_INCREMENT = 1;
ALTER TABLE radiology_results AUTO_INCREMENT = 1;
ALTER TABLE radiology_orders AUTO_INCREMENT = 1;
ALTER TABLE lab_results AUTO_INCREMENT = 1;
ALTER TABLE lab_test_order_items AUTO_INCREMENT = 1;
ALTER TABLE lab_test_orders AUTO_INCREMENT = 1;
ALTER TABLE lab_tests AUTO_INCREMENT = 1;
ALTER TABLE lab_categories AUTO_INCREMENT = 1;
ALTER TABLE prescription_items AUTO_INCREMENT = 1;
ALTER TABLE prescriptions AUTO_INCREMENT = 1;
ALTER TABLE medication_interactions AUTO_INCREMENT = 1;
ALTER TABLE medication_inventory AUTO_INCREMENT = 1;
ALTER TABLE dosage_instructions AUTO_INCREMENT = 1;
ALTER TABLE pharmacy_suppliers AUTO_INCREMENT = 1;
ALTER TABLE medications AUTO_INCREMENT = 1;
ALTER TABLE transfers AUTO_INCREMENT = 1;
ALTER TABLE operation_theater_bookings AUTO_INCREMENT = 1;
ALTER TABLE anesthesia_records AUTO_INCREMENT = 1;
ALTER TABLE surgical_procedures AUTO_INCREMENT = 1;
ALTER TABLE discharge_summaries AUTO_INCREMENT = 1;
ALTER TABLE admissions AUTO_INCREMENT = 1;
ALTER TABLE progress_notes AUTO_INCREMENT = 1;
ALTER TABLE clinical_notes AUTO_INCREMENT = 1;
ALTER TABLE vital_signs AUTO_INCREMENT = 1;
ALTER TABLE treatment_plans AUTO_INCREMENT = 1;
ALTER TABLE treatments AUTO_INCREMENT = 1;
ALTER TABLE diagnoses AUTO_INCREMENT = 1;
ALTER TABLE medical_records AUTO_INCREMENT = 1;
ALTER TABLE doctor_availability AUTO_INCREMENT = 1;
ALTER TABLE appointment_reminders AUTO_INCREMENT = 1;
ALTER TABLE appointments AUTO_INCREMENT = 1;
ALTER TABLE time_slots AUTO_INCREMENT = 1;
ALTER TABLE appointment_status AUTO_INCREMENT = 1;
ALTER TABLE appointment_types AUTO_INCREMENT = 1;
ALTER TABLE patient_visits AUTO_INCREMENT = 1;
ALTER TABLE patient_documents AUTO_INCREMENT = 1;
ALTER TABLE patient_emergency_contacts AUTO_INCREMENT = 1;
ALTER TABLE patient_allergies AUTO_INCREMENT = 1;
ALTER TABLE patient_medical_history AUTO_INCREMENT = 1;
ALTER TABLE patient_insurance AUTO_INCREMENT = 1;
ALTER TABLE patient_contacts AUTO_INCREMENT = 1;
ALTER TABLE patients AUTO_INCREMENT = 1;
ALTER TABLE insurance_providers AUTO_INCREMENT = 1;
ALTER TABLE staff_shifts AUTO_INCREMENT = 1;
ALTER TABLE doctor_schedules AUTO_INCREMENT = 1;
ALTER TABLE doctor_qualifications AUTO_INCREMENT = 1;
ALTER TABLE doctors AUTO_INCREMENT = 1;
ALTER TABLE doctor_specialties AUTO_INCREMENT = 1;
ALTER TABLE staff AUTO_INCREMENT = 1;
ALTER TABLE departments AUTO_INCREMENT = 1;
ALTER TABLE staff_roles AUTO_INCREMENT = 1;

SELECT 'All seed data has been deleted and AUTO_INCREMENT counters reset!' AS Status;

