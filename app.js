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

const roundRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const ensureSharePreviewModal = () => {
  let modal = document.getElementById("sharePreviewModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "sharePreviewModal";
  modal.className = "share-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="share-modal-backdrop" data-close-share-modal></div>
    <div class="share-modal-card" role="dialog" aria-modal="true" aria-label="Share image preview">
      <h3>Share image ready</h3>
      <img id="sharePreviewImage" alt="Preview of share image" />
      <div class="share-modal-actions">
        <a id="shareDownloadLink" class="btn btn-secondary" download="a-better-thought.png">Download PNG</a>
        <button type="button" class="btn btn-tertiary" data-close-share-modal>Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll("[data-close-share-modal]").forEach((element) => {
    element.addEventListener("click", () => {
      modal.hidden = true;
      const img = modal.querySelector("#sharePreviewImage");
      if (img?.dataset?.url) URL.revokeObjectURL(img.dataset.url);
      if (img) {
        img.removeAttribute("src");
        delete img.dataset.url;
      }
    });
  });

  return modal;
};

const openSharePreview = (blob) => {
  const modal = ensureSharePreviewModal();
  const img = modal.querySelector("#sharePreviewImage");
  const download = modal.querySelector("#shareDownloadLink");
  if (!img || !download) return;

  if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
  const url = URL.createObjectURL(blob);
  img.src = url;
  img.dataset.url = url;
  download.href = url;
  modal.hidden = false;
};

const setShareLoadingState = (button, isLoading) => {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.dataset.prevText = button.textContent;
    button.textContent = button.classList.contains("icon-btn") ? "…" : "Preparing share image…";
    return;
  }

  button.disabled = false;
  button.removeAttribute("aria-busy");
  if (button.dataset.prevText) {
    button.textContent = button.dataset.prevText;
    delete button.dataset.prevText;
  }
};

const generateShareImage = async (messageText) => {
  const outputWidth = 1080;
  const outputHeight = 1350;
  const scale = 2;

  const workCanvas = document.createElement("canvas");
  workCanvas.width = outputWidth * scale;
  workCanvas.height = outputHeight * scale;
  const workCtx = workCanvas.getContext("2d");
  if (!workCtx) return null;

  workCtx.scale(scale, scale);

  const gradient = workCtx.createLinearGradient(0, 0, outputWidth, outputHeight);
  gradient.addColorStop(0, "#eef1f4");
  gradient.addColorStop(0.5, "#f6f4ef");
  gradient.addColorStop(1, "#dde2e7");
  workCtx.fillStyle = gradient;
  workCtx.fillRect(0, 0, outputWidth, outputHeight);

  const orbs = [
    { x: 160, y: 240, r: 260, color: "rgba(194, 201, 212, 0.25)" },
    { x: 890, y: 420, r: 320, color: "rgba(220, 214, 205, 0.22)" },
    { x: 540, y: 1080, r: 290, color: "rgba(184, 195, 204, 0.2)" }
  ];

  orbs.forEach((orb) => {
    workCtx.save();
    workCtx.filter = "blur(56px)";
    workCtx.fillStyle = orb.color;
    workCtx.beginPath();
    workCtx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    workCtx.fill();
    workCtx.restore();
  });

  roundRectPath(workCtx, 110, 130, 860, 1090, 28);
  workCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
  workCtx.fill();
  workCtx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  workCtx.lineWidth = 1.5;
  workCtx.stroke();

  roundRectPath(workCtx, 136, 154, 808, 36, 18);
  workCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
  workCtx.fill();

  workCtx.shadowColor = "rgba(27, 34, 44, 0.12)";
  workCtx.shadowBlur = 26;
  workCtx.shadowOffsetY = 10;
  roundRectPath(workCtx, 110, 130, 860, 1090, 28);
  workCtx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  workCtx.stroke();
  workCtx.shadowColor = "transparent";

  workCtx.font = "600 54px Plus Jakarta Sans, system-ui, sans-serif";
  workCtx.fillStyle = "#1f2630";
  workCtx.textAlign = "left";

  const maxTextWidth = 760;
  const lines = wrapText(workCtx, messageText, maxTextWidth);
  const lineHeight = 72;
  const blockHeight = lines.length * lineHeight;
  const startY = 130 + ((1090 - blockHeight) / 2) + lineHeight * 0.25;

  lines.forEach((line, index) => {
    workCtx.fillText(line, 170, startY + index * lineHeight);
  });

  const grain = workCtx.createImageData(outputWidth, outputHeight);
  for (let i = 0; i < grain.data.length; i += 4) {
    const value = Math.floor(Math.random() * 255);
    grain.data[i] = value;
    grain.data[i + 1] = value;
    grain.data[i + 2] = value;
    grain.data[i + 3] = 7;
  }
  workCtx.putImageData(grain, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = outputWidth;
  outCanvas.height = outputHeight;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) return null;
  outCtx.drawImage(workCanvas, 0, 0, outputWidth, outputHeight);

  return new Promise((resolve) => outCanvas.toBlob((blob) => resolve(blob), "image/png"));
};

const shareThought = async (card = appState.currentCard, triggerButton = null) => {
  const messageText = card?.main?.trim();
  if (!messageText) {
    window.alert("Reveal a better thought first.");
    return;
  }

  setShareLoadingState(triggerButton, true);
  try {
    const blob = await generateShareImage(messageText);
    if (!blob) {
      window.alert("Could not prepare the share image.");
      return;
    }

    const file = new File([blob], "a-better-thought.png", { type: "image/png" });
    const canNativeShare = Boolean(navigator.share && navigator.canShare?.({ files: [file] }));

    if (canNativeShare) {
      await navigator.share({ files: [file], title: "Share" });
      return;
    }

    openSharePreview(blob);
  } catch {
    window.alert("Could not share right now. Please try again.");
  } finally {
    setShareLoadingState(triggerButton, false);
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
  document.getElementById("cardShareBtn")?.addEventListener("click", (event) => shareThought(card, event.currentTarget));

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
      shareThought({ space: item.section, category: item.category, main: item.text, why: item.why || "", timestamp: item.timestamp }, btn);
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
