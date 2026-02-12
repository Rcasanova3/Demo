# MindLift Daily Demo

A calming static web app for daily affirmations and practical psychological micro-tools.

## Features

- Fully accessible with no paywall or support gate (works offline in a browser)
- Category chips with clear active state and high-contrast keyboard focus
- 3-step onboarding guidance:
  1. Pick a category
  2. Tap Reveal
  3. Try the 30-second action
- Reveal is disabled until a category is selected, with helper guidance
- 365 prompts per category (message + why it helps + 30-second action)
- Structured message card output with:
  - category title
  - short message
  - "Why this helps"
  - "Do this now (30 seconds)"
- Prevents immediate back-to-back duplicate prompts in the same category
- Friendly fallback when a category has no messages
- Continuity via localStorage:
  - last selected category
  - last revealed card
  - "Last shown" timestamp on reload
- Save favorites locally with remove actions
- Share button exports a minimalist JPEG affirmation card for sharing across apps
- Glass-style, mood-stabilizing UI palette for a gentle experience

## Run locally

This is a static site. Serve it from the repo root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## GitHub Pages

This project is GitHub Pages ready as-is (no build step, no dependencies). Deploy from the repository root on your configured Pages branch.
