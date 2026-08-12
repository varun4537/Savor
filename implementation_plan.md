# Implementation Plan - Savor

## Goal Description
Build "Savor," a gentle wellness companion web app. The app will be hosted on **Vercel** and protected by **Supabase Auth** (User ID & Password) to ensure privacy for personal use.

## User Review Required
> [!IMPORTANT]
> **Authentication & Hosting Decision:**
> We will use **Supabase** for free, secure Authentication and Database storage, and **Vercel** for hosting. This requires setting up a Supabase project (I can guide you or use a mock mode first).
>
> **API Keys:**
> You will need to provide API keys (OpenAI or Gemini) for the AI features. We will store these securely in Vercel Environment Variables.

## Proposed Architecture

### Tech Stack
*   **Framework:** **Next.js 14+** (App Router)
    *   *Why?* Best-in-class Vercel integration, easy API routes for hiding keys, React-based ecosystem.
*   **Styling:** **Tailwind CSS**
    *   *Why?* Mobile-first utility classes, easy to implement the "glassmorphism" design system.
*   **Backend & Auth:** **Supabase**
    *   *Why?* Provides "Sign in with Email/Password" out of the box. Free tier is generous. Postgres database for storing logs/history securely in the cloud.
*   **State Management:** **Zustand**
    *   *Why?* Simple, lightweight state management for the "current meal" and session data.
*   **AI:** **OpenRouter** (Unified API for various models)
    *   *Why?* User provided key. Allows flexible switching between models (Claude 3.5 Sonnet, GPT-4o, Gemini Pro) for best results.

### Data Flow
1.  **Auth:** User logs in -> Supabase Auth returns session.
2.  **Capture:** User takes photo/speaks -> Next.js API Route -> OpenRouter API.
3.  **Process:** AI returns JSON (food items, estimated calories, gentle feedback).
4.  **Store:** Data saved to Supabase (linked to User ID).
5.  **View:** History fetched from Supabase, rendered with server components or client hooks.

## Proposed Changes

### [Setup]
#### [NEW] [scaffold-nextjs]
*   Create `app` directory for the Next.js project to avoid conflict with existing docs.
*   Initialize `create-next-app` with Tailwind, TypeScript, ESLint.
*   Setup `shadcn/ui` (optional, or build custom glassmorphic components).
*   **Env Vars:** Create `.env.local` with `OPENROUTER_API_KEY`.

#### [NEW] [supabase-setup]
*   Install `@supabase/supabase-js`.
*   Create `middleware.ts` for route protection (redirect to /login if not authenticated).

### [Components]
#### [NEW] [DesignSystem]
*   Implement `design.json` tokens in `tailwind.config.ts`.
*   Create base components: `GlassCard`, `GlassButton`, `Typography`.

## Verification Plan

### Automated Tests
*   **Linting:** `npm run lint`
*   **Build:** `npm run build` (Ensures Next.js builds correctly for Vercel).

### Manual Verification
*   **Deployment:** Deploy to Vercel (using `vercel` CLI or GitHub integration).
*   **Auth Flow:** Verify Login / Signup works and redirects to Home.
*   **Mobile View:** Open on a phone (or DevTools mobile view) to verify responsive layout.

## Phase 2: AI & Intelligence [NEW]
### [Features]
#### [NEW] [gemini-setup]
*   **Goal:** Initialize Google Generative AI client.
*   **Model:** `gemini-1.5-flash` (Fast, low cost, multimodal).
*   **Env:** `GOOGLE_API_KEY`.

#### [NEW] [ai-vision-integration]
*   **Goal:** Replace mock photo analysis with real Gemini Flash 2.0 integration.
*   **Actions:**
    *   Create Server Action `analyzeFoodImage(base64Image)`.
    *   Prompt Gemini to return JSON with `food_name`, `calories`, `macros`, `confidence`.
    *   Connect to `PhotoLogPage`.

#### [NEW] [dynamic-diet-plan]
*   **Goal:** Generate personalized meal plans.
*   **Actions:**
    *   Create Server Action `generateWeeklyPlan(profile, cuisine)`.
    *   Prompt: "Create a 7-day Indian/Western meal plan for a [Age] [Gender] needing [Calories] kcal/day."
    *   Store in `diet_plans` table.

#### [NEW] [ai-pantry]
*   **Actions:**
    *   Create Server Action `generateRecipes(ingredients, cuisine)`.

## Phase 3: Engagement & Health [NEW]
### [Features]
#### [NEW] [hydration-tracking]
*   **Goal:** Gentle water logging with "Glasses" unit.
*   **Data:** `hydration_logs` table (id, user_id, glasses_count, created_at).
*   **Component:** `HydrationCard` on Dashboard.
*   **Interaction:**
    *   1 Tap = 1 Glass added.
    *   Visual: Card background fills with blue gradient (0% -> 100% opacity) as glasses increase to target (e.g., 8).
*   **Casual Nudges (No pressure):**
    *   **Morning:** "Have some water yet?"
    *   **Afternoon:** "A sip might feel good." / "Keeping cool?"
    *   **Evening:** "Wind down with a glass?"
    *   **Goal Hit:** "You're glowing today! 💧"

#### [NEW] [weight-trends]
*   **Goal:** Smooth out daily fluctuations.
*   **UI:** Recharts area chart with 7-day moving average.
*   **Page:** Update `ProgressPage`.

#### [NEW] [gentle-gamification]
*   **Goal:** Encourage consistency without streaks pressure.
*   **Concept:** "Care Days" count. Badges for "First Log", "Hydration Hero".

