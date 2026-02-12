# A Better Thought

A calm, mobile-first static web app that helps people shift their mindset with category-based supportive messages and quick 30-second actions.

## What it does

- No subscription required (all features are immediately available)
- Category dropdown picker with ordering filter
- Reveal flow with tailored thought + why it helps + 30-second action
- Reveal flow uses **Reveal message** and avoids immediate repeats in the same category
- Save thoughts to localStorage with timestamp + category
- Dedicated `favorites.html` page to review/remove saved thoughts or clear all
- Persists selected category and last revealed thought between visits
- Share flow on phones using Web Share API:
  - Attempts to share a generated PNG thought card (canvas)
  - Falls back to text sharing when file sharing is unsupported
  - Falls back to downloading the generated image when sharing is unavailable

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

You can also open `index.html` directly in a browser.

## GitHub Pages

This repo is ready for GitHub Pages deployment from the branch root (no dependencies, no build tools).
