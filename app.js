const STORAGE_KEYS = {
  activeSpace: "abetterthought.activeSpace",
  selectedCategoryBySpace: "abetterthought.selectedCategoryBySpace",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  shownCardIds: "abetterthought.shownCardIds",
  savedFilter: "abetterthought.savedFilter"
};

const { SPACES = {}, messageCards = {} } = window.APP_CONTENT || {};
const SPACE_KEYS = Object.keys(SPACES);

const appState = {
  activeSpace: SPACE_KEYS[0] || "Personal",
  selectedCategoryBySpace: SPACE_KEYS.reduce((acc, space) => ({ ...acc, [space]: "" }), {}),
  selectedCategory: "",
  savedThoughts: [],
  currentCard: null,
  shownCardIds: {},
  savedFilter: "all"
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
    // ignore
  }
};

const safeStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

const spaceSwitch = document.getElementById("spaceSwitch");
const categorySelect = document.getElementById("categorySelect");
const activeCategoryLabel = document.getElementById("activeCategoryLabel");
const revealHelper = document.getElementById("revealHelper");
const thoughtBubble = document.getElementById("thoughtBubble");
const revealBtn = document.getElementById("revealBtn");
const anotherBtn = document.getElementById("anotherBtn");
const saveBtn = document.getElementById("saveBtn");
const shareBtn = document.getElementById("shareBtn");
const postActions = document.getElementById("postActions");

const savedList = document.getElementById("savedList");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const savedFilterControls = document.getElementById("savedFilterControls");

const toFilterKey = (space) => String(space || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const cardKey = (space, category) => `${space}::${category}`;

const getCards = (space, category) => messageCards?.[space]?.[category] || [];

const validateCards = () => {
  Object.entries(messageCards).forEach(([space, byCategory]) => {
    Object.entries(byCategory || {}).forEach(([category, cards]) => {
      const seen = new Set();
      (cards || []).forEach((card, idx) => {
        const problems = [];
        if (!card || typeof card !== "object") problems.push("card is not an object");
        if (!card?.id || typeof card.id !== "string" || !card.id.trim()) problems.push("missing id");
        if (!card?.main || typeof card.main !== "string" || !card.main.trim()) problems.push("missing main");
        if (!card?.why || typeof card.why !== "string" || !card.why.trim()) problems.push("missing why");
        if (!card?.do || typeof card.do !== "string" || !card.do.trim()) problems.push("missing do");
        if (card?.id && seen.has(card.id)) problems.push(`duplicate id '${card.id}'`);
        if (card?.id) seen.add(card.id);
        if (problems.length) {
          console.warn("[A Better Thought] Invalid message card", { space, category, index: idx, card, problems });
        }
      });
    });
  });
};

const setRevealState = () => {
  const hasCategory = Boolean(appState.selectedCategory);
  if (revealBtn) revealBtn.disabled = !hasCategory;

  if (activeCategoryLabel) {
    activeCategoryLabel.textContent = hasCategory ? `${appState.activeSpace} · ${appState.selectedCategory}` : "No category selected";
  }
  if (revealHelper) {
    revealHelper.textContent = hasCategory ? "Tap reveal to get a thought card." : "Pick a category to reveal your message.";
  }
};

const renderSpaceSwitch = () => {
  if (!spaceSwitch) return;
  spaceSwitch.innerHTML = "";

  SPACE_KEYS.forEach((space) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `space-btn ${space === appState.activeSpace ? "is-active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(space === appState.activeSpace));
    btn.textContent = space;

    btn.addEventListener("click", () => {
      appState.activeSpace = space;
      safeStorageSet(STORAGE_KEYS.activeSpace, appState.activeSpace);
      appState.selectedCategory = appState.selectedCategoryBySpace[space] || "";
      renderSpaceSwitch();
      renderCategoryOptions();
      setRevealState();
    });

    spaceSwitch.appendChild(btn);
  });
};

const renderCategoryOptions = () => {
  if (!categorySelect) return;
  const categories = [...(SPACES[appState.activeSpace] || [])].sort((a, b) => a.localeCompare(b));
  categorySelect.innerHTML = '<option value="">Select a category</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  categorySelect.value = categories.includes(appState.selectedCategory) ? appState.selectedCategory : "";
};

const getNextCard = (space, category, excludeId = null) => {
  const cards = getCards(space, category);
  if (!cards.length) {
    return {
      id: `${toFilterKey(space)}-${toFilterKey(category)}-fallback`,
      main: "One clear step is enough for this moment.",
      why: "This helps because small concrete steps reduce overwhelm and create momentum.",
      do: "Choose one tiny next step and begin it for 60 seconds.",
      space,
      category,
      timestamp: Date.now()
    };
  }

  const key = cardKey(space, category);
  const shown = Array.isArray(appState.shownCardIds[key]) ? appState.shownCardIds[key] : [];
  let available = cards.filter((card) => !shown.includes(card.id) && card.id !== excludeId);

  if (!available.length) {
    appState.shownCardIds[key] = [];
    available = cards.filter((card) => card.id !== excludeId);
  }

  if (!available.length) available = cards;

  const selected = available[Math.floor(Math.random() * available.length)];
  const nextShown = [...(appState.shownCardIds[key] || []), selected.id];
  appState.shownCardIds[key] = nextShown;
  safeStorageSet(STORAGE_KEYS.shownCardIds, JSON.stringify(appState.shownCardIds));

  return { ...selected, space, category, timestamp: Date.now() };
};

const saveCurrentThought = () => {
  if (!appState.currentCard) return;
  const exists = appState.savedThoughts.some(
    (item) => item.space === appState.currentCard.space && item.category === appState.currentCard.category && item.text === appState.currentCard.main
  );
  if (exists) return;

  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  appState.savedThoughts.unshift({
    id,
    section: appState.currentCard.space,
    category: appState.currentCard.category,
    text: appState.currentCard.main,
    why: appState.currentCard.why,
    do: appState.currentCard.do,
    timestamp: appState.currentCard.timestamp
  });
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  });
  if (line) lines.push(line);
  return lines;
};

const generateShareImage = async (card) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, "#eff1f4");
  gradient.addColorStop(1, "#dadfe6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  const x = 95;
  const y = 150;
  const w = 890;
  const h = 1000;
  const r = 48;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1d232d";
  ctx.font = "700 54px Plus Jakarta Sans, sans-serif";
  ctx.fillText("A Better Thought", 150, 250);

  ctx.font = "600 32px Plus Jakarta Sans, sans-serif";
  ctx.fillStyle = "#394150";
  ctx.fillText(`${card.space} · ${card.category}`, 150, 310);

  ctx.font = "700 46px Plus Jakarta Sans, sans-serif";
  ctx.fillStyle = "#121722";
  wrapText(ctx, card.main, 760).forEach((line, idx) => ctx.fillText(line, 150, 440 + idx * 62));

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
};

const shareThought = async (card = appState.currentCard) => {
  if (!card) return;
  const text = `${card.main}\n\nWhy this helps: ${card.why}\nDo this now: ${card.do}`;

  if (navigator.share) {
    try {
      const blob = await generateShareImage(card);
      const file = blob ? new File([blob], "a-better-thought.png", { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "A Better Thought", text, files: [file] });
        return;
      }
      await navigator.share({ title: "A Better Thought", text });
      return;
    } catch {
      // fallback below
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    window.alert("Copied to clipboard.");
  } else {
    window.alert(text);
  }
};

const renderThought = (card, animate = true) => {
  if (!thoughtBubble || !card) return;
  appState.currentCard = card;
  safeStorageSet(STORAGE_KEYS.lastThought, JSON.stringify(card));

  thoughtBubble.classList.remove("is-revealed");
  thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span class="thought-tag">MESSAGE</span>
        <span class="last-shown">Last shown: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </p>
      <p class="thought-text">${card.main}</p>
      <div class="thought-divider" aria-hidden="true"></div>
      <p class="thought-detail"><strong>Why this helps:</strong> ${card.why}</p>
      <p class="thought-detail"><strong>Do this now:</strong> ${card.do}</p>
    </article>
  `;

  if (postActions) postActions.hidden = false;
  if (animate) requestAnimationFrame(() => thoughtBubble.classList.add("is-revealed"));
};

const revealThought = (excludeId = null) => {
  if (!appState.selectedCategory) return;
  const card = getNextCard(appState.activeSpace, appState.selectedCategory, excludeId);
  renderThought(card, true);
};

const renderSaved = () => {
  if (!savedList) return;
  savedList.innerHTML = "";

  const visible = appState.savedFilter === "all"
    ? appState.savedThoughts
    : appState.savedThoughts.filter((item) => toFilterKey(item.section) === appState.savedFilter);

  if (!visible.length) {
    savedList.innerHTML = '<li class="saved-empty">No saved thoughts yet.</li>';
    if (clearSavedBtn) clearSavedBtn.hidden = appState.savedThoughts.length === 0;
    return;
  }

  visible.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.innerHTML = `
      <p class="saved-meta">${new Date(item.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
      <p class="saved-section">${item.section} · ${item.category}</p>
      <p class="saved-text">${item.text}</p>
      <div class="saved-actions">
        <button type="button" class="btn btn-tertiary" data-share-id="${item.id}">Share</button>
        <button type="button" class="btn btn-tertiary" data-remove-id="${item.id}">Remove</button>
      </div>
    `;
    savedList.appendChild(li);
  });

  if (clearSavedBtn) clearSavedBtn.hidden = false;

  savedList.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.savedThoughts = appState.savedThoughts.filter((item) => item.id !== btn.dataset.removeId);
      safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
      renderSaved();
    });
  });

  savedList.querySelectorAll("[data-share-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = appState.savedThoughts.find((entry) => entry.id === btn.dataset.shareId);
      if (!item) return;
      shareThought({ space: item.section, category: item.category, main: item.text, why: item.why || "", do: item.do || "", timestamp: item.timestamp });
    });
  });
};

const renderSavedFilters = () => {
  if (!savedFilterControls) return;

  const options = [
    { value: "all", label: "All" },
    ...SPACE_KEYS.map((space) => ({ value: toFilterKey(space), label: space }))
  ];

  savedFilterControls.innerHTML = '<span class="saved-filter-label">Saved:</span>';
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-btn ${appState.savedFilter === option.value ? "is-active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      appState.savedFilter = option.value;
      safeStorageSet(STORAGE_KEYS.savedFilter, option.value);
      renderSavedFilters();
      renderSaved();
    });
    savedFilterControls.appendChild(button);
  });
};

const restoreState = () => {
  const active = safeStorageGet(STORAGE_KEYS.activeSpace);
  if (active && SPACES[active]) appState.activeSpace = active;

  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEYS.savedThoughts) || "[]");
    appState.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch {
    appState.savedThoughts = [];
  }

  try {
    const selectedBySpace = JSON.parse(safeStorageGet(STORAGE_KEYS.selectedCategoryBySpace) || "{}");
    SPACE_KEYS.forEach((space) => {
      appState.selectedCategoryBySpace[space] = selectedBySpace[space] || "";
    });
  } catch {
    // ignore
  }

  try {
    const shown = JSON.parse(safeStorageGet(STORAGE_KEYS.shownCardIds) || "{}");
    appState.shownCardIds = shown && typeof shown === "object" ? shown : {};
  } catch {
    appState.shownCardIds = {};
  }

  const savedFilter = safeStorageGet(STORAGE_KEYS.savedFilter);
  if (savedFilter) appState.savedFilter = savedFilter;

  appState.selectedCategory = appState.selectedCategoryBySpace[appState.activeSpace] || "";
};

const initHomePage = () => {
  validateCards();
  restoreState();

  renderSpaceSwitch();
  renderCategoryOptions();
  setRevealState();

  categorySelect?.addEventListener("change", (event) => {
    appState.selectedCategory = event.target.value;
    appState.selectedCategoryBySpace[appState.activeSpace] = appState.selectedCategory;
    safeStorageSet(STORAGE_KEYS.selectedCategoryBySpace, JSON.stringify(appState.selectedCategoryBySpace));
    setRevealState();
  });

  revealBtn?.addEventListener("click", () => revealThought(null));
  anotherBtn?.addEventListener("click", () => revealThought(appState.currentCard?.id || null));
  saveBtn?.addEventListener("click", () => saveCurrentThought());
  shareBtn?.addEventListener("click", () => shareThought());

  try {
    const last = JSON.parse(safeStorageGet(STORAGE_KEYS.lastThought) || "null");
    if (last?.space === appState.activeSpace) renderThought(last, false);
  } catch {
    // ignore
  }
};

const initFavoritesPage = () => {
  restoreState();
  renderSavedFilters();
  renderSaved();

  clearSavedBtn?.addEventListener("click", () => {
    appState.savedThoughts = [];
    safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
    renderSaved();
  });
};

if (document.body.dataset.page === "favorites") {
  initFavoritesPage();
} else {
  initHomePage();
}
