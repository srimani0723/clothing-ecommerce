# Clothing E‑Commerce (MERN)

Full-stack e‑commerce web application for a fictional clothing brand built with the MERN stack.  
Features include authentication, product browsing with filters, shopping cart for guests and logged-in users, mock checkout, order saving, and email confirmation.

## Tech Stack

- Frontend: React + Vite, Redux Toolkit, React Router v6, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT + HttpOnly cookies, bcrypt
- Email: Nodemailer (Gmail / Mailtrap / SendGrid ready)
- Deployment: Netlify (frontend), Render (backend)

## Features

- User authentication:
  - Register, login, logout with hashed passwords and JWT in HttpOnly cookie.
- Products:
  - Seeded collection of 20+ clothing items (Men, Women, Kids).
  - Search, category filter, size filter, price range, pagination.
- Cart:
  - Guests: cart stored in localStorage.
  - Logged-in users: cart stored in MongoDB (Cart model).
  - On login: guest cart automatically merged into user cart, then moved to server.
- Orders:
  - Mock checkout (no real payment).
  - Order document saved with items, total, status, date.
  - Order history page for logged-in user.
- Email:
  - Order confirmation email with order ID, date, items, total amount.

## Backend Setup

1. Go to backend folder:

```bash
cd backend
npm install
```

2. Create `.env` in `backend/`:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
NODE_ENV=development

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
```

3. Seed products (run once):

```
node seedProducts.js
```

4. Run backend:

```
npm run dev   # if using nodemon
# or
npm start
```

API will run on `http://localhost:5000`.

### Main API Endpoints

- Auth:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - POST `/api/auth/logout`
- Products:
  - GET `/api/products`
  - GET `/api/products/:id`
  - Supports: `?search=&category=&size=&minPrice=&maxPrice=&page=&limit=`
- Cart (protected, logged-in):
  - GET `/api/cart`
  - POST `/api/cart/add`
  - PUT `/api/cart/update`
  - DELETE `/api/cart/remove`
  - POST `/api/cart/merge` (merge guest cart into user cart)
- Orders (protected):
  - POST `/api/orders`
  - GET `/api/orders/:id`
  - GET `/api/orders/my-orders`

## Frontend Setup

1. Go to frontend folder:

```
cd frontend
npm install
```

2. Create `.env` (for local dev):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Run Vite dev server:

```
npm run dev
```

Frontend will run on `http://localhost:5173`.

## Deployment

### Backend (Render)

- Push backend to GitHub.
- Create a new Web Service on Render:
  - Build Command: `npm install`
  - Start Command: `npm start` (or `node server.js`)
  - Root directory: `backend`
- Set environment variables in Render settings:
  - `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `NODE_ENV=production`
- CORS config in `server.js` (example):

```
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.netlify.app",
    ],
    credentials: true,
  })
);
```

- Cookie options (JWT):

```
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### Frontend (Netlify)

- Push frontend to GitHub.
- Create a new site on Netlify:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Base directory: `frontend`
- Set env var in Netlify Site Settings → Build & Deploy → Environment:
  - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
- For React Router routing, add `public/_redirects` in frontend:

## How the Cart Works

- Guest user:
  - Cart stored in `localStorage` under `cartItems`.
  - Redux `cartSlice` manages add/update/remove locally.
- On login:
  - `loginUser` thunk reads `cartItems` and calls `/api/cart/merge`.
  - Backend merges items into MongoDB Cart for that user.
  - Local cart is cleared.
- Logged-in user:
  - All cart actions (add/update/remove/get) hit backend Cart APIs.
  - Checkout uses server cart and creates an order.

## Scripts

Backend:

- `npm run dev` – start server with nodemon.
- `npm start` – start server.
- `node seedProducts.js` – seed products.

Frontend:

- `npm run dev` – Vite dev server.
- `npm run build` – create production build.
- `npm run preview` – preview production build locally.

## Notes

- This project is for learning and demo purposes.
- For production, add input validation, better error handling, rate limiting, and stricter CORS configuration.
