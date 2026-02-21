# TruthLens AI v3

Detect psychological manipulation patterns in any digital text using hybrid AI (Gemini) + rule-based analysis.

## Quick Start

```bash
# 1. Backend
cd server
npm install
cp .env.example .env   # fill in your keys
npm run dev            # runs on :5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env   # fill in your Supabase keys
npm run dev            # runs on :5173
```

See **SUPABASE_SETUP.md** for full database and auth setup instructions.

## Project Structure

```
truthlens/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # Auth + Analysis context
│   │   ├── pages/        # Route pages
│   │   ├── services/     # Supabase + API calls
│   │   └── utils/        # Risk scoring helpers
│   └── .env.example
└── server/               # Node.js + Express backend
    ├── config/           # Supabase client
    ├── controllers/      # Route handlers
    ├── middleware/       # Auth + rate limiting
    ├── routes/           # Express routers
    ├── services/         # Gemini AI + bias engine
    ├── utils/            # Scoring + lexicon
    └── .env.example
```

## Features

- 🔐 Email OTP signup flow via Supabase Auth
- 🧠 Gemini 1.5 Flash AI analysis
- 📏 Rule-based lexicon engine (6 categories)
- 📊 Risk score 0–100 with radial gauge
- 🔍 Phrase highlighting in original text
- 📝 Expandable explanation cards
- 📚 Analysis history with stats
- ⚙️ Bias category filters

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, Helmet, Rate Limiting
- **AI**: Google Gemini 1.5 Flash
- **Database/Auth**: Supabase (PostgreSQL + Auth)
