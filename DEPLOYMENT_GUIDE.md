# Deployment Guide

## 1. Backend Deployment (Render)

1.  **Push Code to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Create Web Service:**
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Settings:**
    *   **Name:** `prompt-social-backend` (or similar)
    *   **Root Directory:** `prompt-social/backend`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
4.  **Environment Variables:**
    *   Add the following variables under the **Environment** tab:
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: A secure random string.
        *   `CLIENT_URL`: The URL of your frontend (e.g., `https://prompt-social.vercel.app`). *You can add this after deploying the frontend.*
        *   `PORT`: `10000` (Render sets this automatically, but good to know).

## 2. Frontend Deployment (Vercel)

1.  **Import Project:**
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Import the same GitHub repository.
2.  **Configure Settings:**
    *   **Framework Preset:** `Vite`
    *   **Root Directory:** `prompt-social/frontend`
3.  **Environment Variables:**
    *   Add the following variable:
        *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://prompt-social-backend.onrender.com/api`).
    *   *Note: Ensure you include `/api` at the end if your backend routes are prefixed with it.*
4.  **Deploy:** Click **Deploy**.

## 3. Final Connection

1.  **Update Backend:** Once the frontend is deployed, copy its URL.
2.  **Go to Render:** Update the `CLIENT_URL` environment variable in your backend service with the frontend URL.
3.  **Redeploy Backend:** Trigger a manual deploy or wait for auto-deploy if enabled.

## Troubleshooting

*   **CORS Issues:** If you see CORS errors in the browser console, double-check that `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slashes usually).
*   **Socket.io:** If chat doesn't connect, ensure the socket client in `Messages.jsx` and `server.ts` are using the correct URLs. The `VITE_API_URL` should handle the HTTP requests, but Socket.io might need the base URL without `/api`. (Current implementation uses `baseURL` from axios which includes `/api`. You might need to adjust `socket = io(baseURL.replace('/api', ''))`).
