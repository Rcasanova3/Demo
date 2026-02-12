const STORAGE_KEYS = {
  selectedCategory: "mindlift.selectedCategory",
  lastReveal: "mindlift.lastReveal",
  favorites: "mindlift.favorites"
};

const appState = {
  activeCategory: null,
  previousMessageByCategory: {},
  favorites: []
};

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable
  }
};

const buildYearCategory = (config) => {
  const entries = [];

  for (let i = 0; i < 365; i += 1) {
    const opener = config.openers[i % config.openers.length];
    const focus = config.focuses[i % config.focuses.length];
    const anchor = config.anchors[i % config.anchors.length];
    const mechanism = config.mechanisms[i % config.mechanisms.length];
    const action = config.actions[i % config.actions.length];

    entries.push({
      message: `Day ${i + 1}: ${opener} ${focus} ${anchor}.`,
      why: `${mechanism} ${config.whyTail}`,
      action: `${action} ${config.actionTail}`
    });
  }

  return entries;
};

const categories = {
  "Daily Affirmations": buildYearCategory({
    openers: [
      "You are allowed to move gently today.",
      "Your effort still matters, even when it feels quiet.",
      "You can honor your pace and still make progress.",
      "You are not behind—you are becoming.",
      "You can be kind to yourself and committed at the same time."
    ],
    focuses: [
      "Notice one thing you handled with care",
      "Remember a hard moment you already survived",
      "Let your self-talk become steadier",
      "Choose one small win over perfection",
      "Treat today as practice, not a final exam"
    ],
    anchors: [
      "in this chapter",
      "for this next hour",
      "before your next task",
      "while you reset",
      "in this present moment"
    ],
    mechanisms: [
      "Compassionate self-talk lowers stress reactivity and improves emotional regulation.",
      "Grounded affirmations reduce threat-based thinking and increase mental flexibility.",
      "Small positive reframes support steadier mood patterns over time.",
      "Self-validation helps your nervous system shift from urgency toward safety.",
      "Repeated constructive thoughts can weaken harsh inner-critic loops."
    ],
    whyTail: "Even short reminders can improve resilience when repeated daily.",
    actions: [
      "Place one hand on your chest and take two slow breaths.",
      "Say one supportive sentence to yourself out loud.",
      "Write one line beginning with: ‘I am learning to…’.",
      "Name one thing you did well in the last 24 hours.",
      "Relax your jaw and shoulders, then exhale slowly."
    ],
    actionTail: "Keep it to 30 seconds and then continue your day."
  }),
  "Anxiety Tools": buildYearCategory({
    openers: [
      "You can feel anxious and still choose your next step.",
      "Return to your senses before returning to your worries.",
      "A slower breath can send a safety signal.",
      "You do not need to solve everything in one minute.",
      "Uncertainty is uncomfortable, not always dangerous."
    ],
    focuses: [
      "Orient to what is real right now",
      "Separate present facts from future stories",
      "Shrink the moment into one doable action",
      "Lower body tension before problem-solving",
      "Pause to interrupt spiraling"
    ],
    anchors: [
      "with gentle attention",
      "in your current environment",
      "for this single moment",
      "before your next decision",
      "as you re-center"
    ],
    mechanisms: [
      "Grounding helps shift attention from catastrophic thinking to present sensory input.",
      "Longer exhales can reduce physiological arousal through parasympathetic activation.",
      "Breaking tasks into micro-steps lowers avoidance and increases perceived control.",
      "Naming worries as thoughts can reduce fusion with anxious narratives.",
      "Brief body-based regulation can reduce panic intensity quickly."
    ],
    whyTail: "Frequent short practices make anxious episodes easier to navigate.",
    actions: [
      "Name 5 things you see and 4 things you feel.",
      "Inhale for 4, exhale for 6, and repeat 3 times.",
      "Put both feet on the floor and press down gently.",
      "Ask: ‘What is one next step I can do now?’",
      "Cold-rinse your hands and notice the sensation."
    ],
    actionTail: "Use only 30 seconds to reset your nervous system."
  }),
  "Mood Support": buildYearCategory({
    openers: [
      "Low energy days still count.",
      "Momentum can come after movement.",
      "You only need one small action right now.",
      "A softer day can still be a successful day.",
      "You can support your mood with tiny choices."
    ],
    focuses: [
      "Aim for good enough instead of perfect",
      "Create one visible micro-win",
      "Reconnect with your body before your to-do list",
      "Choose a kind next action",
      "Reduce pressure and increase consistency"
    ],
    anchors: [
      "for this afternoon",
      "in your current space",
      "at your current energy level",
      "for the next 30 minutes",
      "without overthinking"
    ],
    mechanisms: [
      "Behavioral activation can improve mood by pairing action with agency.",
      "Micro-completions increase motivation through quick reward feedback.",
      "Gentle movement can reduce emotional heaviness and cognitive fog.",
      "Small structured actions reduce overwhelm and indecision.",
      "Lowering perfection pressure supports sustainable emotional recovery."
    ],
    whyTail: "Consistency with tiny actions is often more effective than intensity.",
    actions: [
      "Stand, stretch overhead, and take 10 slow steps.",
      "Drink water slowly and notice three sensations.",
      "Open a window or step outside for fresh air.",
      "Clear one small surface near you.",
      "Send one short check-in text to someone safe."
    ],
    actionTail: "Do just 30 seconds, then choose whether to continue."
  }),
  "Relationship Clarity": buildYearCategory({
    openers: [
      "Clarity is kinder than assumptions.",
      "Boundaries can protect connection.",
      "Pause before reacting so you can respond with intention.",
      "You can be direct and respectful at the same time.",
      "Curiosity often calms conflict faster than certainty."
    ],
    focuses: [
      "Name the outcome you want from this conversation",
      "Speak from feelings and needs, not accusations",
      "Choose your tone before your words",
      "Protect your energy with one clear limit",
      "Slow the pace of reactive communication"
    ],
    anchors: [
      "in your next interaction",
      "for this relationship moment",
      "before replying",
      "when emotions rise",
      "during this difficult exchange"
    ],
    mechanisms: [
      "Clear communication reduces ambiguity and emotional escalation.",
      "Boundary language lowers resentment and increases psychological safety.",
      "Intentional pauses can prevent reactive patterns from taking over.",
      "Needs-based phrasing improves the chance of constructive dialogue.",
      "Choosing curiosity helps reduce defensive cycles."
    ],
    whyTail: "Practicing concise clarity builds healthier relationship habits over time.",
    actions: [
      "Draft one sentence: ‘When X happened, I felt Y, and I need Z.’",
      "Take one breath before you send your next message.",
      "Replace one assumption with one clarifying question.",
      "Say one boundary in a calm, neutral tone.",
      "Write the outcome you want in five words."
    ],
    actionTail: "Keep it brief—30 seconds is enough to reset your approach."
  }),
  "Reset Moments": buildYearCategory({
    openers: [
      "A reset can begin in less than a minute.",
      "You can pause without losing momentum.",
      "Your body can help your mind settle.",
      "A short reset is still real care.",
      "You can return to center right now."
    ],
    focuses: [
      "Clear mental noise with one sensory anchor",
      "Reset your posture and breathing",
      "Interrupt autopilot with one mindful pause",
      "Bring attention back to the present",
      "Create a calm transition to your next task"
    ],
    anchors: [
      "between activities",
      "during a busy moment",
      "before starting again",
      "when your mind feels crowded",
      "in the middle of your day"
    ],
    mechanisms: [
      "Brief mindful pauses reduce cognitive overload and improve focus recovery.",
      "Body-based resets can lower stress signals quickly.",
      "Attention anchoring can decrease mental fragmentation.",
      "Micro-regulation improves emotional steadiness during transitions.",
      "Intentional pauses support better decision quality under stress."
    ],
    whyTail: "Tiny resets repeated daily can stabilize attention and mood.",
    actions: [
      "Roll your shoulders back and exhale slowly.",
      "Look at one object and describe three details.",
      "Unclench your hands and soften your jaw.",
      "Do one slow inhale and one slower exhale.",
      "Take five deliberate steps with full attention."
    ],
    actionTail: "Use 30 seconds to reset, then continue with intention."
  })
};

const categoryList = document.getElementById("categoryList");
const categoryTitle = document.getElementById("categoryTitle");
const revealHint = document.getElementById("revealHint");
const messageBox = document.getElementById("messageBox");
const drawBtn = document.getElementById("drawBtn");
const drawAnotherBtn = document.getElementById("drawAnotherBtn");
const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const persistSelectedCategory = () => {
  if (!appState.activeCategory) {
    return;
  }

  safeStorageSet(STORAGE_KEYS.selectedCategory, appState.activeCategory);
};

const loadFavorites = () => {
  try {
    const raw = safeStorageGet(STORAGE_KEYS.favorites);
    appState.favorites = raw ? JSON.parse(raw) : [];
  } catch {
    appState.favorites = [];
  }
};

const persistFavorites = () => {
  safeStorageSet(STORAGE_KEYS.favorites, JSON.stringify(appState.favorites));
};

const setDrawEnabled = (enabled) => {
  drawBtn.disabled = !enabled;

  if (!enabled) {
    revealHint.textContent = "Pick a category to reveal your message.";
  } else {
    revealHint.textContent = "Tap Reveal when you're ready.";
  }
};

const buildMessageCardHTML = (entry, timestamp, showAnimation = true) => {
  const lastShown = timestamp ? `<p class="last-shown">Last shown: ${formatTime(timestamp)}</p>` : "";

  return `
    <article class="message-card ${showAnimation ? "reveal-in" : ""}">
      <header class="message-header">
        <h3>${entry.category}</h3>
        ${lastShown}
      </header>
      <p class="message-main">${entry.message}</p>
      <p><strong>Why this helps:</strong> ${entry.why}</p>
      <p><strong>Do this now (30 seconds):</strong> ${entry.action}</p>
      <div class="message-actions">
        <button id="saveMessageBtn" class="secondary-btn" type="button">Save</button>
      </div>
    </article>
  `;
};

const renderMessageCard = (entry, timestamp, showAnimation = true) => {
  messageBox.classList.add("filled");
  messageBox.innerHTML = buildMessageCardHTML(entry, timestamp, showAnimation);

  const saveBtn = document.getElementById("saveMessageBtn");
  saveBtn?.addEventListener("click", () => {
    const alreadySaved = appState.favorites.some(
      (favorite) => favorite.category === entry.category && favorite.message === entry.message
    );

    if (alreadySaved) {
      saveBtn.textContent = "Saved";
      return;
    }

    appState.favorites.unshift({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: entry.category,
      message: entry.message
    });

    persistFavorites();
    renderFavorites();
    saveBtn.textContent = "Saved";
  });
};

const fallbackEntry = (categoryName) => ({
  category: categoryName,
  message: "No messages are available in this category yet.",
  why: "A gentle fallback keeps your routine uninterrupted while content is updated.",
  action: "Take three slow breaths and choose any other category for a fresh prompt."
});

const getDifferentMessage = (categoryName) => {
  const pool = categories[categoryName] || [];
  const previous = appState.previousMessageByCategory[categoryName];

  if (!pool.length) {
    return fallbackEntry(categoryName);
  }

  if (pool.length === 1) {
    const only = { ...pool[0], category: categoryName };
    appState.previousMessageByCategory[categoryName] = only.message;
    return only;
  }

  let next = pool[Math.floor(Math.random() * pool.length)];

  while (next.message === previous) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }

  appState.previousMessageByCategory[categoryName] = next.message;
  return { ...next, category: categoryName };
};

const saveLastReveal = (entry, timestamp) => {
  safeStorageSet(
    STORAGE_KEYS.lastReveal,
    JSON.stringify({
      category: entry.category,
      message: entry.message,
      why: entry.why,
      action: entry.action,
      timestamp
    })
  );
};

const selectCategory = (categoryName) => {
  appState.activeCategory = categoryName;

  document.querySelectorAll(".category-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === categoryName);
    button.setAttribute("aria-pressed", button.dataset.category === categoryName ? "true" : "false");
  });

  categoryTitle.textContent = categoryName;
  setDrawEnabled(true);
  persistSelectedCategory();
};

const renderFavorites = () => {
  favoritesList.innerHTML = "";

  if (!appState.favorites.length) {
    favoritesEmpty.hidden = false;
    return;
  }

  favoritesEmpty.hidden = true;

  appState.favorites.forEach((favorite) => {
    const item = document.createElement("li");
    item.className = "favorite-item";

    item.innerHTML = `
      <div>
        <p class="favorite-category">${favorite.category}</p>
        <p class="favorite-message">${favorite.message}</p>
      </div>
      <button class="ghost-btn" data-remove-id="${favorite.id}" type="button">Remove</button>
    `;

    favoritesList.appendChild(item);
  });

  favoritesList.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.favorites = appState.favorites.filter(
        (favorite) => favorite.id !== button.dataset.removeId
      );
      persistFavorites();
      renderFavorites();
    });
  });
};

const revealMessage = (showAnimation = true) => {
  if (!appState.activeCategory) {
    setDrawEnabled(false);
    return;
  }

  const entry = getDifferentMessage(appState.activeCategory);
  const timestamp = Date.now();

  renderMessageCard(entry, timestamp, showAnimation);
  saveLastReveal(entry, timestamp);
  drawAnotherBtn.hidden = false;
};

const restoreFromStorage = () => {
  const lastCategory = safeStorageGet(STORAGE_KEYS.selectedCategory);
  if (lastCategory && categories[lastCategory]) {
    selectCategory(lastCategory);
  } else {
    setDrawEnabled(false);
  }

  try {
    const rawLastReveal = safeStorageGet(STORAGE_KEYS.lastReveal);
    if (!rawLastReveal) {
      return;
    }

    const lastReveal = JSON.parse(rawLastReveal);
    if (!lastReveal?.category || !lastReveal?.message) {
      return;
    }

    if (categories[lastReveal.category]) {
      selectCategory(lastReveal.category);
    }

    renderMessageCard(
      {
        category: lastReveal.category,
        message: lastReveal.message,
        why: lastReveal.why,
        action: lastReveal.action
      },
      lastReveal.timestamp,
      false
    );

    appState.previousMessageByCategory[lastReveal.category] = lastReveal.message;
    drawAnotherBtn.hidden = false;
  } catch {
    // ignore invalid localStorage payloads
  }
};

const buildCategoryButtons = () => {
  Object.keys(categories).forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-btn";
    button.dataset.category = name;
    button.textContent = name;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      selectCategory(name);
    });

    categoryList.appendChild(button);
  });
};

drawBtn.addEventListener("click", () => {
  revealMessage(true);
});

drawAnotherBtn.addEventListener("click", () => {
  revealMessage(true);
});

buildCategoryButtons();
loadFavorites();
renderFavorites();
restoreFromStorage();
