# SalonBook – Client

SalonBook is a salon appointment booking platform. Customers can browse salon services, book an appointment, and pay online after the admin confirms it. Admins manage services, appointments, users, and payments from a dashboard.

This repository is the **client (frontend)**. The server is in a separate repository.

## Links

- Live Site: `https://salonbook-client-puce.vercel.app`
- Client Repository: `https://github.com/farhad-alom/salonbook-client`
- Server Repository: `https://github.com/farhad-alom/salonbook-server`

## Features

**Public**
- Home page with banner, categories, featured services, and "Why Choose Us"
- Browse services with search, category filter, and price sorting
- Sign up and sign in with email/password or Google

**Customer**
- Service details page (login required)
- Book an appointment with date, time slot, and a message
- Dashboard: overview statistics, My Appointments, cancel pending appointments
- Pay for confirmed appointments with Stripe (test mode)
- Payment history and profile update (name, image, phone)

**Admin**
- Dashboard overview statistics
- Manage services: add, update, delete, active/inactive, image upload
- Manage appointments: confirm or cancel
- Manage users: block or unblock customers
- View all payment transactions
- Profile update

## Technologies

- Next.js 16 (App Router) and React
- Tailwind CSS and shadcn/ui
- Better Auth (email/password and Google login)
- Sonner (toast notifications)
- ImgBB (image upload)
- Stripe Checkout (payment)

## How to Run Locally

1. Clone the repository and open the folder.
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file (see the names below) and fill in your own values.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

The server must also be running (see the server repository).

## Environment Variables (names only)

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_IMGBB_API_KEY
BETTER_AUTH_SECRET
BETTER_AUTH_URL
MONGODB_URI
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
JWT_SECRET
```

`JWT_SECRET` must be the same value in the client and the server.
