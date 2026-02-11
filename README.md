# MindLift Daily Demo

A simple front-end prototype for a subscription wellness app inspired by a magic 8-ball interaction.

## Features

- Weekly subscription unlock flow (`$4.99/week` placeholder)
- Multiple categories (affirmations + psychology tools)
- Same interaction pattern in each category:
  - blank message area
  - reveal button
  - randomized message on each press
- Prevents immediate back-to-back duplicate message in the same category

## Run

Because this is a static app, you can open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
