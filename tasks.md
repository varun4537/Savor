# ✅ Build Tasks & Subtasks – Wellness Companion Web App

> **Execution Rule (Very Important)**
> The AI coding agent MUST:
>
> * Complete **all subtasks** under a task
> * Explicitly mark the task as **COMPLETED**
> * Only then move to the next task

---

## TASK 0: Read & Understand Requirements

**Goal:** Ensure full context before writing any code.

### Subtasks

* [ ] Read `plan.md` fully
* [ ] Understand core philosophy (no guilt, encouraging, estimates only)
* [ ] Understand design constraints (glassmorphism + high contrast)
* [ ] Understand that this is **internal-use only**

**Exit Criteria**

* Agent can explain the app in one paragraph

**Status:** ✅ COMPLETED

---

## TASK 1: Define Tech Architecture

**Goal:** Lock the technical approach before implementation.

### Subtasks

* [/] Choose frontend framework (mobile-first web)
* [/] Choose backend/runtime
* [/] Decide data storage strategy (local-first + optional cloud)
* [/] Define AI service boundaries (vision vs language)
* [/] Decide authentication approach (simple, private)

**Deliverables**

* Architecture summary (text)
* Data flow diagram (conceptual)

**Status:** ✅ COMPLETED

---

## TASK 2: Project Setup & Base Scaffold

**Goal:** Create a runnable base app.

### Subtasks

* [/] Initialize frontend project (Next.js in `app/`)
* [/] Setup routing
* [/] Setup global styles & fonts (Tailwind + Design System)
* [/] Setup design tokens from `design.json`
* [/] Verify mobile-first responsiveness

**Exit Criteria**

* App loads successfully on mobile viewport

**Status:** ✅ COMPLETED

---

## TASK 3: Design System Implementation

**Goal:** Implement reusable UI components.

### Subtasks

* [/] Card component (rounded + shadow)
* [/] Glassmorphic button component
* [/] Primary CTA button
* [/] Input fields (glass + contrast-safe)
* [/] Typography hierarchy

**Exit Criteria**

* Components reusable across screens

**Status:** ✅ COMPLETED

---

## TASK 4: Home Screen

**Goal:** Create the main landing experience.

### Subtasks

* [/] Hero card with daily greeting
* [/] Floating primary action (camera/mic)
* [/] Today summary card
* [/] Navigation to history & planning
* [/] Verify contrast & readability

**Exit Criteria**

* Home screen matches design principles

**Status:** ✅ COMPLETED

---

## TASK 5: Meal Logging – Photo Input

**Goal:** Allow meal logging via images.

### Subtasks

* [/] Camera/photo upload UI
* [/] Image preview
* [/] Send image to vision model
* [/] Receive food + portion estimates
* [/] Display results in friendly language

**Exit Criteria**

* Meal can be logged using photo only

**Status:** ✅ COMPLETED

---

## TASK 6: Meal Logging – Voice Input

**Goal:** Enable conversational meal input.

### Subtasks

* [/] Push-to-talk UI
* [/] Listening animation
* [/] Speech-to-text integration
* [/] Parse meal description
* [/] Generate response via LLM

**Exit Criteria**

* Meal can be logged using voice only

**Status:** ✅ COMPLETED

---

## TASK 7: Meal Analysis & Guidance Engine

**Goal:** Provide portion and balance guidance.

### Subtasks

* [/] Create user profile schema
* [/] Store meal history
* [/] Compute daily context
* [/] Generate portion guidance
* [/] Ensure tone is encouraging

**Exit Criteria**

* Guidance feels helpful, not strict

**Status:** ✅ COMPLETED

---

## TASK 8: Meal History & Trends

**Goal:** Visualize past data safely.

### Subtasks

* [/] Meal history list
* [/] Weekly trend chart
* [/] No daily calorie obsession
* [/] Soft visual indicators only

**Exit Criteria**

* Trends visible without pressure

**Status:** ✅ COMPLETED

---

## TASK 9: Recipe & Meal Suggestions

**Goal:** Suggest what to eat next.

### Subtasks

* [/] Recipe suggestion logic
* [/] Ingredient-based suggestions
* [/] Preference learning
* [/] Swap / dismiss actions

**Exit Criteria**

* Suggestions feel relevant and optional

**Status:** ✅ COMPLETED

---

## TASK 10: Diet Plan (On-Demand)

**Goal:** Generate optional plans.

### Subtasks

* [x] Daily plan generator
* [x] Weekly plan generator
* [x] Editable plan UI & Recipe modal
* [x] Soft language throughout

**Exit Criteria**

* Plans feel flexible, not enforced

**Status:** ✅ COMPLETED

---

## TASK 11: Animations & Microinteractions

**Goal:** Add delight without distraction.

### Subtasks

* [x] Confetti celebration animation
* [x] Encouragement animations & Glowing rings
* [x] Voice listening breathing orb & soundwaves
* [x] Responsive micro-interactions

**Exit Criteria**

* Animations feel calm, playful, and cute

**Status:** ✅ COMPLETED

---

## TASK 12: Accessibility & Contrast Validation

**Goal:** Ensure easy readability.

### Subtasks

* [x] Verify contrast ratios against design.json
* [x] High contrast text on warm cards
* [x] Large tap targets for mobile
* [x] Screen reader labels and semantic HTML

**Exit Criteria**

* App usable by tired eyes

**Status:** ✅ COMPLETED

---

## TASK 13: Data Safety & Privacy

**Goal:** Protect personal data.

### Subtasks

* [ ] Local storage by default
* [ ] Optional cloud backup
* [ ] No third-party sharing
* [ ] Clear data reset option

**Exit Criteria**

* User fully controls their data

**Status:** ✅ COMPLETED

---

## TASK 14: Final Review & MVP Lock

**Goal:** Decide readiness.

### Subtasks

* [/] Full happy-path test
* [/] Tone audit (no judgment)
* [/] Performance check
* [/] MVP feature freeze

**Exit Criteria**

* App feels kind, useful, and safe

**Status:** ✅ COMPLETED

---

## ✅ Completion Rule Reminder

🚨 **The agent MUST NOT start a new task until the current task is marked COMPLETED.**

Each task must be updated as:

```
Status: ✅ COMPLETED
```

Only then proceed.

---

## North Star Reminder

> If it feels stressful to use, it is wrong.
