# TaskForge Deployment

## Frontend: Vercel

1. Import the repository in Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL` with your Render API URL, including `/api`.
   Example: `https://your-render-service.onrender.com/api`
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`

## Backend: Render

1. Create a new Web Service from this repository.
2. Set the root directory to `backend`.
3. Build and run settings:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
4. Environment variables:
   - `DATABASE_URL`: your Neon Postgres connection string
   - `JWT_SECRET`: a long random secret
   - `CLIENT_URL`: your final Vercel URL
   - `NODE_ENV`: `production`

## Final Connection

After Vercel and Render are live, set Render's `CLIENT_URL` to the final Vercel app URL, then set Vercel's `VITE_API_URL` to the final Render URL plus `/api`.
