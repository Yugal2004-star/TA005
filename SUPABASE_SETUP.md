# TruthLens AI — Supabase Setup Guide

Follow these steps in order. The entire setup takes about 10 minutes.

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in / create an account.
2. Click **New Project**.
3. Fill in:
   - **Name**: TruthLens AI (or any name)
   - **Database Password**: choose a strong password (save it somewhere)
   - **Region**: choose one close to your users
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

## Step 2 — Enable Email OTP Authentication

This is the key step for the OTP signup flow.

1. In your Supabase dashboard, go to **Authentication → Providers**.
2. Ensure **Email** is enabled (it is by default).
3. Go to **Authentication → Email Templates** (optional — customise the OTP email).
4. Go to **Authentication → Settings**:
   - **Confirm email** → set to **OTP** (not magic link).
   - **OTP expiry**: 600 seconds (10 minutes) is a good default.
   - Turn OFF "Enable email confirmations" if you want instant login after OTP (recommended for development).

> **Important**: The default Supabase email rate limit is 3 emails/hour on the free plan.
> For production, configure a custom SMTP under **Settings → Authentication → SMTP Settings**.

---

## Step 3 — Create the `analyses` Table

Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Create the analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text      TEXT NOT NULL,
  manipulation_score INTEGER NOT NULL DEFAULT 0,
  risk_level         TEXT NOT NULL DEFAULT 'Low',
  detected_biases    JSONB NOT NULL DEFAULT '[]',
  category_tally     JSONB NOT NULL DEFAULT '{}',
  overall_summary    TEXT,
  applied_filters    JSONB NOT NULL DEFAULT '[]',
  ai_score           INTEGER DEFAULT 0,
  rule_score         INTEGER DEFAULT 0,
  flagged_terms      JSONB NOT NULL DEFAULT '[]',
  word_count         INTEGER DEFAULT 0,
  dominant_technique TEXT DEFAULT 'none',
  intent_assessment  TEXT DEFAULT 'neutral',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_analyses_user_id
  ON public.analyses(user_id, created_at DESC);
```

---

## Step 4 — Enable Row Level Security (RLS)

Still in **SQL Editor**, run:

```sql
-- Enable RLS on the table
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rows
CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rows
CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own rows
CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Step 5 — Get Your API Keys

Go to **Settings → API** in your Supabase dashboard.

You need TWO keys:

| Key | Used in | Variable name |
|-----|---------|---------------|
| **Project URL** | Both client & server | `VITE_SUPABASE_URL` / `SUPABASE_URL` |
| **anon public** key | Client (React) | `VITE_SUPABASE_ANON_KEY` |
| **service_role** key | Server (Node.js) | `SUPABASE_SERVICE_KEY` |

> ⚠️ Never expose the `service_role` key in the frontend. It bypasses all RLS policies.

---

## Step 6 — Configure Environment Files

### Client (`client/.env`)
Copy `client/.env.example` to `client/.env` and fill in:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key
```

### Server (`server/.env`)
Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...your_service_role_key
GEMINI_API_KEY=AIza...your_gemini_key
CLIENT_URL=http://localhost:5173
```

Get your **Gemini API key** from [https://aistudio.google.com/](https://aistudio.google.com/) (free tier available).

---

## Step 7 — Run the Project

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
# Should print: TruthLens AI running on :5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## OTP Signup Flow — How It Works

```
User fills form (name, email, password)
        ↓
supabase.auth.signUp() called
        ↓
Supabase sends 6-digit OTP to email
        ↓
UI transitions to OTP screen
        ↓
User enters 6 digits (paste supported)
        ↓
supabase.auth.verifyOtp() called with type: 'signup'
        ↓
Session created → redirect to dashboard /
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing Supabase credentials" on server start | Check `server/.env` has `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` |
| OTP email not arriving | Check spam folder; Supabase free plan limits 3 emails/hour |
| "Invalid token" on OTP verify | OTP expired (10 min default) — click Resend code |
| "relation analyses does not exist" | Run the SQL in Step 3 |
| CORS error from frontend | Check `CLIENT_URL` in `server/.env` matches your frontend port |
| Gemini API error | Verify `GEMINI_API_KEY` is correct and has quota |
| White screen on frontend | Open browser console — usually a missing `.env` variable |

---

## Verify Setup is Working

1. Go to `http://localhost:5173/signup`
2. Fill in name, email, and password → click **Create Account & Get OTP**
3. Check your email for a 6-digit code
4. Enter the code → you should land on the dashboard at `/`
5. Paste some text and click **Analyze** — you should see results
6. Check the **History** page — your analysis should be saved

---

*TruthLens AI · Team TA005*
