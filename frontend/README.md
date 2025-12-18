# Healthcare Management System - Frontend

A modern, responsive web application for managing healthcare operations, built with React, TypeScript, and Vite. This frontend provides role-based access control for patients, doctors, nurses, pharmacists, and administrative staff.

## 🚀 Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router DOM 6.26** - Client-side routing
- **Axios 1.7** - HTTP client
- **CSS3** - Styling (no UI framework)

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   └── hms_Pic.jpg        # Home page image
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx    # Main layout with sidebar
│   │   ├── ProtectedRoute.tsx
│   │   ├── AdminOnlyRoute.tsx
│   │   ├── DoctorOnlyRoute.tsx
│   │   └── LanguageToggle.tsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── common/       # Public pages (Home)
│   │   ├── patient/      # Patient-facing pages
│   │   └── staff/        # Staff-facing pages
│   ├── services/         # API service layer
│   │   ├── api.ts       # Axios instance & interceptors
│   │   └── *.service.ts # Domain-specific services
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root component & routing
│   └── main.tsx         # Entry point
├── package.json
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Patient     │  │    Staff      │  │    Admin     │     │
│  │   Portal      │  │    Portal     │  │   Portal     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Route Protection Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Protected    │  │  AdminOnly   │  │  DoctorOnly  │     │
│  │    Route      │  │    Route     │  │    Route     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Context Providers                        │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Auth       │  │  Language    │                        │
│  │  Context     │  │  Context     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  API Client  │  │   Services   │  │   Types      │     │
│  │   (Axios)    │  │   (REST)     │  │  (TS Defs)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Backend API │
                    │  (Port 5000) │
                    └──────────────┘
```

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC)**
  - Admin: Full system access
  - Doctor: Patient management, prescriptions, medical records
  - Nurse: Patient care, appointments
  - Pharmacist: Prescription management
  - Receptionist: Appointments, billing
  - Patient: Self-service portal

### 🌐 Internationalization
- English/Arabic language support
- RTL (Right-to-Left) layout for Arabic
- Language toggle component

### 📱 Responsive Design
- Mobile-first approach
- Modern, clean UI
- Accessible components

### 🎯 Core Modules
- **Patient Management**: Registration, profiles, medical history
- **Appointment Scheduling**: Booking, management, status tracking
- **Prescription Management**: Create, view, refill prescriptions
- **Medical Records**: Digital health records
- **Lab Results**: Test orders and results
- **Billing & Invoicing**: Financial management
- **Doctor Dashboard**: Personal stats, earnings, patients
- **Facilities Management**: Room and resource management

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Vite Configuration
- **Port**: 3000 (configurable in `vite.config.ts`)
- **API Proxy**: `/api` requests proxy to `http://localhost:5000`
- **Path Alias**: `@/` maps to `src/`

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🗂️ Module Details

### Pages Structure

#### Patient Pages (`/patient/*`)
- **Dashboard**: Personal health overview, appointments count
- **Book Appointment**: Schedule appointments with doctors
- **My Appointments**: View and manage appointments

#### Staff Pages (`/dashboard/*`)
- **Dashboard** (Admin only): System overview, quick actions
- **Patients**: Patient directory and management
- **Doctors**: Doctor directory and management
- **Appointments**: Appointment scheduling and management
- **Prescriptions**: Prescription creation and tracking
- **Medical Records**: Digital health records
- **Lab Results**: Laboratory test management
- **Billing**: Invoice and payment management
- **Facilities**: Room and resource management

#### Doctor-Specific Pages
- **My Appointments**: Doctor's appointment schedule
- **My Patients**: Doctor's patient list
- **My Earnings**: Revenue from completed appointments

### Service Layer

All API communication is handled through service modules:
- `api.ts`: Axios instance with interceptors for auth tokens
- `*.service.ts`: Domain-specific services (patients, appointments, etc.)

### Route Protection

- **ProtectedRoute**: Requires authentication
- **AdminOnlyRoute**: Admin access only
- **DoctorOnlyRoute**: Doctor access only
- **PatientProtectedRoute**: Patient access only

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to GitHub Pages

1. Install `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t hms-frontend .
docker run -p 80:80 hms-frontend
```

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes with role-based access
- API request interceptors for auth headers
- Secure HTTP-only cookie support (if configured)

## 🌍 Internationalization

The app supports English and Arabic:
- Language toggle in header
- RTL layout for Arabic
- Translated menu items and labels
- Context-based language switching

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Functional components with hooks
- Service layer pattern for API calls

### Adding New Features

1. **New Page**: Add to `src/pages/` and register route in `App.tsx`
2. **New Service**: Create in `src/services/` following existing patterns
3. **New Component**: Add to `src/components/` if reusable
4. **New Type**: Add to `src/types/index.ts`

### Path Aliases
Use `@/` prefix for imports from `src/`:
```typescript
import { useAuth } from '@/context/AuthContext';
import { patientService } from '@/services/patient.service';
```

## 🐛 Troubleshooting

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to available port
}
```

### API Connection Issues
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Verify API base URL in `.env`

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

This project is part of the Healthcare Management System.

## 👥 Contributing

1. Follow TypeScript strict mode guidelines
2. Use functional components and hooks
3. Maintain service layer pattern
4. Add proper TypeScript types
5. Test route protection for new pages

---

**Built with ❤️ for healthcare management**
