# Pages Directory Structure

## Organization

Pages are organized by **user type** and **functional area** for better maintainability and clarity.

## Directory Structure

```
pages/
├── auth/                    # Authentication pages
│   ├── LoginPage.tsx        # Staff login
│   ├── LoginPage.css
│   └── PatientLoginPage.tsx # Patient login
│
├── common/                  # Shared/public pages
│   ├── HomePage.tsx         # Landing page
│   └── HomePage.css
│
├── patient/                 # Patient-facing pages
│   ├── PatientDashboardPage.tsx
│   ├── PatientDashboardPage.css
│   ├── PatientBookAppointmentPage.tsx
│   ├── PatientBookAppointmentPage.css
│   ├── PatientAppointmentsPage.tsx
│   └── PatientAppointmentsPage.css
│
└── staff/                   # Staff/admin pages
    ├── DashboardPage.tsx    # Main dashboard
    ├── DashboardPage.css
    │
    ├── patients/            # Patient management
    │   ├── PatientsPage.tsx
    │   ├── PatientsPage.css
    │   └── NewPatientPage.tsx
    │
    ├── doctors/             # Doctor management
    │   └── DoctorsPage.tsx
    │
    ├── appointments/        # Appointment management
    │   ├── AppointmentsPage.tsx
    │   └── NewAppointmentPage.tsx
    │
    ├── prescriptions/       # Prescription management
    │   ├── PrescriptionsPage.tsx
    │   └── NewPrescriptionPage.tsx
    │
    ├── medical-records/     # Medical records
    │   └── MedicalRecordsPage.tsx
    │
    ├── lab-results/         # Lab results & orders
    │   ├── LabResultsPage.tsx
    │   └── NewLabOrderPage.tsx
    │
    ├── billing/             # Billing & invoices
    │   └── BillingPage.tsx
    │
    └── facilities/         # Facilities & rooms
        └── FacilitiesPage.tsx
```

## Benefits

1. **Clear Organization**: Related pages are grouped together
2. **Easy Navigation**: Find pages quickly by function
3. **Scalability**: Easy to add new pages in the right folder
4. **Maintainability**: Changes to one area don't affect others
5. **Team Collaboration**: Different developers can work on different sections

## Import Paths

When importing pages in `App.tsx`:

```typescript
// Auth pages
import LoginPage from './pages/auth/LoginPage'
import PatientLoginPage from './pages/auth/PatientLoginPage'

// Patient pages
import PatientDashboardPage from './pages/patient/PatientDashboardPage'

// Staff pages
import PatientsPage from './pages/staff/patients/PatientsPage'
import NewPatientPage from './pages/staff/patients/NewPatientPage'
```

## CSS Files

- Each page can have its own CSS file (co-located)
- Shared styles use relative imports: `import '../patients/PatientsPage.css'`
- Patient pages have their own CSS files
- Staff pages share common styles from `staff/patients/PatientsPage.css`

