# Frontend UI Documentation

The frontend is built with React, TypeScript, and Vite.

## Component Documentation (Storybook)

We use **Storybook** for interactive component documentation. It allows developers to browse, test, and develop UI components in isolation from the main application logic.

To view the Storybook documentation locally:

1. Navigate to the frontend directory: `cd frontend`
2. Start Storybook: `npm run storybook`

Storybook will open in your default browser, typically at `http://localhost:6006`.

## Architecture

* **Framework:** React
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **State Management:** Zustand (in `src/store/`)
* **Routing:** React Router (in `src/routes/` or `src/App.tsx`)
