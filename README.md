# A Better Thought

A calm, mobile-first static web app with multiple support spaces and category-based thought cards.

## What it does

- No subscription required (all features are immediately available)
- Space selector with localStorage persistence (default: Personal)
- Spaces included:
  - Personal (20 fixed categories, unchanged)
  - Work, Parents, Relationships, Single, Student, ADHD, Caregiver, Military/Veteran, Entrepreneur
- Category list updates based on selected Space
- Reveal flow:
  - Pick category
  - Reveal message card (main + Why this helps)
  - Use in-card icons (favorite star + share)
- Message cards are stored in one consistent structure: `messageCards[space][category] = [{ id, space, category, main, why }]`
- Repeat minimization:
  - Tracks shown card IDs per Space+Category in localStorage
  - Avoids repeats until all cards for that Space+Category are shown, then resets
- Dev validation on load warns in console if any card has missing fields or duplicate IDs
- Favorites include space, category, text, and timestamp
- Favorites page supports filtering by All or any Space
- Share creates a 1080×1350 PNG with only the revealed core message and opens native file share when supported; otherwise shows a preview with download

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
