# AI Habit Tracker App

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Create a PostgreSQL database named `ai_habit_tracker` and update `DATABASE_URL` in `.env` if needed.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` to your backend URL.
Frontend runs at `http://localhost:5173`.

## API

- `POST /register`
- `POST /login`
- `GET /habits`
- `POST /habits`
- `PUT /habits/{id}`
- `DELETE /habits/{id}`
- `POST /track`
- `GET /logs`
- `GET /stats`
- `GET /ai-insights`

## Structure

- `backend/` contains the FastAPI API, SQLAlchemy models, auth, and Python dependencies
- `frontend/` contains the React Vite app, Tailwind config, and chart/dashboard UI
