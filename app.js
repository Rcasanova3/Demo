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

const PERSONAL_KEYWORDS = {
  Gratitude: ["appreciate", "thanks", "grat", "notice"],
  Calm: ["calm", "breath", "slow", "settle"],
  Joy: ["joy", "pleasant", "smile", "light"],
  Hope: ["hope", "next", "future", "possible"],
  Confidence: ["confid", "evidence", "capable", "trust"],
  Focused: ["focus", "priority", "single", "attention"],
  Motivated: ["start", "momentum", "action", "begin"],
  Connected: ["connect", "reach", "check-in", "support"],
  Balanced: ["balance", "pace", "pause", "limit"],
  Overwhelmed: ["overwhelm", "one", "simpl", "manageable"],
  Anxious: ["anx", "present", "breath", "certainty"],
  Distracted: ["distract", "attention", "close", "single"],
  Unmotivated: ["start", "small", "first", "begin"],
  Selfdoubt: ["doubt", "evidence", "facts", "trust"],
  Angry: ["anger", "pause", "space", "response"],
  Sad: ["sad", "kind", "care", "gentle"],
  Guilt: ["guilt", "repair", "amend", "responsibility"],
  Lonely: ["lonely", "connect", "reach", "contact"],
  Burnout: ["burnout", "energy", "boundary", "rest"],
  Overthinking: ["overthink", "decision", "limit", "action"]
};

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
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeStorageSet = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
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
      const ids = new Set();
      const whyCounts = new Map();

      (cards || []).forEach((card, index) => {
        const issues = [];
        if (!card?.id || typeof card.id !== "string" || !card.id.trim()) issues.push("missing id");
        if (!card?.main || typeof card.main !== "string" || !card.main.trim()) issues.push("missing main");
        if (!card?.why || typeof card.why !== "string" || !card.why.trim()) issues.push("missing why");
        if (card?.id && ids.has(card.id)) issues.push(`duplicate id '${card.id}'`);
        if (card?.id) ids.add(card.id);

        if (issues.length) {
          console.warn("[A Better Thought] Invalid card", { space, category, index, issues, card });
        }

        const normalizedWhy = (card?.why || "").trim().toLowerCase();
        if (normalizedWhy) whyCounts.set(normalizedWhy, (whyCounts.get(normalizedWhy) || 0) + 1);

        if (space === "Personal") {
          const keywords = PERSONAL_KEYWORDS[category] || [];
          const whyText = normalizedWhy;
          const hasKeyword = keywords.some((kw) => whyText.includes(kw));
          if (!hasKeyword) {
            console.warn("[A Better Thought] possible mismatch", { space, category, id: card?.id, why: card?.why });
          }
        }
      });

      whyCounts.forEach((count, whyText) => {
        if (count >= 4) {
          console.warn("[A Better Thought] repeated why text", { space, category, count, why: whyText });
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
    const button = document.createElement("button");
    button.type = "button";
    button.className = `space-btn ${space === appState.activeSpace ? "is-active" : ""}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(space === appState.activeSpace));
    button.textContent = space;
    button.addEventListener("click", () => {
      appState.activeSpace = space;
      safeStorageSet(STORAGE_KEYS.activeSpace, space);
      appState.selectedCategory = appState.selectedCategoryBySpace[space] || "";
      renderSpaceSwitch();
      renderCategoryOptions();
      setRevealState();
    });
    spaceSwitch.appendChild(button);
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
      space,
      category,
      main: "One clear next step is enough for this moment.",
      why: "A focused step reduces decision fatigue and gives your mind a stable target.",
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
  appState.shownCardIds[key] = [...(appState.shownCardIds[key] || []), selected.id];
  safeStorageSet(STORAGE_KEYS.shownCardIds, JSON.stringify(appState.shownCardIds));

  return { ...selected, timestamp: Date.now() };
};

const isThoughtSaved = (card) => {
  if (!card) return false;
  return appState.savedThoughts.some(
    (item) => item.section === card.space && item.category === card.category && item.text === card.main
  );
};

const saveCurrentThought = () => {
  if (!appState.currentCard || isThoughtSaved(appState.currentCard)) return;
  appState.savedThoughts.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    section: appState.currentCard.space,
    category: appState.currentCard.category,
    text: appState.currentCard.main,
    why: appState.currentCard.why,
    timestamp: appState.currentCard.timestamp
  });
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const removeCurrentThoughtFromSaved = () => {
  if (!appState.currentCard) return;
  appState.savedThoughts = appState.savedThoughts.filter(
    (item) => !(item.section === appState.currentCard.space && item.category === appState.currentCard.category && item.text === appState.currentCard.main)
  );
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const toggleCurrentThoughtSaved = () => {
  if (isThoughtSaved(appState.currentCard)) removeCurrentThoughtFromSaved();
  else saveCurrentThought();
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
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

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillRect(96, 120, 888, 1110);

  ctx.fillStyle = "#1d232d";
  ctx.font = "700 54px Plus Jakarta Sans, sans-serif";
  ctx.fillText("A Better Thought", 150, 250);

  ctx.font = "600 32px Plus Jakarta Sans, sans-serif";
  ctx.fillStyle = "#394150";
  ctx.fillText(`${card.space} · ${card.category}`, 150, 310);

  ctx.font = "700 46px Plus Jakarta Sans, sans-serif";
  ctx.fillStyle = "#121722";
  wrapText(ctx, card.main, 760).forEach((line, idx) => ctx.fillText(line, 150, 430 + idx * 62));

  ctx.font = "600 31px Plus Jakarta Sans, sans-serif";
  ctx.fillStyle = "#2f3746";
  wrapText(ctx, `Why this helps: ${card.why}`, 760).forEach((line, idx) => ctx.fillText(line, 150, 760 + idx * 48));

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
};

const shareThought = async (card = appState.currentCard) => {
  if (!card) return;
  const text = `${card.main}\n\nWhy this helps: ${card.why}`;

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
      // fallback
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

  const saved = isThoughtSaved(card);
  thoughtBubble.classList.remove("is-revealed");
  thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span class="thought-tag">MESSAGE</span>
        <span class="last-shown">Last shown: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="Share thought">⤴</button>
      </p>
      <p class="thought-text">${card.main}</p>
      <div class="thought-divider" aria-hidden="true"></div>
      <p class="thought-detail"><strong>Why this helps:</strong> ${card.why}</p>
    </article>
  `;

  document.getElementById("cardFavoriteBtn")?.addEventListener("click", () => {
    toggleCurrentThoughtSaved();
    renderThought(card, false);
    renderSaved();
  });
  document.getElementById("cardShareBtn")?.addEventListener("click", () => shareThought(card));

  if (postActions) postActions.hidden = false;
  if (animate) requestAnimationFrame(() => thoughtBubble.classList.add("is-revealed"));
};

const revealThought = (excludeId = null) => {
  if (!appState.selectedCategory) return;
  renderThought(getNextCard(appState.activeSpace, appState.selectedCategory, excludeId), true);
};

const renderSaved = () => {
  if (!savedList) return;
  savedList.innerHTML = "";

  const items = appState.savedFilter === "all"
    ? appState.savedThoughts
    : appState.savedThoughts.filter((item) => toFilterKey(item.section) === appState.savedFilter);

  if (!items.length) {
    savedList.innerHTML = '<li class="saved-empty">No saved thoughts yet.</li>';
    if (clearSavedBtn) clearSavedBtn.hidden = appState.savedThoughts.length === 0;
    return;
  }

  items.forEach((item) => {
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
      shareThought({ space: item.section, category: item.category, main: item.text, why: item.why || "", timestamp: item.timestamp });
    });
  });
};

const renderSavedFilters = () => {
  if (!savedFilterControls) return;
  const options = [{ value: "all", label: "All" }, ...SPACE_KEYS.map((space) => ({ value: toFilterKey(space), label: space }))];
  savedFilterControls.innerHTML = '<span class="saved-filter-label">Saved:</span>';

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${appState.savedFilter === option.value ? "is-active" : ""}`;
    btn.textContent = option.label;
    btn.addEventListener("click", () => {
      appState.savedFilter = option.value;
      safeStorageSet(STORAGE_KEYS.savedFilter, option.value);
      renderSavedFilters();
      renderSaved();
    });
    savedFilterControls.appendChild(btn);
  });
};

const restoreState = () => {
  const active = safeStorageGet(STORAGE_KEYS.activeSpace);
  if (active && SPACES[active]) appState.activeSpace = active;

  try {
    const selected = JSON.parse(safeStorageGet(STORAGE_KEYS.selectedCategoryBySpace) || "{}");
    SPACE_KEYS.forEach((space) => { appState.selectedCategoryBySpace[space] = selected[space] || ""; });
  } catch { /* ignore */ }

  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEYS.savedThoughts) || "[]");
    appState.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch { appState.savedThoughts = []; }

  try {
    const shown = JSON.parse(safeStorageGet(STORAGE_KEYS.shownCardIds) || "{}");
    appState.shownCardIds = shown && typeof shown === "object" ? shown : {};
  } catch { appState.shownCardIds = {}; }

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
  saveBtn?.addEventListener("click", () => {
    saveCurrentThought();
    renderThought(appState.currentCard, false);
  });
  shareBtn?.addEventListener("click", () => shareThought(appState.currentCard));

  try {
    const last = JSON.parse(safeStorageGet(STORAGE_KEYS.lastThought) || "null");
    if (last?.space === appState.activeSpace && last?.category) {
      renderThought(last, false);
    }
  } catch { /* ignore */ }
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

if (document.body.dataset.page === "favorites") initFavoritesPage();
else initHomePage();
