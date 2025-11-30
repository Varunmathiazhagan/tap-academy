# Employee Attendance System

Full-stack attendance tracking platform for TAP Academy. Employees can register, check in/out, and review trends, while managers monitor teams, export reports, and manage live presence maps.

- **Employee** – register/login, check in/out, review history, monitor KPIs
- **Manager** – monitor dashboards, filter records, export CSV, audit anomalies

## Tech Stack

- **Frontend:** React 19, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT auth, CSV writer
- **Tooling:** Vite, ESLint, Nodemon, dotenv

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

## Setup Instructions

1. **Prerequisites**
	- Node.js 20+
	- npm 10+
	- MongoDB 6+ running locally or via connection string

2. **Clone & install dependencies**

	```bash
	git clone https://github.com/<your-org>/attendance-platform.git
	cd tap-academy

	# Frontend deps
	npm install

	# Backend deps
	cd server
	npm install
	```

3. **Configure environment variables** – see the [Environment Variables](#environment-variables) section below.

4. **Seed the database (optional but recommended)**

	```bash
	cd server
	npm run seed
	```

	The seed script provisions one manager plus multiple sample employees with realistic attendance patterns.

5. **Start both servers** – follow [How to Run](#how-to-run) for dev/prod modes.

## Environment Variables

Create `.env` files in both the project root and `server/` folders. Use `.env.example` as a reference.

| Location  | Variable | Description |
|-----------|----------|-------------|
| `server/.env` | `PORT` | Express API port (default `5000`) |
|             | `MONGO_URI` | MongoDB connection string |
|             | `JWT_SECRET` | Secret for signing JWTs |
|             | `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
|             | `CORS_ORIGINS` | Comma-separated origins allowed to call the API |
|             | `OFFICE_START_HOUR` | Workday start hour in 24h format (IST) |
|             | `LATE_THRESHOLD_MINUTES` | Minutes after start hour considered late |
| `./.env`   | `VITE_API_URL` | Frontend base URL to call the API (e.g. `http://localhost:5000/api`) |

> **Tip:** keep secrets out of version control. Duplicate `.env.example` to ensure teammates know the required keys.

## How to Run

| Task | Command | Notes |
|------|---------|-------|
| Start backend dev server | `cd server && npm run dev` | Uses Nodemon at `http://localhost:5000/api` |
| Start frontend dev server | `npm run dev` | Vite dev server on `http://localhost:5173` |
| Build frontend for production | `npm run build` | Outputs static assets to `dist/` |
| Preview production build | `npm run preview` | Serves the `dist/` bundle locally |
| Seed database | `cd server && npm run seed` | Wipes & reseeds Mongo with curated data |
| Lint (frontend) | `npm run lint` | Runs ESLint on React app |

When running locally, start MongoDB first, then run both dev servers in parallel.

## Sample Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager | `manager@example.com` | `Password123!` |
| Employee | `alice@example.com` | `Password123!` |
| Employee | `bob@example.com` | `Password123!` |

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

## Testing & QA

- Ensure MongoDB is running locally before starting the backend.
- Run `npm run seed` after clearing the DB to restore realistic attendance data.
- Use the sample credentials above to verify employee vs manager UX.
- `npm run lint` keeps the frontend consistent with project rules.

## Screenshots

Place UI captures inside `public/screenshots/` (or any static asset folder) and update the references below. Example:

```
public/
	screenshots/
		employee-dashboard.png
		manager-dashboard.png
```

```markdown
![Employee Dashboard](public/screenshots/employee-dashboard.png)
![Manager Dashboard](public/screenshots/manager-dashboard.png)
```

Replace the image paths with actual screenshots from your deployment to document the UX for stakeholders.

---

For questions or enhancements, open an issue or reach out to the TAP Academy engineering team.
