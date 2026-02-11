const appState = {
  subscribed: false,
  activeCategory: null,
  previousMessageByCategory: {}
};

const categories = {
  "Daily Affirmations": [
    "You are building a stronger version of yourself one small choice at a time.",
    "Your effort today matters, even if progress feels quiet.",
    "You deserve patience from yourself while you heal and grow.",
    "The way you speak to yourself can become your greatest superpower.",
    "You have already survived difficult days—you can handle this one too.",
    "Your calm is available to you, one breath at a time."
  ],
  "Anxiety Tools": [
    "Grounding reset: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    "Ask: Is this a current danger, or a future worry? Respond only to what is here now.",
    "Try box breathing: inhale 4, hold 4, exhale 4, hold 4. Repeat for one minute.",
    "Shrink the moment: What is the next smallest helpful action you can take?",
    "Tell yourself: 'I can feel anxious and still make a wise decision.'",
    "Set a 10-minute worry window later. For now, return to your present task."
  ],
  "Mood Support": [
    "Do one 2-minute win right now—make your bed, drink water, or stretch.",
    "Reach out to one person you trust with a simple check-in text.",
    "Open sunlight, fresh air, and movement for 10 minutes. Let your body help your mind.",
    "When motivation is low, use momentum: start for just 5 minutes.",
    "Write one sentence: 'Today is hard, and I am still trying.'",
    "Focus on 'good enough' today instead of perfect."
  ],
  "Relationship Clarity": [
    "Use this script: 'When X happened, I felt Y, and I need Z.'",
    "Before reacting, ask: What outcome do I want from this conversation?",
    "Boundaries are not punishment—they are instructions for healthy connection.",
    "If you're overwhelmed, request a pause and choose a time to revisit the issue.",
    "Choose curiosity first: 'Help me understand what you meant.'",
    "You can care deeply and still say no."
  ]
};

const subscribeBtn = document.getElementById("subscribeBtn");
const categoryList = document.getElementById("categoryList");
const oraclePanel = document.getElementById("oraclePanel");
const categoryTitle = document.getElementById("categoryTitle");
const messageBox = document.getElementById("messageBox");
const drawBtn = document.getElementById("drawBtn");

const setMessage = (text, isFilled = false) => {
  messageBox.textContent = text;
  messageBox.classList.toggle("filled", isFilled);
};

const getDifferentMessage = (categoryName) => {
  const pool = categories[categoryName];
  const previous = appState.previousMessageByCategory[categoryName];

  if (pool.length <= 1) {
    return pool[0];
  }

  let next = pool[Math.floor(Math.random() * pool.length)];

  while (next === previous) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }

  appState.previousMessageByCategory[categoryName] = next;
  return next;
};

const setActiveCategory = (categoryName) => {
  appState.activeCategory = categoryName;

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === categoryName);
  });

  oraclePanel.hidden = false;
  categoryTitle.textContent = categoryName;
  setMessage("", false);
};

const buildCategoryButtons = () => {
  const names = Object.keys(categories);

  names.forEach((name) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.dataset.category = name;
    button.textContent = name;

    button.addEventListener("click", () => {
      if (!appState.subscribed) {
        setMessage("Subscribe to unlock category messages.", false);
        return;
      }

      setActiveCategory(name);
    });

    categoryList.appendChild(button);
  });
};

subscribeBtn.addEventListener("click", () => {
  appState.subscribed = true;
  subscribeBtn.textContent = "Subscribed ✔";
  subscribeBtn.disabled = true;
  subscribeBtn.classList.add("subscription-status");
  setMessage("Subscription active! Choose a category to begin.", false);
});

drawBtn.addEventListener("click", () => {
  if (!appState.subscribed) {
    setMessage("Subscribe to reveal messages.", false);
    return;
  }

  if (!appState.activeCategory) {
    setMessage("Select a category first.", false);
    return;
  }

  const message = getDifferentMessage(appState.activeCategory);
  setMessage(message, true);
});

buildCategoryButtons();
setMessage("Your message will appear here.", false);
