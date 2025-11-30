# Employee Attendance System

Full-stack employee attendance tracking platform built with React, Redux Toolkit, Express, and MongoDB. The application supports two roles:

- **Employee** – register, check in/out, review history, and track monthly summaries.
- **Manager** – oversee team attendance, filter records, review dashboards, and export CSV reports.

## Tech Stack

- **Frontend:** React 19, Redux Toolkit, React Router, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT authentication
- **Tooling:** Vite, ESLint, Nodemon

## Project Structure

```
tap-academy/
├── src/               # React application
├── public/            # Static assets
├── server/            # Express API
├── .env.example       # Environment variable template
├── package.json       # Frontend dependencies/scripts
└── README.md
```

Backend directories:

```
server/
├── src/
│   ├── config/        # Database connection
│   ├── controllers/   # Express route handlers
│   ├── middleware/    # Auth + error handling
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API route definitions
│   ├── seed/          # Seed data scripts
│   └── utils/         # Helpers (CSV builder, dates)
└── package.json       # Backend dependencies/scripts
```

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/<your-org>/attendance-platform.git
cd tap-academy

# Frontend deps
npm install

# Backend deps
cd server
npm install
```

### 2. Environment variables

Create a `.env` file in both the project root and `server/` directory. Use `.env.example` as the template:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tap-attendance
JWT_SECRET=replace-with-secure-secret
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5173
OFFICE_START_HOUR=9
LATE_THRESHOLD_MINUTES=15

VITE_API_URL=http://localhost:5000/api
```

### 3. Seed development data

```bash
cd server
npm run seed
```

This will create sample employees and a manager:

| Role     | Email              | Password       |
|----------|--------------------|----------------|
| Manager  | manager@example.com| Password123!   |
| Employee | alice@example.com  | Password123!   |
| Employee | bob@example.com    | Password123!   |

### 4. Start the backend

```bash
cd server
npm run dev
```

The API is served at `http://localhost:5000/api`.

### 5. Start the frontend

```bash
cd ..
npm run dev
```

The React client runs on `http://localhost:5173` by default.

## API Overview

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | `/api/auth/register`             | Register new employee/manager     |
| POST   | `/api/auth/login`                | Authenticate user                 |
| GET    | `/api/auth/me`                   | Current user profile              |
| POST   | `/api/attendance/checkin`        | Employee check-in                 |
| POST   | `/api/attendance/checkout`       | Employee check-out                |
| GET    | `/api/attendance/my-history`     | Employee history (monthly)        |
| GET    | `/api/attendance/my-summary`     | Employee monthly summary          |
| GET    | `/api/attendance/today`          | Employee today's status           |
| GET    | `/api/attendance/all`            | Manager filtered attendance       |
| GET    | `/api/attendance/employee/:id`   | Manager view specific employee    |
| GET    | `/api/attendance/summary`        | Manager team summary              |
| GET    | `/api/attendance/today-status`   | Manager view of live attendance   |
| GET    | `/api/attendance/export`         | Export CSV report                 |
| GET    | `/api/dashboard/employee`        | Employee dashboard data           |
| GET    | `/api/dashboard/manager`         | Manager dashboard data            |

All authenticated requests expect a bearer token (stored automatically after login) and also set an HTTP-only cookie for convenience.

## Frontend Features

- Employee login/register flows
- Dashboard with quick check-in/out, monthly stats, and recent history
- Attendance history calendar with colour-coded statuses
- Profile view for employee account details
- Manager dashboards with weekly trend and department charts
- Team attendance filters, calendar drill-down, and CSV report export

## Scripts

| Command              | Location | Purpose                    |
|----------------------|----------|----------------------------|
| `npm run dev`        | root     | Start Vite dev server      |
| `npm run build`      | root     | Build production frontend  |
| `npm run dev`        | server   | Start Express with nodemon |
| `npm run seed`       | server   | Seed sample data           |

## Testing & QA

- Ensure MongoDB is running locally before starting the backend.
- Run the seed script after every database reset to populate sample data.
- Use the sample credentials to verify both employee and manager flows.

## Screenshots

Add screenshots of the dashboards once you deploy or capture UI states. Place them in `public/` and reference here.

---

For questions or enhancements, open an issue or reach out to the TAP Academy engineering team.
