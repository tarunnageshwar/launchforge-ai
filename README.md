# LaunchForge AI

LaunchForge AI is a comprehensive, 15-module SaaS platform designed to accelerate startup incubation. By acting as a fractional team of experts (CMO, Head of Growth, Startup Attorney, etc.), it uses Generative AI to guide founders from an initial idea all the way to a Go-To-Market strategy and growth experiments.

## Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [PostgreSQL](https://www.postgresql.org/) (or a cloud PostgreSQL provider like Neon)

## Environment Variables

You need to set up two `.env` files—one for the backend and one for the frontend.

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory with the following variables:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
GEMINI_API_KEY=your-gemini-api-key-here
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Running the Application Locally

You will need to open two separate terminal windows—one for the backend and one for the frontend.

### Step 1: Start the Backend (FastAPI)

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   - **Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```
3. Run the database migrations to ensure your tables are up-to-date:
   ```bash
   alembic upgrade head
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The backend is now running at http://localhost:8000*

### Step 2: Start the Frontend (React + Vite)

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary NPM dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend is now running at http://localhost:5173*

## Accessing the Platform

1. Open your web browser and navigate to `http://localhost:5173`.
2. Register a new user account.
3. Once logged in, you can create a new project and begin navigating through the 15 AI-powered startup incubation modules!
