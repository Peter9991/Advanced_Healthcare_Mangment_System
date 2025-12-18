# Database Directory

This directory contains all database-related files for the Healthcare Management System.

## 📁 Directory Structure

```
database/
├── schema/              # SQL schema files
│   ├── 01_create_database.sql
│   ├── 02_patients_tables.sql
│   ├── 03_doctors_staff_tables.sql
│   ├── 04_appointments_tables.sql
│   ├── 05_medical_records_tables.sql
│   ├── 06_prescriptions_tables.sql
│   ├── 07_lab_diagnostics_tables.sql
│   ├── 08_billing_tables.sql
│   ├── 09_departments_facilities_tables.sql
│   ├── 10_additional_tables.sql
│   └── 11_indexes_views.sql
├── migrations/          # Database migration scripts (for future use)
├── seeds/               # Sample data for testing
│   └── sample_data.sql
├── queries/             # Required queries and stored procedures
│   └── required_queries.sql
└── DATABASE_DESIGN_GUIDE.md  # Complete design guide
```

## 🚀 Getting Started

### Step 1: Review the Design Guide
Read `DATABASE_DESIGN_GUIDE.md` to understand all table structures.

### Step 2: Create Your Database Schema
1. Start with `schema/01_create_database.sql` to create the database
2. Create tables following the guide
3. You can create separate SQL files for each category or one large file

### Step 3: Add Indexes and Constraints
- Add foreign key constraints
- Create indexes for performance
- Add check constraints where needed

### Step 4: Insert Sample Data
- Create sample data in `seeds/sample_data.sql`
- Test your database with realistic data

### Step 5: Write Required Queries
- Implement the 4 required queries (see `QUERIES_REQUIREMENTS.md`)
- Test each query thoroughly

## 📝 SQL File Naming Convention

Use numbered prefixes to ensure correct execution order:
- `01_` - Database creation
- `02_` - Core tables (patients, etc.)
- `03_` - Staff and doctor tables
- `04_` - Appointments
- `05_` - Medical records
- `06_` - Prescriptions
- `07_` - Lab and diagnostics
- `08_` - Billing
- `09_` - Departments and facilities
- `10_` - Additional operations
- `11_` - Indexes, views, stored procedures

## 🔧 MySQL Commands Reference

### Connect to MySQL
```bash
mysql -u root -p
```

### Create Database
```sql
CREATE DATABASE healthcare_management_system;
USE healthcare_management_system;
```

### Run SQL File
```bash
mysql -u root -p healthcare_management_system < schema/01_create_database.sql
```

### Export Database
```bash
mysqldump -u root -p healthcare_management_system > backup.sql
```

### Import Database
```bash
mysql -u root -p healthcare_management_system < backup.sql
```

## ✅ Checklist

- [ ] Database created
- [ ] All 50+ tables created
- [ ] Foreign keys defined
- [ ] Indexes added
- [ ] Sample data inserted
- [ ] Required queries written and tested
- [ ] Database backed up

## 📚 Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Data Types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
- [MySQL Foreign Keys](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)

