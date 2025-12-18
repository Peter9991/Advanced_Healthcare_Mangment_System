# Healthcare Management System

A comprehensive Healthcare Management System inspired by Saudi German Hospital, built with React, Node.js, and MySQL.

## 🏥 Project Overview

This system manages:
- Patient records and medical history
- Doctor schedules and appointments
- Medical records and prescriptions
- Laboratory tests and diagnostics
- Billing and insurance claims
- Hospital departments and facilities

## 🛠️ Tech Stack

- **Frontend**: React + JavaScript
- **Backend**: Node.js + Express
- **Database**: MySQL (AWS RDS)
- **Authentication**: JWT
- **Deployment**: AWS + GitHub Pages

## 📁 Project Structure

```
healthcare-management-system/
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seeds/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── docs/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL (or AWS RDS)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd healthcare-management-system
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up database
- Create MySQL database
- Run schema scripts from `database/schema/`
- Configure connection in `backend/config/database.js`

5. Configure environment variables
- Copy `.env.example` to `.env`
- Update with your database credentials

6. Run the application
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm start
```

## 📊 Database Schema

The database consists of 50+ tables covering:
- Patient Management
- Doctor & Staff Management
- Appointments & Scheduling
- Medical Records & Treatment
- Prescriptions & Pharmacy
- Laboratory & Diagnostics
- Billing & Finance
- Department & Facility Management

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Role-based access control

## 📝 License

This project is for educational purposes.

## 👥 Contributors

- [Your Name]

---

**Status**: In Development 🚧

