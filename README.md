# Student Financial Wellness & Smart Expense Management System

A complete full-stack academic project covering HTML5/CSS3, ES6+, REST APIs, Node.js/Express, MongoDB/Mongoose, JWT authentication, React, Bootstrap, LocalStorage, analytics, CAPTCHA, security headers, and external currency API integration.

## Tech Stack

- Frontend: React 18, Vite, Axios, Bootstrap 5, React Router
- Backend: Node.js, Express.js, Mongoose, JWT, bcryptjs, Helmet, Morgan, CORS
- Database: MongoDB
- External API: Frankfurter public currency exchange API
- Authentication: JWT Bearer tokens
- CAPTCHA: simple server-verified math CAPTCHA (suitable for academic/demo use)

## Project Structure

```text
student-financial-wellness-system/
├── backend/
├── frontend/
├── postman/
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB 6+ running locally OR a MongoDB Atlas connection string
- npm

## 1. Start MongoDB

Local MongoDB:
```bash
brew services start mongodb-community
```

Or use MongoDB Atlas and place its URI in `backend/.env`.

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on:
http://localhost:5000

Health check:
http://localhost:5000/api/health

## 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:
http://localhost:5173

## Environment Variables

### backend/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_financial_wellness
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### frontend

The API base URL is configured in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Default Flow

1. Register a student.
2. Solve the math CAPTCHA shown on the registration form.
3. Login.
4. Add income and expenses.
5. Create a monthly budget.
6. Open Dashboard to see savings and wellness analytics.
7. Use the currency converter on Dashboard.
8. Test protected endpoints through the supplied Postman collection.

## API Overview

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Expenses
- GET `/api/expenses`
- GET `/api/expenses/:id`
- POST `/api/expenses`
- PUT `/api/expenses/:id`
- DELETE `/api/expenses/:id`

### Income
- GET `/api/income`
- GET `/api/income/:id`
- POST `/api/income`
- PUT `/api/income/:id`
- DELETE `/api/income/:id`

### Budget Goals
- GET `/api/budgets`
- POST `/api/budgets`
- PUT `/api/budgets/:id`
- DELETE `/api/budgets/:id`

### Wellness
- GET `/api/wellness/summary`
- GET `/api/wellness/recommendations`

### CAPTCHA
- GET `/api/auth/captcha`

## HTTP Status Codes

- 200 OK - successful GET/PUT or calculated response
- 201 Created - successful registration or resource creation
- 204 No Content - successful deletion
- 400 Bad Request - invalid/missing input
- 401 Unauthorized - missing/invalid JWT
- 403 Forbidden - authenticated but not allowed
- 404 Not Found - resource does not exist
- 409 Conflict - duplicate email
- 429 Too Many Requests - rate-limit protection
- 500 Internal Server Error - unexpected server failure

## Academic/Syllabus Coverage

- Semantic HTML5: header, nav, main, section, article, footer
- CSS3: responsive media queries, Flexbox, custom properties
- Bootstrap: navbar, cards, forms, tables, alerts, progress bars, grid
- JavaScript ES6+: modules, async/await, array methods, destructuring
- DOM/event concepts: React event handlers and browser LocalStorage
- Fetch/Axios: Axios for app API and fetch for public currency API
- REST/JSON/status codes/query parameters
- Express routing and middleware
- MongoDB/Mongoose models
- JWT authorization
- React JSX, props, state, hooks, routing, context
- CORS and security headers
- SEO metadata
- CAPTCHA
- Deployment configurations for Vercel/Netlify and Render/Railway
