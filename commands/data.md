# Data

## Questions

20 multiple-choice math questions. 15 are hand-written, 5 are auto-generated padding.

### Topics

| Topic        | Count (hand-written) |
|--------------|----------------------|
| ALGEBRA      | 5                    |
| GEOMETRY     | 3                    |
| CALCULUS     | 3                    |
| STATISTICS   | 2                    |
| NUMBER THEORY| 2                    |

### Question Shape

```js
{
  topic: "ALGEBRA",        // category label (uppercase)
  text: "Question text",   // the question string
  opts: ["A", "B", "C", "D"],  // exactly 4 options
  correct: 0               // zero-based index of correct answer
}
```

### Auto-Padding

Questions 16–20 are generated in a `while` loop to reach 20 total. They cycle through the 5 topics and use placeholder text. The correct answer index cycles as `index % 4`.

## Student Registration

Collected via the Register form:

| Field       | Required | Type   | Example              |
|-------------|----------|--------|----------------------|
| firstName   | ✅       | string | Aibek                |
| lastName    | ✅       | string | Umarov               |
| email       | ✅       | email  | aibek@example.com    |
| phone       | ❌       | string | +996 700 000 000     |
| school      | ❌       | string | School No. 1, Bishkek|
| year        | ❌       | select | 2026 / 2025 / 2024 / 2023 |

## Exam Config

| Parameter     | Value  |
|---------------|--------|
| Total questions | 20   |
| Time limit    | 3600s (60 min) |
| Timer warning | < 300s (5 min) |
| Attempts      | 1      |

## Result Shape

```js
{
  correct: 14,       // number of correct answers
  total: 20,         // total questions
  elapsed: 1823      // seconds taken
}
```

## Grading Scale

| Score Range | Grade              | Color   |
|-------------|--------------------|---------|
| ≥ 80%       | Excellent          | #1b8c5e |
| ≥ 65%       | Good               | #1976d2 |
| ≥ 50%       | Satisfactory       | #e8a020 |
| < 50%       | Needs Improvement  | #c0392b |

## Color Tokens

```js
COLORS = {
  navy: "#0b1f3a",    navy2: "#122848",
  blue: "#1565c0",    blueLight: "#1976d2",
  accent: "#e8a020",  white: "#ffffff",
  off: "#f4f6fa",     border: "#dde3ed",
  text: "#1a2535",    muted: "#6b7a95",
  success: "#1b8c5e", danger: "#c0392b",
  bg: "#f0f3f9"
}
```
