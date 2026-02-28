# 🧪 Complete Testing & Seeding Guide

## Quick Start - Use Demo Credentials

### Login Options:

#### **Patient Login**

- **URL:** http://localhost:5174/login
- **Select:** Patient (toggle)
- **Email:** patient@clinic.com
- **Password:** Patient@123

#### **Doctor Login**

- **URL:** http://localhost:5174/login
- **Select:** Doctor (toggle)
- **Email:** doctor@clinic.com
- **Password:** Doctor@123

#### **Receptionist Login**

- **URL:** http://localhost:5174/login
- **Select:** Receptionist (toggle)
- **Email:** receptionist@clinic.com
- **Password:** Receptionist@123

#### **Admin Login**

- **URL:** http://localhost:5174/admin/login
- **Email:** admin@clinic.com
- **Password:** Admin@123

---

## Setup Instructions (First Time)

### Step 1: Register Patient Account (Optional - Demo credentials exist)

**Request:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "patient@clinic.com",
    "password": "Patient@123"
  }'
```

### Step 2: Login as Admin

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@clinic.com",
    "password": "Admin@123"
  }'
```

### Step 3: Create Doctor (As Admin)

```bash
curl -X POST http://localhost:5000/api/v1/staff/register \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Dr. Sarah Smith",
    "email": "doctor@clinic.com",
    "password": "Doctor@123",
    "role": "doctor",
    "specialization": "Cardiology",
    "licenseNumber": "LIC-CARD-001",
    "qualifications": "MD, MBBS, DM Cardiology",
    "experience": 8,
    "consultationFee": 500
  }'
```

### Step 4: Create Receptionist (As Admin)

```bash
curl -X POST http://localhost:5000/api/v1/staff/register \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Sarah Johnson",
    "email": "receptionist@clinic.com",
    "password": "Receptionist@123",
    "role": "receptionist",
    "department": "General",
    "phone": "+1-555-123-4567"
  }'
```

---

## Testing User Flows

### Flow 1: Patient Books Appointment

1. **Login as Patient**
   - Go to http://localhost:5174/login
   - Select "Patient"
   - Click Sign In (credentials auto-filled)

2. **Navigate to Dashboard**
   - You'll be redirected to `/patient/dashboard`
   - Click "Book Appointment"

3. **Select Doctor & Date**
   - Choose doctor
   - Select date
   - Pick available slot
   - Confirm booking

### Flow 2: Doctor Views Appointments

1. **Login as Doctor**
   - Go to http://localhost:5174/login
   - Select "Doctor"
   - Click Sign In

2. **View Dashboard**
   - See today's appointments
   - View patient details
   - Add diagnosis/prescription

### Flow 3: Receptionist Checks In Patients

1. **Login as Receptionist**
   - Go to http://localhost:5174/login
   - Select "Receptionist"
   - Click Sign In

2. **Navigate to Check-In**
   - Click dropdown → Check-In
   - See today's appointments
   - Click "Check In" for each patient

### Flow 4: Admin Manages Staff

1. **Login as Admin**
   - Go to http://localhost:5174/admin/login
   - Use admin credentials

2. **Navigate to Manage Staff**
   - Click dropdown → Manage Staff
   - View all doctors
   - Click "Add Doctor" button
   - Fill form and submit
   - Same for receptionists

---

## API Endpoints Reference

### Authentication

- `POST /api/v1/auth/register` - Register patient
- `POST /api/v1/auth/login` - Login any user
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Staff Management (Admin Only)

- `POST /api/v1/staff/register` - Register doctor/receptionist
- `GET /api/v1/staff/doctors` - Get all doctors
- `GET /api/v1/staff/receptionists` - Get all receptionists
- `GET /api/v1/staff/analytics/system` - System analytics
- `POST /api/v1/staff/:staffId/verify` - Verify staff
- `POST /api/v1/staff/:staffId/deactivate` - Deactivate staff

### Appointments

- `POST /api/v1/appointments/book` - Book appointment
- `GET /api/v1/appointments` - Get appointments (role-based)
- `GET /api/v1/appointments/available-slots` - Get available slots
- `PATCH /api/v1/appointments/:id/status` - Update appointment status
- `POST /api/v1/appointments/:id/cancel` - Cancel appointment

### Diagnosis & Prescriptions

- `POST /api/v1/diagnosis` - Add diagnosis
- `POST /api/v1/prescriptions` - Create prescription
- `POST /api/v1/diagnosis/ai/analysis` - AI analysis

---

## Database Statistics

After seeding with demo data, your database should have:

```
Users Collection:
- 1 Admin
- 1 Patient
- 2 Doctors
- 1 Receptionist

StaffProfile Collection:
- 2 Doctor profiles (with specialization, license, etc.)
- 1 Receptionist profile

Appointments (will be created as they're booked):
- Initially empty, gets populated as patients book
```

---

## Environment Variables Recap

**Backend (.env):**

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://devtalha:Talha123@cluster.ydjksgw.mongodb.net/hackathon
JWT_ACCESS_SECRET=talha123
JWT_REFRESH_SECRET=talha123
CLIENT_URL=http://localhost:5174
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:5000
```

---

## Troubleshooting

### "401 Unauthorized" when accessing protected routes

- ✅ Check if user is logged in
- ✅ Verify cookies are being sent (check Network tab in DevTools)
- ✅ Check token expiry and refresh if needed

### "Cannot access this dashboard" error

- ✅ Wrong role for the route (patient trying to access doctor dashboard)
- ✅ Check user role in Redux store (DevTools → Redux tab)

### "Email already exists" error

- ✅ User already registered
- ✅ Clear database or use different email

### API calls failing with HTML response

- ✅ Backend not running - start with `npm start` in backend folder
- ✅ Check CORS settings in backend .env
- ✅ Verify VITE_API_URL in frontend .env

---

## Testing Checklist

- [ ] Patient login works
- [ ] Doctor login works
- [ ] Receptionist login works
- [ ] Admin login works
- [ ] Role-based redirects to correct dashboard
- [ ] Patient can book appointment
- [ ] Doctor can view appointments
- [ ] Receptionist can check in patients
- [ ] Admin can add doctors
- [ ] Admin can add receptionists
- [ ] Header dropdown shows role-specific options
- [ ] Logout clears session
- [ ] Cannot access protected routes without login
