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
const sharePreviewModal = document.getElementById("sharePreviewModal");
const shareModalBackdrop = document.getElementById("shareModalBackdrop");
const shareModalCard = document.getElementById("shareModalCard");
const sharePreviewImg = document.getElementById("sharePreviewImg");
const sharePreviewError = document.getElementById("sharePreviewError");
const shareDownloadLink = document.getElementById("shareDownloadLink");
const shareNativeBtn = document.getElementById("shareNativeBtn");
const shareCloseBtn = document.getElementById("shareCloseBtn");

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

let activeShareUrl = null;
let activeShareBlob = null;
let escapeListenerBound = false;

const closeShareModal = () => {
  if (!sharePreviewModal) return;
  sharePreviewModal.hidden = true;
  sharePreviewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (activeShareUrl) {
    URL.revokeObjectURL(activeShareUrl);
    activeShareUrl = null;
  }
  activeShareBlob = null;

  if (sharePreviewImg) {
    sharePreviewImg.removeAttribute("src");
    sharePreviewImg.hidden = true;
  }
  if (sharePreviewError) {
    sharePreviewError.textContent = "";
    sharePreviewError.hidden = true;
  }
  if (shareDownloadLink) {
    shareDownloadLink.removeAttribute("href");
    shareDownloadLink.removeAttribute("download");
    shareDownloadLink.hidden = true;
  }
  if (shareNativeBtn) shareNativeBtn.hidden = true;
};

const openShareModal = () => {
  if (!sharePreviewModal) return;
  sharePreviewModal.hidden = false;
  sharePreviewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const showShareError = (message) => {
  if (sharePreviewImg) {
    sharePreviewImg.hidden = true;
    sharePreviewImg.removeAttribute("src");
  }
  if (shareDownloadLink) shareDownloadLink.hidden = true;
  if (shareNativeBtn) shareNativeBtn.hidden = true;
  if (sharePreviewError) {
    sharePreviewError.hidden = false;
    sharePreviewError.textContent = message;
  }
  openShareModal();
};

const bindShareModalEvents = () => {
  if (!sharePreviewModal || sharePreviewModal.dataset.bound === "true") return;

  shareModalBackdrop?.addEventListener("click", closeShareModal);
  shareCloseBtn?.addEventListener("click", closeShareModal);
  shareModalCard?.addEventListener("click", (event) => event.stopPropagation());

  if (!escapeListenerBound) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sharePreviewModal && !sharePreviewModal.hidden) {
        closeShareModal();
      }
    });
    escapeListenerBound = true;
  }

  shareDownloadLink?.addEventListener("click", (event) => {
    if (!activeShareUrl) {
      event.preventDefault();
      return;
    }
    shareDownloadLink.href = activeShareUrl;
    shareDownloadLink.download = "a-better-thought.png";
  });

  shareNativeBtn?.addEventListener("click", async () => {
    if (!activeShareBlob || !navigator.share) return;
    try {
      const file = new File([activeShareBlob], "a-better-thought.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "A Better Thought" });
    } catch {
      // ignore
    }
  });

  sharePreviewModal.dataset.bound = "true";
};

const setShareLoadingState = (button, isLoading) => {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.dataset.prevText = button.textContent;
    button.textContent = button.classList.contains("icon-btn") ? "…" : "Preparing share image...";
    return;
  }

  button.disabled = false;
  button.removeAttribute("aria-busy");
  if (button.dataset.prevText) {
    button.textContent = button.dataset.prevText;
    delete button.dataset.prevText;
  }
};

const toBlobFromDataUrl = (dataUrl) => {
  const [header, data] = dataUrl.split(",");
  const mime = (header.match(/data:(.*?);base64/) || [])[1] || "image/png";
  const bytes = atob(data);
  const len = bytes.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const wrapPosterText = (ctx, text, maxWidth, maxLines = 8) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      return;
    }

    if (line) lines.push(line);
    line = word;
  });

  if (line) lines.push(line);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    const lastIndex = maxLines - 1;
    while (trimmed[lastIndex].length > 1 && ctx.measureText(`${trimmed[lastIndex]}…`).width > maxWidth) {
      trimmed[lastIndex] = trimmed[lastIndex].slice(0, -1);
    }
    trimmed[lastIndex] = `${trimmed[lastIndex]}…`;
    return trimmed;
  }

  return lines;
};

const generateSharePoster = async ({ appName, tagline, space, category, message }) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Reveal a better thought first.");
  }

  await document.fonts?.ready;

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context is unavailable.");

  ctx.fillStyle = "#F6F3EE";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#121212";
  ctx.beginPath();
  ctx.arc(8, 8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#121212";
  ctx.font = '600 40px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(appName, 100, 124);

  ctx.fillStyle = "#2b2b2b";
  ctx.font = '500 28px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(tagline, 100, 166);

  ctx.strokeStyle = "#1f1f1f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 204);
  ctx.lineTo(980, 204);
  ctx.stroke();

  ctx.fillStyle = "#161616";
  ctx.font = "700 132px Georgia, 'Times New Roman', serif";
  ctx.fillText(category || "Message", 100, 372);

  ctx.fillStyle = "#313131";
  ctx.font = '500 30px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(`${space || "Personal"} • ${category || "Message"}`, 104, 426);

  ctx.fillStyle = "#121212";
  ctx.font = '600 62px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  const lines = wrapPosterText(ctx, message.trim(), 860, 8);
  const lineHeight = 66;
  const blockHeight = lines.length * lineHeight;
  const startY = 620 + (420 - blockHeight) / 2 + 24;
  lines.forEach((line, idx) => {
    ctx.fillText(line, 110, startY + idx * lineHeight);
  });

  ctx.fillStyle = "#373737";
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText("rcasanova3.github.io/Demo", 100, 1268);

  let blob = await new Promise((resolve) => canvas.toBlob((value) => resolve(value), "image/png", 1));
  if (!blob) {
    const dataUrl = canvas.toDataURL("image/png", 1);
    blob = toBlobFromDataUrl(dataUrl);
  }

  const url = URL.createObjectURL(blob);
  return { blob, url };
};

const shareThought = async (card = appState.currentCard, triggerButton = null) => {
  const messageText = card?.main?.trim();
  if (!messageText) {
    showShareError("Reveal a better thought first.");
    return;
  }

  setShareLoadingState(triggerButton, true);
  try {
    bindShareModalEvents();
    const { blob, url } = await generateSharePoster({
      appName: "A Better Thought",
      tagline: "One small shift. Big difference.",
      space: card.space || appState.activeSpace || "Personal",
      category: card.category || appState.selectedCategory || "Message",
      message: messageText
    });

    if (activeShareUrl) URL.revokeObjectURL(activeShareUrl);
    activeShareBlob = blob;
    activeShareUrl = url;

    if (sharePreviewError) {
      sharePreviewError.hidden = true;
      sharePreviewError.textContent = "";
    }
    if (sharePreviewImg) {
      sharePreviewImg.hidden = false;
      sharePreviewImg.src = url;
    }
    if (shareDownloadLink) {
      shareDownloadLink.hidden = false;
      shareDownloadLink.href = url;
      shareDownloadLink.download = "a-better-thought.png";
    }

    const file = new File([blob], "a-better-thought.png", { type: "image/png" });
    const canNativeShare = Boolean(navigator.share && navigator.canShare?.({ files: [file] }));
    if (shareNativeBtn) {
      shareNativeBtn.hidden = !canNativeShare;
      shareNativeBtn.disabled = !canNativeShare;
    }

    openShareModal();
  } catch (err) {
    console.error("Share poster generation failed", {
      error: err,
      canvasWidth: 1080,
      canvasHeight: 1350,
      messageLength: messageText ? messageText.length : 0
    });
    showShareError("Could not prepare the share image. Please try again.");
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
