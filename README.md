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

2. Run the app 

### Option 1: Direct File Access (Limited Functionality)

Open `index.html` in your browser directly (double-click) --- this works
for purely static features but data loading may not work properly due to
browser security restrictions.

------------------------------------------------------------------------

### Option 2: Local Server (Recommended for Full Functionality)

1.  Open your terminal or command prompt\

2.  Navigate to the project directory:

    ``` bash
    cd party-games-website
    ```

3.  Run the Python HTTP server:

    ``` bash
    python -m http.server 8000
    ```

4.  Open your browser and go to:\
    <http://localhost:8000>

Using the local server ensures all features work correctly, including
data loading from JSON files.


---

# Data format (put-finger-down.json)

Keep question objects small and extensible. Example schema (JSON):

```json
[
  "Put a finger down if you've ever pretended to be sick to get out of something",
  "Put a finger down if you've ever cried during a cartoon movie",
  "Put a finger down if you've ever sung in the shower",
  "Put a finger down if you've ever danced when no one was watching",
  "Put a finger down if you've ever fallen in public and played it off",
  "Put a finger down if you've ever had a crush on a teacher",
  "Put a finger down if you've ever stolen something from a store",
  "Put a finger down if you've ever lied about your age",
  "Put a finger down if you've ever had a dream about a celebrity",
  "Put a finger down if you've ever been scared of a children's movie"
]
```


