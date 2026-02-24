# HustleWise AI 🚀

AI-powered Side Hustle Recommendation & Execution Engine  
Full-Stack project with behavioral analytics and AI-driven strategy generation.

---

## 💡 Project Summary

HustleWise AI helps users discover the best side hustles based on their skills, time availability, budget, risk tolerance, and daily behavior.

This is not just a recommendation app.

It combines:
- Deterministic scoring engine
- AI-generated structured strategy
- Behavioral consistency tracking
- Dropout risk prediction
- API caching + fallback system

Built as a system-design focused SaaS prototype.

---

## 🔥 Key Features

### 🚀 Personalized Recommendations
Uses weighted multi-factor scoring:
- Skill match
- Time fit
- Budget alignment
- Risk tolerance match
- Growth potential

### 🤖 AI Strategy Generation
Generates structured JSON output including:
- Why this hustle suits you
- Earning expectation
- 30-day roadmap
- Honest warning

Includes:
- Markdown cleanup
- JSON parsing
- Error handling

### ⚙️ Caching + Rate Limit Fallback
- Stores AI strategy in database
- Prevents unnecessary API calls
- Uses fallback strategy if quota exceeded
- Keeps system stable under API limits

### 📊 Progress Dashboard
Tracks:
- Consistency %
- Momentum
- Dropout risk %
- Success likelihood %

### 🧠 Behavioral Prediction Logic
Custom logic predicts:
- Inconsistent execution
- Effort-to-output mismatch
- Dropout risk
- Long-term success likelihood

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express
- MySQL
- Gemini API
- RESTful architecture
- Caching layer

### Frontend
- React (Vite)
- Axios
- CSS

---

## 📁 Folder Structure

```
hustlewise-ai/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.jsx
│
├── .gitignore
└── README.md
```

---

## 🚀 How It Works

### 1️⃣ User Profile Input
User enters:
- Profession
- Monthly income
- Available hours per day
- Budget
- Risk tolerance
- Skills

### 2️⃣ Scoring Engine
A weighted algorithm calculates:
- Skill Score
- Time Score
- Budget Score
- Risk Score
- Growth Score

Final Score is computed using weighted aggregation.

### 3️⃣ AI Strategy Generation
- Top recommendation is passed to Gemini API.
- Response cleaned from markdown.
- Parsed into structured JSON.
- Stored in DB.
- Returned to frontend.

If API quota exceeded:
- System switches to fallback strategy.
- UI shows fallback badge.

### 4️⃣ Progress Tracking
Users log daily:
- Hours worked
- Output produced
- Revenue generated
- Energy level

Analytics engine calculates:
- Consistency %
- Momentum
- Dropout risk
- Success likelihood %

---

## 🧪 Run Locally

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
DB_HOST=your_db_host
DB_USER=your_user
DB_PASS=your_password
DB_NAME=hustlewise
GEMINI_API_KEY=your_key
```

Start server:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit:
```
http://localhost:5173
```

---

## 🧑‍💻 Engineering Highlights

- Built custom weighted scoring engine
- Designed behavioral analytics model
- Implemented AI JSON parsing + cleanup
- Added caching layer to reduce API calls
- Implemented rate-limit fallback mechanism
- Designed modular backend architecture
- Built state-managed React frontend

---

## 🎯 Resume Value

This project demonstrates:
- System design thinking
- AI integration in production-style setup
- Backend resilience and error handling
- Full-stack architecture
- Behavioral data modeling

---

## 🔮 Future Improvements

- Add JWT authentication
- Add score breakdown visualization
- Add charts for momentum trends
- Add email reminders
- Deploy live version

---

⭐ If you found this interesting, feel free to explore the code!