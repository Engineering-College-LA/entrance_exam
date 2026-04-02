# Architecture

## Overview

Single-page frontend application — one self-contained `index.html` file. No build tools, no server. Opens directly in any browser.

## Tech Stack

- **React 18** — CDN (`unpkg.com`)
- **Babel Standalone** — in-browser JSX transpilation
- **Vanilla CSS** — inline styles via JS objects
- **Google Fonts** — Inter typeface

## File Structure

```
ec_entrance_exam/
├── index.html          # Entire app
└── commands/
    ├── architecture.md # This file
    └── data.md         # Questions, constants, config
```

## SOLID Layered Architecture

The code is organized into 6 clearly separated layers inside `index.html`:

### 1. Data Layer (Single Source of Truth)
Constants and configuration — no logic:
- `COLORS` — design tokens
- `EXAM_CONFIG` — timer, question count, thresholds
- `GRADE_SCALE` — scoring brackets
- `BASE_QUESTIONS` — hand-written questions
- `REGISTRATION_FIELDS` — form field definitions
- `EXAM_RULES` — instruction cards
- `PAGES` / `STEP_NAMES` — navigation metadata

### 2. Services (Pure Functions — SRP)
Stateless utility objects:
- `QuestionService` — builds question array with padding
- `GradingService` — score, percentage, grade, topic breakdown
- `TimeService` — format seconds, warning check
- `ValidationService` — registration form validation

### 3. Styles (Design Tokens → Style Objects — OCP)
Shared `Styles` object with reusable style factories:
- `Styles.btnPrimary(color)` — returns button style with given bg
- `Styles.card`, `Styles.input`, `Styles.label`, etc.

### 4. Custom Hooks (Encapsulated Logic — SRP + ISP)
- `useTimer(duration, onExpire)` — countdown with formatting
- `useExamState(questions)` — current question, answers, navigation
- `useFormState(fields)` — form values + per-field setter
- `usePageNav()` — page, student, result state

### 5. UI Primitives (Small, Reusable — SRP + ISP)
Each does one thing:
- `Breadcrumb`, `StepBar`, `InfoBanner`
- `FormField`, `OptionCard`, `NavDot`, `RuleCard`
- `StatBox`, `ScoreRing`, `TopicBar`

### 6. Page Components (Compose Primitives — OCP + DIP)
- `Header` — sticky top bar
- `Landing` — hero page
- `Register` — uses `useFormState` + `FormField`
- `Instructions` — uses `RuleCard`
- `Exam` — uses `useExamState` + `useTimer` + `OptionCard` + `NavDot`
- `Report` — uses `GradingService` + `ScoreRing` + `TopicBar` + `StatBox`

### 7. App (Orchestrator — DIP)
- Uses `usePageNav()` hook
- Renders pages via conditional rendering
- Depends only on abstractions (hook interfaces)

## Component Tree

```
App (usePageNav)
├── Header
├── Landing
├── Register (useFormState → FormField×6)
├── Instructions (RuleCard×4)
├── Exam (useExamState + useTimer → OptionCard + NavDot)
└── Report (GradingService → ScoreRing + StatBox + TopicBar)
```

## Page Flow

```
Landing → Register → Instructions → Exam → Report → Landing
```

## Rules

- No build step — single HTML file
- No external JS beyond React + Babel CDN
- No routing library — conditional rendering
- Data layer has zero logic
- Services are pure functions
- Hooks encapsulate all stateful logic
- UI primitives receive only the props they need (ISP)
