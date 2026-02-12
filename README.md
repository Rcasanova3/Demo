# A Better Thought

A calm, mobile-first static web app with multiple support spaces and category-based thought prompts.

## What it does

- No subscription required (all features are immediately available)
- Space selector with localStorage persistence (default: Personal)
- Spaces included:
  - Personal (20 fixed categories, unchanged)
  - Work, Parents, Relationships, Single, Student, ADHD, Caregiver, Military/Veteran, Entrepreneur
- Category list updates based on selected Space
- Reveal flow:
  - Pick category
  - Reveal a better thought
  - Show me another better thought / Save this thought / Share this thought
- Modular message generator (openers + reframes + actions + closers) with shuffle-bag history to reduce repeats
- Saved thoughts include section/space, category, text, and timestamp
- Favorites page filter: All | Personal | Parents
- Share supports Web Share API; clipboard fallback when native share is unavailable

## Run locally

This project is plain HTML/CSS/JS and works with no build step.

From the repo root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

Deploy directly from the repository root on your Pages branch. No dependencies or build tools are required.
