# 🧡 Cute & Playful Wellness Companion – Build Plan

## 1. App Idea (High-Level)

This is an **internal-use, mobile-first web app** designed as a *gentle wellness companion* for calorie awareness and weight management.

The app focuses on **support, encouragement, and clarity**, not restriction or guilt.

Core idea:

> Help the user understand *what* and *how much* to eat using photos, voice, and smart suggestions — while staying positive, cute, and motivating.

---

## 2. Core Principles (Non-Negotiable)

* ❌ No shaming language

* ❌ No “over limit”, “failed”, or red warnings

* ❌ No obsession with exact calorie numbers

* ✅ Estimates and ranges only

* ✅ Encouraging, friendly tone

* ✅ Focus on trends, not single meals

* ✅ High contrast & easy readability

* ✅ Glassmorphism only where it does not reduce clarity

---

## 3. Target Platform

* **Web App (Mobile-first)**
* Designed primarily for phones
* Tablet & desktop are secondary

---

## 4. Primary Capabilities

### 4.1 Meal Understanding (Photo-Based)

* User can take or upload a photo of food
* AI identifies:

  * Food items (best-effort)
  * Approximate portions (small / medium / large)
  * Estimated calorie range

UX rules:

* Show calorie *ranges*, never exact numbers
* Show food recognition confidence gently

Example output:

> “This looks like dal, rice, and bhindi — roughly 450–550 kcal 💛”

---

### 4.2 Voice-Based Interaction

* User can:

  * Describe food via voice
  * Ask questions conversationally

Examples:

* “I made paneer sabzi and roti, how much should I eat?”
* “I ate outside today and feel bad.”

Voice UI requirements:

* Push-to-talk
* Soft animation while listening
* Conversational response, not command-based

---

### 4.3 Smart Guidance Engine

The app should answer questions like:

* How much should I eat *right now*?
* Does this fit my day so far?
* What should I eat later?

Inputs used:

* Current weight
* Target weight
* Preferred pace (gentle / steady / ambitious)
* Past meals
* Time of day

Outputs:

* Portion suggestions
* Balance suggestions (protein, fiber, etc.)
* Gentle rebalancing advice

---

### 4.4 Recipe & Meal Suggestions

The app can suggest:

* Recipes
* Meal ideas
* Lighter/heavier alternatives

Based on:

* What user eats often
* Preferences
* Ingredients already available
* Weight goal

Tone example:

> “You seem to enjoy paneer — here’s a lighter version that still feels satisfying ✨”

---

### 4.5 Diet Plan (Optional, On-Demand)

* User can request a **day plan** or **week plan**
* Plans are flexible, optional, and swappable

Rules:

* No rigid enforcement
* No calorie policing
* Everything is editable or dismissible

---

## 5. Sample User Journeys

### Journey 1: "I’m About to Eat"

1. User opens app
2. Taps camera or mic
3. Takes photo or speaks meal description
4. App analyzes meal
5. App responds with:

   * Portion suggestion
   * Positive reassurance
6. Meal auto-saved

Goal: Zero friction, zero guilt

---

### Journey 2: "What Should I Eat Today?"

1. User taps “Help me plan today”
2. App checks recent patterns
3. App generates a soft daily structure
4. User swaps or ignores suggestions

Goal: Reduce decision fatigue

---

### Journey 3: "Low Energy / Emotional Support"

1. User opens app
2. Uses voice input
3. Expresses concern or guilt
4. App responds empathetically
5. Shows weekly trend (not today-only)

Goal: Prevent abandonment and shame spirals

---

## 6. Design System Summary

### Visual Style

* Cute, playful, warm
* Rounded rectangles everywhere
* Glassmorphic buttons
* Soft shadowed cards

### Readability & Contrast

* High contrast text
* Text never placed directly on raw glass
* Solid overlays for text areas

### Color Palette

* Warm neutrals + food-friendly tones
* Dark brown & olive for text
* Coral for CTAs

---

## 7. UI Components

* Rounded cards (info containers)
* Glassmorphic action buttons
* Floating primary CTA (camera/mic)
* Progress rings (soft, non-judgmental)
* Trend charts (weekly focus)

---

## 8. Animations & Motion

* Gentle bounce on success
* Soft confetti for milestones
* Breathing animation for voice listening
* No aggressive or fast motion

---

## 9. Data & Memory

### Stored Data

* Meal images
* Parsed meal data
* Daily summaries
* Weekly trends
* User preferences

### Rules

* Local-first storage preferred
* Cloud backup optional
* No social features
* No external sharing by default

---

## 10. AI Responsibilities

### Vision Model

* Food recognition
* Portion estimation

### Language Model

* Conversational responses
* Encouraging tone
* Recipe suggestions
* Plan generation

### Prompting Rules

* Always empathetic
* Never judgmental
* Never medical advice

---

## 11. Safety & Ethics

* Clear disclaimer: not medical advice
* Easy opt-out for tracking
* No daily weigh-in pressure
* No negative reinforcement

---

## 12. MVP Scope (Phase 1)

Must-have:

* Photo meal logging
* Voice input
* Meal history
* Gentle guidance
* High-contrast mobile UI

Nice-to-have:

* Full diet plans
* Advanced charts
* Ingredient-based planning

---

## 13. Success Criteria

The app is successful if:

* It feels safe to open every day
* The user never feels judged
* Usage is consistent without pressure
* Guidance feels helpful, not controlling

---

## 14. North Star

> Build something that feels like a kind friend — not a tracker.
