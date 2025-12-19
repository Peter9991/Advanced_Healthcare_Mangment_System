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
- **`chatbot.service.ts`** - AI-powered chatbot for patient assistance

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

## Chatbot Service

The `chatbot.service.ts` provides AI-powered conversational assistance for patients. It integrates with Groq AI to deliver natural language understanding and automated appointment booking.

### Features

- **Natural Language Processing**: Understands patient queries in conversational language
- **Appointment Booking**: Automated scheduling with doctor availability checking
- **Medical Guidance**: Symptom-based recommendations with appropriate disclaimers
- **Bilingual Support**: Handles English and Arabic automatically

### Usage Example

```typescript
import { chatbotService } from '../services/chatbot.service';

// Send message to chatbot
const response = await chatbotService.sendMessage("I want to book with dr noha at 13:00 tomorrow");

// Response includes:
// - message: AI-generated response text
// - action: Optional appointment booking data (if applicable)
if (response.action?.type === 'book_appointment') {
  // Navigate to booking page with pre-filled data
  navigate('/patient/book-appointment', { state: response.action.data });
}
```

### Response Structure

```typescript
interface ChatbotResponse {
  message: string;  // AI-generated response
  action?: {
    type: 'book_appointment';
    data: {
      doctor_id: number;
      doctor_name: string;
      appointment_date: string;
      appointment_time: string;
      reason?: string;
    };
  };
}
```

