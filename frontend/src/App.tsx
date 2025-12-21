import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DoctorOnlyRoute } from './components/DoctorOnlyRoute'
import { AdminOnlyRoute } from './components/AdminOnlyRoute'
import { DatabaseAdminOnlyRoute } from './components/DatabaseAdminOnlyRoute'
import Layout from './components/Layout'
import PatientProtectedRoute from './components/PatientProtectedRoute'

// Auth & Common Pages
import HomePage from './pages/common/HomePage'
import LoginPage from './pages/auth/LoginPage'
import PatientLoginPage from './pages/auth/PatientLoginPage'

// Patient Pages
import PatientDashboardPage from './pages/patient/PatientDashboardPage'
import PatientBookAppointmentPage from './pages/patient/PatientBookAppointmentPage'
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage'

// Staff Pages
import DashboardPage from './pages/staff/DashboardPage'
import PatientsPage from './pages/staff/patients/PatientsPage'
import NewPatientPage from './pages/staff/patients/NewPatientPage'
import DoctorsPage from './pages/staff/doctors/DoctorsPage'
import NewDoctorPage from './pages/staff/doctors/NewDoctorPage'
import AppointmentsPage from './pages/staff/appointments/AppointmentsPage'
import NewAppointmentPage from './pages/staff/appointments/NewAppointmentPage'
import PrescriptionsPage from './pages/staff/prescriptions/PrescriptionsPage'
import NewPrescriptionPage from './pages/staff/prescriptions/NewPrescriptionPage'
import MedicalRecordsPage from './pages/staff/medical-records/MedicalRecordsPage'
import LabResultsPage from './pages/staff/lab-results/LabResultsPage'
import NewLabOrderPage from './pages/staff/lab-results/NewLabOrderPage'
import BillingPage from './pages/staff/billing/BillingPage'
import FacilitiesPage from './pages/staff/facilities/FacilitiesPage'
import NewFacilityPage from './pages/staff/facilities/NewFacilityPage'
import MyAppointmentsPage from './pages/staff/doctors/MyAppointmentsPage'
import MyPatientsPage from './pages/staff/doctors/MyPatientsPage'
import MyEarningsPage from './pages/staff/doctors/MyEarningsPage'
import DatabaseAdminPage from './pages/staff/database-admin/DatabaseAdminPage'

import './App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/patient/login" element={<PatientLoginPage />} />
            <Route
              path="/patient/dashboard"
              element={
                <PatientProtectedRoute>
                  <PatientDashboardPage />
                </PatientProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment"
              element={
                <PatientProtectedRoute>
                  <PatientBookAppointmentPage />
                </PatientProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <PatientProtectedRoute>
                  <PatientAppointmentsPage />
                </PatientProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AdminOnlyRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/dashboard/patients"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PatientsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/patients/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewPatientPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctors"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DoctorsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctors/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewDoctorPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/appointments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AppointmentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/appointments/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewAppointmentPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/prescriptions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PrescriptionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/prescriptions/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewPrescriptionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/medical-records"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicalRecordsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lab-results"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LabResultsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lab-results/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewLabOrderPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/billing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BillingPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/facilities"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FacilitiesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/facilities/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewFacilityPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-appointments"
              element={
                <DoctorOnlyRoute>
                  <Layout>
                    <MyAppointmentsPage />
                  </Layout>
                </DoctorOnlyRoute>
              }
            />
            <Route
              path="/dashboard/my-patients"
              element={
                <DoctorOnlyRoute>
                  <Layout>
                    <MyPatientsPage />
                  </Layout>
                </DoctorOnlyRoute>
              }
            />
            <Route
              path="/dashboard/my-earnings"
              element={
                <DoctorOnlyRoute>
                  <Layout>
                    <MyEarningsPage />
                  </Layout>
                </DoctorOnlyRoute>
              }
            />
            <Route
              path="/dashboard/database-admin"
              element={
                <DatabaseAdminOnlyRoute>
                  <Layout>
                    <DatabaseAdminPage />
                  </Layout>
                </DatabaseAdminOnlyRoute>
              }
            />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
