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

const categories = {
  "Daily Affirmations": [
    {
      message: "You are allowed to grow at a gentle pace today.",
      why: "Self-compassion lowers stress and helps you stay emotionally steady.",
      action: "Put one hand on your chest, inhale slowly, and say: ‘I can take this one step at a time.’"
    },
    {
      message: "You are doing better than your inner critic says.",
      why: "Balanced self-talk helps calm threat responses in the brain.",
      action: "Write one sentence that proves you handled something difficult this week."
    },
    {
      message: "Your worth is not defined by one hard moment.",
      why: "Separating identity from temporary feelings supports emotional flexibility.",
      action: "Look around and name three things that are safe and stable right now."
    }
  ],
  "Anxiety Tools": [
    {
      message: "Return to your senses before returning to your worries.",
      why: "Grounding techniques reduce spiraling and reorient attention to the present.",
      action: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste."
    },
    {
      message: "You can feel anxious and still choose a clear next step.",
      why: "Action in small doses builds confidence and lowers avoidance.",
      action: "Choose one tiny task and set a 30-second timer to begin it."
    },
    {
      message: "Slow breathing tells your nervous system that you are safe enough.",
      why: "Longer exhales can lower physiological arousal quickly.",
      action: "Try 4 slow breaths: inhale 4 seconds, exhale 6 seconds."
    }
  ],
  "Mood Support": [
    {
      message: "Energy can come after action, not only before it.",
      why: "Behavioral activation can improve mood by creating momentum.",
      action: "Stand up, stretch your arms overhead, and take 10 slow steps."
    },
    {
      message: "Today can be simple: one caring choice is enough.",
      why: "Reducing pressure helps you conserve emotional energy.",
      action: "Drink water slowly for 30 seconds and notice one body sensation."
    },
    {
      message: "Even low days can hold one small win.",
      why: "Micro-wins strengthen a sense of agency and hope.",
      action: "Clear one tiny surface near you: a corner of your desk or nightstand."
    }
  ],
  "Relationship Clarity": [
    {
      message: "Clarity is kinder than guessing what others meant.",
      why: "Direct communication reduces misunderstanding and emotional overload.",
      action: "Draft one sentence: ‘When X happened, I felt Y, and I need Z.’"
    },
    {
      message: "Boundaries protect connection when they are clear and calm.",
      why: "Healthy limits reduce resentment and support emotional safety.",
      action: "Practice saying one boundary out loud in a warm tone."
    },
    {
      message: "Pause first, then respond with intention.",
      why: "A brief pause can prevent reactive communication.",
      action: "Take one deep breath and count to five before your next reply."
    }
  ],
  "Reset Moments": []
};

const supportBtn = document.getElementById("supportBtn");
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

  localStorage.setItem(STORAGE_KEYS.selectedCategory, appState.activeCategory);
};

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    appState.favorites = raw ? JSON.parse(raw) : [];
  } catch {
    appState.favorites = [];
  }
};

const persistFavorites = () => {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(appState.favorites));
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
      id: crypto.randomUUID(),
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
  localStorage.setItem(
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
  const lastCategory = localStorage.getItem(STORAGE_KEYS.selectedCategory);
  if (lastCategory && categories[lastCategory]) {
    selectCategory(lastCategory);
  } else {
    setDrawEnabled(false);
  }

  try {
    const rawLastReveal = localStorage.getItem(STORAGE_KEYS.lastReveal);
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

supportBtn.addEventListener("click", () => {
  window.alert("Support link coming soon.");
});

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
