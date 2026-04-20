# Eventify

## Backend auth & security

Ky projekt tani ka edhe API backend te gatshme ne `backend/` me:

- Regjistrim perdoruesi me `email + password`
- Login me `email + password`
- JWT `access token` + `refresh token`
- Logout me revokim te refresh token
- Role-based authorization (`Admin`, `Organizer`, `User`)
- Hashing te password me `bcrypt`
- Validim hyrjesh me `Zod` (mbrojtje praktike nga SQL injection bashke me prepared statements)
- CORS te kufizuar vetem per origjinen e frontend-it
- Audit log per veprimet kritike

## Si ta nisesh backend-in

1. Krijo `.env` duke kopjuar `backend/.env.example`.
2. Instalo varesite:

   `cd backend && npm install`

3. Nise serverin:

   `npm run dev`

Backend ekspozon endpoint-et ne `http://localhost:4000/api/auth`.