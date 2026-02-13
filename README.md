# A Better Thought

A calm, mobile-first static web app with multiple support spaces and category-based thought cards.

## What it does

- No subscription required (all features are immediately available)
- Multi-select space chips with localStorage persistence (default: Personal)
- Spaces included:
  - Personal (20 fixed categories, unchanged)
  - Work, Parents, Relationships, Single, Student, ADHD, Caregiver, Military/Veteran, Entrepreneur
- Category dropdown supports multi-select across the union of selected spaces (zero selected categories is treated as All categories)
- Reveal flow:
  - Choose one or more spaces
  - Choose one or more categories (or leave empty for All categories)
  - Reveal mixed-pool message card (main + Why this helps)
  - Secondary actions: Show me another better thought, Save this thought, Share this thought
  - In-card quick actions: favorite star + share icon
- Message cards support bilingual text with fallback: `main` and `why` can be language maps (`en` / `es`) and fall back to English when missing
- Repeat minimization tracks shown card IDs for the current mixed selection bucket and avoids immediate duplicates
- Dev validation on load warns in console if any card has missing fields or duplicate IDs
- Language selector (English/Español) updates UI labels, space/category labels, modal/favorites text, and message content; selection persists in localStorage
- Favorites include space, category, text, and timestamp
- Favorites page supports filtering by All or any Space
- Share creates a branded 1080×1350 poster PNG (app name, tagline, selected space, selected category, and core message), opens a preview modal, supports download, and shows native file share when available

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
