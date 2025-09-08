# Infinite Truth-or-Dare


## Project overview

This project provides a static framework and data model for party-style games plus (eventually) an extensible system for *customizing* and *generating* new questions using LLMs. It’s inspired by boring, repetitive question lists on many sites — we want questions that feel fresh, contextual, and safe.

Key ideas:

* Collection of curated questions for several party mini-games (truth or dare, put-a-finger-down, who’s most likely, etc.).
* Allowing users to **prompt an AI** to generate new question sets or variants.
* Letting users to **rate** or **flag** questions (good / bad), plus moderation filters.
* Exportable, seedable JSON format so the app can remain static while supporting local generation.

---

# Features

* Multiple game types (Truth or Dare, Put a Finger Down, Who's Most Likely, Never Have I Ever, Custom).
* Tagging and filtering (age-appropriateness, theme, intensity, relationship-level).
* AI generation: prompt templates to produce new, on-theme questions.
* Community feedback: thumbs up / thumbs down, duplicate detection and quality score.
* Safety pipeline: profanity & toxicity checks, adult-content toggle, length limits.
* Static-first: all functionality works with a local JSON file and a static site.

---

1. Clone the repo

```bash
git clone https://github.com/Aarav-g123/Infinite-truth-or-dare.git
cd Infinite-truth-or-dare
```

2. Run the app (entry point: `index.html`)

* Open `index.html` in your browser directly (double-click) — this works for purely static features.

---

# Data format (questions.json)

Keep question objects small and extensible. Example schema (JSON):

```json
[
  {
    "id": "truth-0001",
    "game": "truth",
    "text": "What's the most embarrassing thing that's ever happened to you?",
    "tags": ["embarrassing", "personal"],
    "age_rating": 13,
    "intensity": 3,
    "language": "en",
    "created_by": "seed",
    "created_at": "2025-09-01T12:00:00Z",
    "score": 4.7,
    "flags": []
  }
]
```

Field notes:

* `id`: unique string (prefix by game type for convenience).
* `game`: string: truth, dare, pfd (put-finger-down), likely, never, etc.
* `tags`: used for filtering and theming.
* `age_rating`: integer, minimum appropriate age (e.g., 13, 16, 18).
* `intensity`: 1-5 scale (1 = chill, 5 = extreme).
* `score`: aggregate rating (user feedback).

---

# Sample questions (seed)

```json
[
  {"id":"truth-0001","game":"truth","text":"What's the most embarrassing thing you've done for attention?","tags":["embarrassing"],"age_rating":16,"intensity":3},
  {"id":"dare-0001","game":"dare","text":"Sing the chorus of your favorite song out loud for 30 seconds.","tags":["music","fun"],"age_rating":0,"intensity":1},
  {"id":"pfd-0001","game":"pfd","text":"Put a finger down if you've ever gone on a date from a dating app.","tags":["dating","modern"],"age_rating":18,"intensity":1}
]
```

---

# AI integration — prompt templates & examples

Below are example prompt templates to send to an LLM. Tailor temperature, max tokens, and safety settings in your API call.

## 1) Generate N questions for a game and theme

```
PROMPT: "You are a friendly party-game writer. Produce {N} {game} questions tagged with theme: {theme}. For each item return JSON objects with fields: id, game, text, tags, age_rating (number), intensity (1-5). Keep each text under 140 characters and avoid explicit sexual content unless age_rating >= 18. Output must be valid JSON array only."
```

### Example call data (pseudo):

```json
{ "N": 10, "game": "truth", "theme": "college nights" }
```

## 2) Re-write / sanitize a question

```
PROMPT: "Rewrite the following question to be friendlier and non-offensive, preserving meaning: \"{question}\". Output single JSON: { \"text\": \"...\", \"suggested_age_rating\": number }"
```

## 3) Rate / classify questions (good vs. bad)

```
PROMPT: "Given the following list of questions, mark each as 'good' or 'bad' and provide a short reason (max 15 words). A 'bad' question is offensive, too sexual for its rating, or unclear."
```

**Important:** Use model output only as a *suggestion*. Always run automated filters (profanity, PII removal) and optionally a human review step before publishing.

---

# Example server API (optional)

Small express-style endpoints to support the UI:

```js
// GET /api/games
// returns list of available games
app.get('/api/games', (req, res) => {
  res.json(["truth", "dare", "pfd", "likely", "never"])
})
```

---

# Safety & moderation notes

* Always run profanity/toxicity checks on AI-generated content.
* Strip or redact PII (names, phone numbers, emails) before publishing.
* Provide an "adult content" toggle and honor region-based age limits.

