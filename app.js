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

const buildYearCategory = (theme) => {
  const entries = [];

  for (let i = 0; i < 365; i += 1) {
    const opener = theme.openers[i % theme.openers.length];
    const focus = theme.focuses[i % theme.focuses.length];
    const anchor = theme.anchors[i % theme.anchors.length];
    const mechanism = theme.mechanisms[i % theme.mechanisms.length];
    const action = theme.actions[i % theme.actions.length];

    entries.push({
      message: `${opener} ${focus} ${anchor}.`,
      why: `${mechanism} ${theme.whyTail}`,
      action: `${action} ${theme.actionTail}`
    });
  }

  return entries;
};

const categoryThemes = {
  Gratitude: {
    openers: ["There is still good in this moment.", "Your mind can notice what supports you.", "Small appreciation can shift your day."],
    focuses: ["Name one thing that is working", "Honor one person or moment", "Let your attention include the good"],
    anchors: ["right now", "in this day", "before sleep"],
    mechanisms: ["Gratitude broadens perspective and reduces stress bias.", "Appreciation supports emotional regulation.", "Positive noticing strengthens resilience over time."],
    whyTail: "Frequent gratitude practices can stabilize mood.",
    actions: ["List one thing you are grateful for.", "Send one short thank-you message.", "Name one moment you want to remember from today."],
    actionTail: "Use 30 seconds to anchor in appreciation."
  },
  Calm: {
    openers: ["Calm can return one breath at a time.", "Your body can guide your mind toward steadiness.", "You are allowed to slow down."],
    focuses: ["Release tension in your shoulders", "Soften your breathing rhythm", "Choose a slower internal pace"],
    anchors: ["in this moment", "for the next minute", "before your next task"],
    mechanisms: ["Slower breathing can reduce nervous system arousal.", "Body relaxation helps lower stress intensity.", "Brief regulation improves emotional steadiness."],
    whyTail: "Micro-calming habits build durable self-regulation.",
    actions: ["Inhale for 4 and exhale for 6 twice.", "Drop your shoulders and unclench your jaw.", "Place both feet on the floor and exhale slowly."],
    actionTail: "Spend 30 seconds creating calm."
  },
  Joy: {
    openers: ["Joy can begin with one small spark.", "Pleasure in tiny moments still counts.", "You can welcome lightness without guilt."],
    focuses: ["Notice one thing that feels good", "Allow a brief smile or laugh", "Choose one uplifting cue"],
    anchors: ["today", "in this room", "right now"],
    mechanisms: ["Positive micro-moments can buffer stress.", "Savoring improves emotional flexibility.", "Pleasant attention increases wellbeing signals."],
    whyTail: "Small joy moments add up over time.",
    actions: ["Play 30 seconds of a song you enjoy.", "Look at one photo that makes you smile.", "Name one simple thing you like right now."],
    actionTail: "Take 30 seconds to invite joy."
  },
  Hope: {
    openers: ["Hope grows from small evidence.", "You can trust that progress is still possible.", "A better next step can begin now."],
    focuses: ["Find one reason to keep going", "Notice one sign of progress", "Choose one future-supporting action"],
    anchors: ["for today", "for this week", "for your next step"],
    mechanisms: ["Hopeful thinking improves persistence.", "Future-oriented micro-goals reduce helplessness.", "Meaningful next steps strengthen agency."],
    whyTail: "Even small hope cues can improve motivation.",
    actions: ["Write one sentence: ‘I am moving toward…’.", "List one thing that improved recently.", "Pick one tiny action that helps future-you."],
    actionTail: "Give 30 seconds to reinforce hope."
  },
  Confidence: {
    openers: ["Confidence can be practiced, not waited for.", "You can act with courage before certainty.", "Your progress deserves acknowledgment."],
    focuses: ["Recall one capability you already have", "Replace criticism with balanced truth", "Trust evidence over fear"],
    anchors: ["in this challenge", "before your next choice", "today"],
    mechanisms: ["Evidence-based self-talk reduces self-doubt.", "Small wins reinforce competence beliefs.", "Constructive inner dialogue improves performance."],
    whyTail: "Repeated confidence cues can change self-perception.",
    actions: ["Name one thing you handled well this week.", "Say: ‘I can learn as I go.’", "Write one strength you used recently."],
    actionTail: "Spend 30 seconds building confidence."
  },
  Focused: {
    openers: ["Focus can return with one clear next step.", "You can restart attention at any moment.", "Clarity beats intensity."],
    focuses: ["Shrink the task", "Reduce one distraction", "Choose one starting action"],
    anchors: ["for the next 5 minutes", "right where you are", "at this energy level"],
    mechanisms: ["Micro-goals improve task initiation.", "Reduced distraction increases cognitive control.", "Clear starts lower mental resistance."],
    whyTail: "Tiny focus wins rebuild momentum quickly.",
    actions: ["Close one distracting tab.", "Write your next task in five words.", "Set a 30-second timer and begin."],
    actionTail: "Use 30 seconds to lock in focus."
  },
  Motivated: {
    openers: ["Motivation can follow action.", "A tiny start can unlock momentum.", "You do not need perfect energy to begin."],
    focuses: ["Start imperfectly", "Choose consistency over intensity", "Create one visible win"],
    anchors: ["today", "this hour", "before your next break"],
    mechanisms: ["Behavioral activation can increase drive.", "Small completions reinforce agency.", "Lowering pressure improves willingness to start."],
    whyTail: "Reliable micro-actions sustain motivation.",
    actions: ["Stand up and stretch for two breaths.", "Complete one sub-60-second task.", "Write one line of progress."],
    actionTail: "Take 30 seconds to get moving."
  },
  Connected: {
    openers: ["Connection can begin with one small reach-out.", "You deserve supportive relationships.", "Belonging grows through simple contact."],
    focuses: ["Open one low-pressure interaction", "Move toward people, not isolation", "Build one moment of closeness"],
    anchors: ["today", "this evening", "right now"],
    mechanisms: ["Micro-connections reduce isolation intensity.", "Social safety cues support emotional regulation.", "Intentional outreach can increase belonging."],
    whyTail: "One contact can shift the emotional tone of your day.",
    actions: ["Send one check-in text.", "Share one honest sentence with someone safe.", "Say hello to one person nearby."],
    actionTail: "Use 30 seconds to create connection."
  },
  Balanced: {
    openers: ["Balance is built through small adjustments.", "You can hold effort and rest together.", "Steadiness comes from pacing, not pushing."],
    focuses: ["Choose moderation over extremes", "Protect your energy and priorities", "Re-center your pace"],
    anchors: ["for this day", "for this hour", "before continuing"],
    mechanisms: ["Balanced pacing reduces burnout risk.", "Moderation supports emotional stability.", "Intentional regulation improves consistency."],
    whyTail: "Small balancing actions prevent larger crashes.",
    actions: ["Pause and breathe twice before your next task.", "Delay one non-urgent item.", "Drink water and reset posture."],
    actionTail: "Take 30 seconds to rebalance."
  },
  Overwhelmed: {
    openers: ["You do not have to carry everything at once.", "A slower pace can still move you forward.", "One small next step is enough for now."],
    focuses: ["Narrow your attention to one task", "Reduce pressure to do everything perfectly", "Give yourself permission to simplify"],
    anchors: ["in this moment", "for the next hour", "before your next task"],
    mechanisms: ["Reducing cognitive load improves emotional stability.", "Single-tasking lowers stress and decision fatigue.", "Simplification decreases overwhelm and increases follow-through."],
    whyTail: "Tiny reductions in pressure can create meaningful calm.",
    actions: ["Write down your top one priority.", "Take one slow breath and relax your shoulders.", "Delete one non-urgent task from your list."],
    actionTail: "Spend 30 seconds, then continue gently."
  },
  Anxious: {
    openers: ["You can feel anxious and still choose clearly.", "Your breath can help your body feel safer.", "This feeling can pass without controlling your next step."],
    focuses: ["Return to present facts", "Separate worry from immediate reality", "Ground yourself through your senses"],
    anchors: ["right now", "in this room", "before responding"],
    mechanisms: ["Grounding interrupts spiraling thought loops.", "Long exhales support nervous system down-regulation.", "Present-focused attention reduces catastrophic thinking."],
    whyTail: "Brief regulation practices repeated daily build resilience.",
    actions: ["Name 5 things you see and 4 things you feel.", "Inhale for 4 and exhale for 6, three times.", "Press your feet into the floor for two breaths."],
    actionTail: "Keep it to 30 seconds for a quick reset."
  },
  Distracted: {
    openers: ["Distraction is a signal to simplify your next step.", "You can return to focus without judgment.", "Attention can be restarted in seconds."],
    focuses: ["Shrink the task", "Reduce one distraction", "Set one clear starting point"],
    anchors: ["for the next 5 minutes", "right here", "before continuing"],
    mechanisms: ["Task chunking lowers cognitive friction.", "Environmental simplification improves concentration.", "Quick restarts prevent prolonged drift."],
    whyTail: "Short resets can restore attention effectively.",
    actions: ["Mute one notification source.", "Write one next action and do it.", "Take one breath, then begin for 30 seconds."],
    actionTail: "Use 30 seconds to re-engage attention."
  },
  Unmotivated: {
    openers: ["Motivation can follow action, not only precede it.", "A tiny move still counts as progress.", "You can start gently today."],
    focuses: ["Begin with low pressure", "Choose one easy win", "Build momentum through motion"],
    anchors: ["right now", "this hour", "before your next break"],
    mechanisms: ["Behavioral activation improves mood and drive.", "Small wins increase willingness to continue.", "Reduced pressure supports initiation."],
    whyTail: "Micro-actions are often enough to break inertia.",
    actions: ["Stand up and move for two breaths.", "Do one task under 60 seconds.", "Write one line of progress."],
    actionTail: "Spend 30 seconds getting started."
  },
  Selfdoubt: {
    openers: ["You can doubt yourself and still take wise action.", "Your worth is not reduced by uncertainty.", "Confidence grows through practice."],
    focuses: ["Name one capability you already have", "Replace harsh thoughts with balanced ones", "Trust evidence over fear"],
    anchors: ["in this challenge", "today", "before your next step"],
    mechanisms: ["Balanced self-talk reduces avoidance.", "Self-compassion improves regulation.", "Evidence-based reflection strengthens confidence."],
    whyTail: "Consistent reinforcement can weaken inner-critic patterns.",
    actions: ["Write one thing you did well.", "Say: ‘I can learn as I go.’", "List one strength you used recently."],
    actionTail: "Take 30 seconds to reinforce self-trust."
  },
  Angry: {
    openers: ["Your anger holds information, and you can channel it safely.", "You can pause before responding.", "Calm and strength can coexist."],
    focuses: ["Regulate first, communicate second", "Slow your reaction window", "Choose response over impulse"],
    anchors: ["right now", "before replying", "during this conversation"],
    mechanisms: ["Pauses reduce reactive behavior.", "Body calming lowers emotional intensity.", "Intentional responses improve outcomes."],
    whyTail: "A short pause can prevent long regret.",
    actions: ["Unclench your jaw and exhale slowly.", "Count backward from 5.", "Write one clear need in one sentence."],
    actionTail: "Use 30 seconds to lower intensity first."
  },
  Sad: {
    openers: ["Sadness deserves care, not judgment.", "You can feel heavy and still support yourself.", "One soft action can lighten this moment."],
    focuses: ["Offer yourself kindness", "Stay connected to your body", "Allow emotion without shame"],
    anchors: ["right now", "for this hour", "in this quiet moment"],
    mechanisms: ["Self-kindness reduces secondary distress.", "Body awareness can soften intensity.", "Allowing emotion helps it move through safely."],
    whyTail: "Small acts of care support emotional recovery.",
    actions: ["Place a hand on your heart and breathe.", "Drink water mindfully.", "Step outside and notice one comforting detail."],
    actionTail: "Take 30 seconds to care for yourself."
  },
  Guilt: {
    openers: ["You can take responsibility without self-attack.", "Growth is possible without punishment.", "Compassion and accountability can coexist."],
    focuses: ["Name what you learned", "Separate behavior from identity", "Choose repair over rumination"],
    anchors: ["today", "in this reflection", "before your next step"],
    mechanisms: ["Self-compassion supports constructive change.", "Identity separation reduces shame spirals.", "Repair-focused thinking improves recovery."],
    whyTail: "Gentle accountability builds healthier habits.",
    actions: ["Write: ‘I can learn from this.’", "Name one repair action.", "Release tension and exhale slowly."],
    actionTail: "Use 30 seconds to move toward repair."
  },
  Lonely: {
    openers: ["Loneliness is a signal for connection, not failure.", "You deserve meaningful support.", "Small contact can soften isolation."],
    focuses: ["Reach out in a low-pressure way", "Reconnect with safe people", "Build one moment of contact"],
    anchors: ["today", "this evening", "right now"],
    mechanisms: ["Micro-connections reduce isolation intensity.", "Social contact improves emotional safety signals.", "Intentional outreach supports belonging."],
    whyTail: "One connection can shift your emotional state.",
    actions: ["Send one check-in text.", "Write one person’s name to contact.", "Say hello to one person."],
    actionTail: "Take 30 seconds to open a connection."
  },
  Burnout: {
    openers: ["Rest is productive when your system is overloaded.", "Recovery can happen in small intervals.", "Boundaries protect long-term energy."],
    focuses: ["Lower demands briefly", "Protect your energy", "Choose restoration over depletion"],
    anchors: ["right now", "before continuing", "for this next block"],
    mechanisms: ["Short breaks improve performance recovery.", "Energy boundaries reduce exhaustion.", "Nervous system recovery supports sustainable output."],
    whyTail: "Micro-rest helps prevent deeper burnout cycles.",
    actions: ["Close your eyes for two breaths.", "Loosen your neck and shoulders.", "Delay one non-urgent task."],
    actionTail: "Take 30 seconds to protect your energy."
  },
  Overthinking: {
    openers: ["You do not need perfect certainty to move.", "More thinking is not always more solving.", "Action can quiet loops faster than rumination."],
    focuses: ["Set one decision boundary", "Shift from analysis to action", "Return to what you can control"],
    anchors: ["in this decision", "for the next 10 minutes", "right now"],
    mechanisms: ["Decision limits reduce rumination fatigue.", "Action interrupts repetitive thought loops.", "Control-focused thinking lowers mental overload."],
    whyTail: "Small action often creates clarity faster.",
    actions: ["Set a 30-second decision limit.", "Write two options and choose one.", "Ask: ‘What is enough information now?’"],
    actionTail: "Use 30 seconds to move from loop to action."
  }
};

const positiveNegativeOrder = [
  "Gratitude",
  "Calm",
  "Joy",
  "Hope",
  "Confidence",
  "Focused",
  "Motivated",
  "Connected",
  "Balanced",
  "Overwhelmed",
  "Anxious",
  "Distracted",
  "Unmotivated",
  "Selfdoubt",
  "Angry",
  "Sad",
  "Guilt",
  "Lonely",
  "Burnout",
  "Overthinking"
];

const categories = Object.fromEntries(
  Object.entries(categoryThemes).map(([name, theme]) => [name, buildYearCategory(theme)])
);

const getOrderedCategoryNames = (filterMode) => {
  const names = Object.keys(categories);

  if (filterMode === "descending") {
    return [...names].sort((a, b) => b.localeCompare(a));
  }

  if (filterMode === "ascending" || filterMode === "alphabetical") {
    return [...names].sort((a, b) => a.localeCompare(b));
  }

  return positiveNegativeOrder.filter((name) => names.includes(name));
};

const categoryOrderFilter = document.getElementById("categoryOrderFilter");
const categorySelect = document.getElementById("categorySelect");
const categoryTitle = document.getElementById("categoryTitle");
const revealHint = document.getElementById("revealHint");
const messageBox = document.getElementById("messageBox");
const drawBtn = document.getElementById("drawBtn");
const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines;
};

const generateAffirmationJpeg = (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.fillStyle = "#e7e7e5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "700 124px Georgia, 'Times New Roman', serif";
  ctx.fillText("MindLift", 120, 250);

  ctx.font = "italic 48px Georgia, 'Times New Roman', serif";
  ctx.fillText("affirmation", 120, 320);

  ctx.strokeStyle = "#cfcfcd";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(120, 390);
  ctx.lineTo(960, 390);
  ctx.stroke();

  ctx.fillStyle = "#202020";
  ctx.font = "600 64px Georgia, 'Times New Roman', serif";
  const lines = wrapText(ctx, text, 820);
  lines.slice(0, 8).forEach((line, index) => {
    ctx.fillText(line, 120, 520 + index * 90);
  });

  ctx.fillStyle = "#555";
  ctx.font = "400 34px Georgia, 'Times New Roman', serif";
  ctx.fillText("mindlift daily", 120, 1220);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
};

const shareAffirmationImage = async (text) => {
  const blob = await generateAffirmationJpeg(text);

  if (!blob) {
    window.alert("Unable to generate image on this device.");
    return;
  }

  const file = new File([blob], "mindlift-affirmation.jpg", { type: "image/jpeg" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "MindLift Daily Affirmation",
        text,
        files: [file]
      });
      return;
    } catch {
      // fallback to download
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mindlift-affirmation.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  revealHint.textContent = enabled
    ? "Tap Reveal when you're ready."
    : "Pick a category to reveal your message.";
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
        <button id="shareMessageBtn" class="secondary-btn" type="button">Share</button>
      </div>
    </article>
  `;
};

const renderMessageCard = (entry, timestamp, showAnimation = true) => {
  messageBox.classList.add("filled");
  messageBox.innerHTML = buildMessageCardHTML(entry, timestamp, showAnimation);

  const saveBtn = document.getElementById("saveMessageBtn");
  const shareBtn = document.getElementById("shareMessageBtn");

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

  shareBtn?.addEventListener("click", async () => {
    await shareAffirmationImage(entry.message);
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
  if (!categories[categoryName]) {
    appState.activeCategory = null;
    categoryTitle.textContent = "Message space";
    setDrawEnabled(false);
    return;
  }

  appState.activeCategory = categoryName;
  categorySelect.value = categoryName;
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
  } catch {
    // ignore invalid localStorage payloads
  }
};

const buildCategoryOptions = (filterMode = "positive") => {
  const previousValue = categorySelect.value || appState.activeCategory || "";
  categorySelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a category";
  categorySelect.appendChild(placeholder);

  getOrderedCategoryNames(filterMode).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categorySelect.appendChild(option);
  });

  if (previousValue && categories[previousValue]) {
    categorySelect.value = previousValue;
  } else {
    categorySelect.value = "";
  }
};

categoryOrderFilter.addEventListener("change", (event) => {
  buildCategoryOptions(event.target.value);
});

categorySelect.addEventListener("change", (event) => {
  selectCategory(event.target.value);
});

drawBtn.addEventListener("click", () => {
  revealMessage(true);
});

buildCategoryOptions(categoryOrderFilter.value);
loadFavorites();
renderFavorites();
restoreFromStorage();
