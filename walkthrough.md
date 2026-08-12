# Savor - Project Walkthrough

We have built **Savor**, your gentle wellness companion. The app is a mobile-first Next.js application that uses AI to help you track meals without judgment.

## Core Features Implemented

### 1. **Home Screen**
*   **Gentle Greeting:** Time-aware welcoming message.
*   **Daily Summary:** Soft visual indicators of your day's balance.
*   **Quick Actions:** Floating buttons for Camera and Voice logging.

### 2. **Meal Logging (AI Powered)**
*   **📸 Photo Log:** Upload a meal photo, and AI (OpenRouter) identifies ingredients and estimates calories/macros.
*   **mic Voice Log:** Describe your meal naturally, and AI parses it into structured data.

### 3. **History & Trends**
*   **Visual Balance:** A "Weekly Balance" chart that focuses on consistency rather than numbers.
*   **Safe Data:** Data persistence designed for Supabase (with fallback mock mode for testing).

### 4. **Recipe Ideas**
*   **Suggestions:** Get gentle meal ideas based on your current context.

### 5. **Authentication**
*   **Secure Access:** Login/Signup pages ready for Supabase Auth to ensure your data is private.

## How to Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) on your phone or toggle Mobile View in DevTools.

3.  **Supabase Setup (For Persistence)**
    *   Create a project at [supabase.com](https://supabase.com).
    *   Go to SQL Editor and run the script in `supabase/schema.sql`.
    *   Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

## Next Steps
*   Deploy to Vercel (simply import this repo).
*   Add your Supabase keys to Vercel Environment Variables.

Enjoy your gentle wellness journey! 🧡
