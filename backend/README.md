# JobConnect Portal — Backend API

Node.js + Express + MongoDB backend for the JobConnect Portal (MERN stack).

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

3. Start MongoDB locally (or point `MONGO_URI` to Atlas/hosted Mongo).

4. Run in dev mode (auto-restart on changes):
   ```
   npm run dev
   ```
   Or in production mode:
   ```
   npm start
   ```

5. Health check: `GET http://localhost:5000/api/health`

## Project Structure

```
config/         MongoDB connection
models/         Mongoose schemas (User, JobSeeker, Employer, Recruiter, Job,
                Application, Message, Interview, Subscription, Payment)
middleware/     JWT auth (protect), RBAC (authorize), central error handler
controllers/    Business logic per module
routes/         Express routers, mounted under /api/*
utils/          Token generation, OTP helper
server.js       App entry point — Express + Socket.io setup
```

## Roles

`job_seeker` | `employer` | `recruiter` | `admin`

Admin has override access to every route (see `middleware/role.js`).

## Auth Flow

- `POST /api/auth/register` — create account (role-specific profile doc is
  auto-created: JobSeeker / Employer / Recruiter)
- `POST /api/auth/login` — email + password login
- `POST /api/auth/otp` — request an OTP (logged to console in dev; wire up
  a real SMS/email gateway in `controllers/authController.js`)
- `POST /api/auth/verify` — verify OTP and receive a JWT

All protected routes require `Authorization: Bearer <token>`.

## Real-time Messaging

Socket.io is initialized in `server.js`. Clients should emit
`joinApplication` with an `applicationId` to join that thread's room, then
listen for `newMessage` events. `POST /api/messages` emits to the room
automatically.

## What's stubbed / needs wiring for production

- **OTP delivery** — currently logs to console (`utils/otp.js`,
  `authController.js`). Wire up Twilio/SendGrid/etc.
- **Payments** — `paymentController.js` assumes a gateway order was already
  created client-side; wire up Razorpay/Stripe order creation + webhook
  verification before marking a payment `success`.
- **Notifications** — `notificationController.js` uses an in-memory array.
  Swap for a real `Notification` model once you're ready.
- **File uploads** (resumes, logos, attachments) — no upload endpoint yet;
  wire up AWS S3 (or similar) and store the resulting URL on the relevant
  model field (`resumeUrl`, `logoUrl`, `attachmentUrl`).

## Business Rules Implemented

- BR-02 — one application per job seeker per job (unique index)
- BR-03 — application status can only move forward (`applicationController.js`)
- BR-07 — JWT required on all protected routes (`middleware/auth.js`)
- BR-08 — OTP rate-limited to 3 attempts / 10 minutes (`utils/otp.js`)
- BR-09 — Admin override on all routes (`middleware/role.js`)
- BR-11 / BR-12 — data scoping to own profile / own job postings
- BR-16 — resume required before applying
- BR-17 — withdrawn applications can't be resubmitted
- BR-20 — interview requires a shortlisted application first
