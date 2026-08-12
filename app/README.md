# 🍽️ Savor

Your AI-powered nutrition companion. Track meals, get personalized diet plans, and make healthier choices with intelligent food analysis.

![Version](https://img.shields.io/badge/version-1.3.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🍳 Smart Meal Logging
- **Photo Analysis** - Take a picture of your meal, AI identifies and estimates nutrition
- **Voice Input** - Speak what you ate, get instant calorie tracking
- **Quick Text Entry** - Type dish names for AI-powered macro estimates

### 📊 Dashboard
- **Calorie Ring** - Visual progress toward daily goal with gradient colors
- **Today's Meals** - Quick overview of logged meals
- **Smart Tips** - Time-based suggestions (breakfast, lunch, dinner)
- **Hydration Tracker** - Track daily water intake

### 🥗 Diet Planning
- **AI-Generated Plans** - 7-day meal plans based on your profile
- **Cuisine Selection** - Indian, Mediterranean, Mexican, etc.
- **Macro Breakdown** - Protein, carbs, fat for each meal
- **Pantry Integration** - Use ingredients you already have

### 👨‍🍳 Pantry Mode
- **Ingredient Tracking** - Add items via text or voice
- **Recipe Suggestions** - AI generates recipes from your pantry
- **Match Percentage** - See how well recipes match your ingredients

### ⚙️ Settings
- **All Onboarding Fields** - Edit name, age, weight, height, gender
- **Goal Tracking** - Lose weight, maintain, or gain muscle
- **Diet Preferences** - Vegetarian, vegan, keto, paleo, etc.
- **Health Conditions** - Diabetes, BP, thyroid, PCOS
- **Diet Change Detection** - Prompts to update plan when preferences change

### 🛡️ Admin Dashboard (`/savoradmin`)
- **Model Comparison** - Test AI models side-by-side
- **Health Checks** - Monitor API connectivity
- **Model Management** - Add/remove AI models dynamically

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React, TypeScript |
| **Styling** | Tailwind CSS, Custom Design System |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Google OAuth, Email) |
| **AI** | OpenRouter API (Gemini, GPT-4, Claude) |
| **Deployment** | Vercel |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/savor.git

# Navigate to app directory
cd savor/app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

---

## 📱 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Manual Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
app/
├── app/
│   ├── components/      # Reusable UI components
│   ├── actions/         # Server actions (AI calls)
│   ├── hooks/           # Custom React hooks
│   ├── (pages)/         # Route pages
│   └── ...
├── lib/
│   ├── supabase.ts      # Database client
│   ├── openrouter.ts    # AI API wrapper
│   └── utils.ts         # Utilities
└── public/              # Static assets
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Varun Das**  
📧 varundas4537@gmail.com

---

Made with ❤️ in India
