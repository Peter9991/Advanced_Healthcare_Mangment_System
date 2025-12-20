# Healthcare Management System Database

Comprehensive database schema for a healthcare management system with 73 tables covering patient management, appointments, medical records, prescriptions, billing, and facilities.

## Structure

- **schema/** - Database schema files (73 tables)
- **queries/** - SQL queries and views
- **databse_Values/** - Seed data for testing
- **AWS_RDS_DEPLOYMENT.md** - Complete guide for deploying to Amazon RDS
- **rds_deploy_schema.sql** - Combined schema script for RDS deployment

## Local Development Schema Files

Execute in order:
1. `00_create_database.sql`
2. `01_hms_doctors_staff_tables.sql`
3. `02_hms_patients_tables.sql`
4. `03_hms_appointments_tables.sql`
5. `04_hms_medical_records_tables.sql`
6. `05_hms_prescriptions_tables.sql`
7. `06_hms_lab_diagnostics_tables.sql`
8. `07_hms_billing_tables.sql`
9. `08_hms_facilities_tables.sql`
