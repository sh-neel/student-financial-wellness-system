# Complete Setup & Testing Guide

## A. MongoDB Atlas alternative

If local MongoDB is difficult on macOS:

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Add your IP to Network Access.
4. Copy the application connection string.
5. Put it into `backend/.env` as `MONGO_URI`.

Do not commit `.env`.

## B. Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Expected:
```text
MongoDB connected: ...
Server running at http://localhost:5000
```

## C. Start Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:
```text
http://localhost:5173
```

## D. CAPTCHA

This project implements a server-verified arithmetic CAPTCHA to demonstrate the CAPTCHA concept without requiring a third-party account.

For production, replace it with Cloudflare Turnstile, Google reCAPTCHA, or hCaptcha. Never put secret CAPTCHA keys in React source code.

## E. Postman

1. Start the backend.
2. Import `postman/Student-Financial-Wellness.postman_collection.json`.
3. Call **Get CAPTCHA**.
4. Use its `captcha.id` and solve the arithmetic question.
5. Call **Register**.
6. Call **Login**.
7. Copy the returned `token` into the collection variable `token`.
8. Call protected endpoints.
9. Copy returned resource `_id` values into `expenseId`, `incomeId`, and `budgetId` when testing update/delete.

## F. Query Parameters

Example:
```text
GET /api/expenses?search=food&category=Food&sort=amount&order=desc&page=1&limit=10
```

Supported:
- `search`
- `category`
- `from`
- `to`
- `sort`
- `order`
- `page`
- `limit`

## G. Deployment

### Backend on Render/Railway

Build/start:
```text
npm install
npm start
```

Set:
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CLIENT_URL
- NODE_ENV=production

### Frontend on Vercel/Netlify

Build:
```text
npm run build
```

Output:
```text
dist
```

Set:
```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Update backend `CLIENT_URL` to the deployed frontend origin.

## H. Security Checklist

- Passwords are hashed with bcrypt.
- JWT protects private endpoints.
- Helmet adds security headers.
- CORS restricts browser origin.
- API rate limiting is enabled.
- User ownership is enforced in every protected query.
- `.env` is ignored by Git.
- CAPTCHA is checked on the server.
- Input validation is provided by Mongoose.
- Production deployment should use HTTPS and a strong random JWT secret.
