# MindLift Daily Demo

A calming front-end prototype for a subscription wellness app inspired by a mindful magic-8-ball interaction.

## Features

- Weekly subscription unlock flow (`$4.99/week` placeholder)
- Multiple support categories (affirmations + psychology tools)
- Same interaction pattern in each category:
  - quiet message space
  - reveal button
  - randomized message on each press
- Prevents immediate back-to-back duplicate messages in the same category
- Blurry glassmorphism phone-style container with a mood-stabilizing palette (white, gray, black, soft blue, soft green, soft gold)

## Run

Because this is a static app, you can open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
