# LaunchForge AI Documentation

Welcome to the documentation for the LaunchForge AI platform!

LaunchForge AI is designed to help you generate project ideas, structure your architecture, and kickstart development quickly.

## Project Structure

This project is a monorepo containing two main parts:

1. **Backend (`/backend`)**: A Python-based REST API built with FastAPI.
2. **Frontend (`/frontend`)**: A React-based web application built with TypeScript, Vite, and TailwindCSS.

## Quick Start

### Backend

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Start the server: `uvicorn app.main:app --reload`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Navigation

* [Backend API Documentation](backend.md)
* [Frontend UI Documentation](frontend.md)
