# Services Directory

## What Are Services?

Services are **API communication layers** that handle all interactions between the frontend and backend. They act as a bridge between your React components and the server.

## Purpose

1. **Centralize API Logic**: All HTTP requests are in one place
2. **Type Safety**: Provide TypeScript types for requests/responses
3. **Error Handling**: Standardized error handling
4. **Reusability**: Components can use the same service methods
5. **Maintainability**: Easy to update API endpoints in one place

## How They Work

### Example Flow:

```
Component → Service → API → Backend → Database
         ←         ←     ←          ←
```

1. **Component** calls `patientService.getAll()`
2. **Service** makes HTTP GET request to `/api/patients`
3. **Backend** processes request and queries database
4. **Service** receives response and formats data
5. **Component** gets clean, typed data

## Service Structure

Each service file exports an object with methods:

```typescript
export const patientService = {
  getAll: async (params) => { /* GET request */ },
  getById: async (id) => { /* GET request */ },
  create: async (data) => { /* POST request */ },
  update: async (id, data) => { /* PUT request */ },
  delete: async (id) => { /* DELETE request */ }
};
```

## Available Services

- **`api.ts`** - Base axios instance with interceptors (adds auth tokens, handles errors)
- **`auth.service.ts`** - Staff authentication (login, logout, get current user)
- **`patientAuth.service.ts`** - Patient authentication
- **`patient.service.ts`** - Patient CRUD operations
- **`doctor.service.ts`** - Doctor data fetching
- **`appointment.service.ts`** - Appointment management
- **`prescription.service.ts`** - Prescription operations
- **`medicalRecord.service.ts`** - Medical records
- **`labResult.service.ts`** - Lab results and orders
- **`billing.service.ts`** - Invoice management
- **`facility.service.ts`** - Room and facility data

## Usage in Components

```typescript
import { patientService } from '../services/patient.service';

// In component
const fetchPatients = async () => {
  try {
    const data = await patientService.getAll({ page: 1, limit: 20 });
    setPatients(data.data);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
  }
};
```

## Benefits

- **Separation of Concerns**: Components focus on UI, services handle data
- **Testing**: Easy to mock services for testing
- **Consistency**: All API calls follow the same pattern
- **Type Safety**: TypeScript ensures correct data types

