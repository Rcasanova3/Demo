const STORAGE_KEYS = {
  selectedCategory: "abetterthought.selectedCategory",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought"
};

const categoryThemes = {
  Gratitude: {
    openers: ["There is still something steady here.", "You can notice one good thing right now.", "A moment of appreciation can soften your day."],
    focuses: ["Name one support in your life", "Acknowledge one simple comfort", "Include one helpful moment in your attention"],
    anchors: ["in this moment", "today", "before your next task"],
    mechanisms: ["Gratitude broadens your perspective.", "Positive noticing helps regulate stress.", "Appreciation nudges your brain toward safety."],
    whyTail: "Tiny gratitude reps can improve emotional balance over time.",
    actions: ["Name one person or thing you appreciate.", "Whisper one thank-you to yourself.", "Think of one part of today that helped you."],
    actionTail: "Take 30 seconds and let it land."
  },
  Calm: {
    openers: ["Calm can return one breath at a time.", "Your body can lead your mind to steadiness.", "You are allowed to slow down."],
    focuses: ["Unclench your jaw and shoulders", "Lengthen your exhale", "Soften your pace"],
    anchors: ["right now", "for the next minute", "before moving on"],
    mechanisms: ["Slow exhales lower nervous system arousal.", "Muscle release reduces stress signals.", "Brief regulation restores clarity."],
    whyTail: "Micro-calming practices make stress spikes easier to handle.",
    actions: ["Breathe in for 4 and out for 6 twice.", "Drop your shoulders and relax your hands.", "Put both feet down and take one long exhale."],
    actionTail: "Use 30 seconds to reset."
  },
  Joy: {
    openers: ["Joy can begin with one small spark.", "Pleasure in tiny moments still counts.", "Lightness is allowed here."],
    focuses: ["Notice one thing that feels good", "Invite one smile", "Choose one uplifting cue"],
    anchors: ["today", "in this room", "right now"],
    mechanisms: ["Savoring improves emotional flexibility.", "Positive micro-moments buffer stress.", "Small pleasure signals safety to the brain."],
    whyTail: "Short joy moments can make hard days feel more doable.",
    actions: ["Play 30 seconds of a song you love.", "Look at one photo that lifts you.", "Name one thing that feels pleasant now."],
    actionTail: "Take 30 seconds to welcome joy."
  },
  Hope: {
    openers: ["Hope grows from small evidence.", "A better next step is still possible.", "You are not stuck forever."],
    focuses: ["Notice one sign of progress", "Name one reason to keep going", "Choose one future-supporting step"],
    anchors: ["today", "this week", "in your next move"],
    mechanisms: ["Hopeful thinking increases persistence.", "Future-oriented micro-goals reduce helplessness.", "Agency grows when you pick one next step."],
    whyTail: "Small cues of possibility can shift your energy.",
    actions: ["Write one line: I can still move toward __.", "Name one thing that improved lately.", "Pick one tiny step for future-you."],
    actionTail: "Spend 30 seconds reinforcing hope."
  },
  Confidence: {
    openers: ["Confidence can be practiced.", "Courage can come before certainty.", "You have more capacity than fear says."],
    focuses: ["Recall one strength", "Use balanced self-talk", "Trust evidence over panic"],
    anchors: ["in this challenge", "before your next decision", "today"],
    mechanisms: ["Evidence-based self-talk reduces self-doubt.", "Small wins reinforce competence.", "Constructive inner language improves follow-through."],
    whyTail: "Repeated confidence cues help rewire self-belief.",
    actions: ["Name one thing you handled well recently.", "Say: I can learn as I go.", "Write one strength you used this week."],
    actionTail: "Take 30 seconds to stand a little taller."
  },
  Focused: {
    openers: ["Focus returns with one clear next step.", "You can restart attention at any moment.", "Clarity beats intensity."],
    focuses: ["Shrink the task", "Reduce one distraction", "Choose one starting move"],
    anchors: ["for the next 5 minutes", "right now", "with your current energy"],
    mechanisms: ["Micro-goals reduce overwhelm.", "Removing distractions improves cognitive control.", "Clear starts lower resistance."],
    whyTail: "Tiny focus wins build momentum quickly.",
    actions: ["Close one distracting tab.", "Write your next action in five words.", "Set a 30-second timer and begin."],
    actionTail: "Use 30 seconds to lock in."
  },
  Motivated: {
    openers: ["Action can create motivation.", "A tiny start can unlock momentum.", "You do not need perfect energy to begin."],
    focuses: ["Start imperfectly", "Choose consistency", "Reduce the size of the first step"],
    anchors: ["today", "in this hour", "right now"],
    mechanisms: ["Behavior-first starts increase drive.", "Small starts reduce avoidance.", "Progress cues boost commitment."],
    whyTail: "Motion often comes before motivation.",
    actions: ["Do 30 seconds of the task now.", "Open the doc and write one sentence.", "Set out one item you need to start."],
    actionTail: "Give yourself 30 seconds of movement."
  },
  Connected: {
    openers: ["Connection can begin small.", "You deserve support and belonging.", "One reach-out can change your day."],
    focuses: ["Choose low-pressure contact", "Acknowledge someone safe", "Make one social bridge"],
    anchors: ["today", "this evening", "right now"],
    mechanisms: ["Micro-connections reduce isolation.", "Social contact improves safety signals.", "Belonging cues can soften stress."],
    whyTail: "Even brief contact can improve mood.",
    actions: ["Send one short check-in text.", "React to one message with care.", "Say hi to one person nearby."],
    actionTail: "Use 30 seconds to reconnect."
  },
  Balanced: {
    openers: ["Balance can be rebuilt in moments.", "You can honor both effort and rest.", "Middle ground is enough for now."],
    focuses: ["Stabilize your pace", "Hold two truths", "Lower all-or-nothing thinking"],
    anchors: ["in this moment", "for this block", "today"],
    mechanisms: ["Balanced thinking lowers emotional swings.", "Pacing helps prevent depletion.", "Flexibility improves resilience."],
    whyTail: "Small balancing choices reduce burnout risk.",
    actions: ["Ask: what is enough for now?", "Take one slow breath before continuing.", "Choose one priority and release one extra."],
    actionTail: "Take 30 seconds to re-center."
  },
  Overwhelmed: {
    openers: ["You can make this moment smaller.", "One thing at a time is a strong strategy.", "You are allowed to simplify."],
    focuses: ["Narrow to one task", "Reduce incoming noise", "Pick one immediate need"],
    anchors: ["right now", "for the next 10 minutes", "before the next step"],
    mechanisms: ["Task chunking reduces overload.", "Prioritizing lowers cognitive strain.", "Simplifying helps your nervous system settle."],
    whyTail: "Breaking pressure into parts restores control.",
    actions: ["Write one next action only.", "Silence one non-urgent notification.", "Say: one thing first."],
    actionTail: "Use 30 seconds to narrow the load."
  },
  Anxious: {
    openers: ["Anxiety is a signal, not a verdict.", "You can be anxious and still safe enough now.", "Grounding first can help your mind settle."],
    focuses: ["Return to your senses", "Name what is true now", "Lower urgency in your body"],
    anchors: ["in this moment", "for this minute", "before your next thought spiral"],
    mechanisms: ["Grounding interrupts threat loops.", "Reality-based statements reduce catastrophic thinking.", "Body calming lowers anxiety intensity."],
    whyTail: "Brief grounding can reduce panic momentum.",
    actions: ["Name 3 things you can see.", "Press your feet into the floor and exhale.", "Say: right now, I am okay enough."],
    actionTail: "Take 30 seconds to ground."
  },
  Distracted: {
    openers: ["Your attention can be called back gently.", "Refocus is always available.", "Small structure helps attention settle."],
    focuses: ["Define one target", "Cut one distraction", "Return to the first step"],
    anchors: ["for the next 5 minutes", "right now", "with a single task"],
    mechanisms: ["Single-tasking improves attentional control.", "Environmental cues can reset focus.", "Clear micro-goals reduce wandering."],
    whyTail: "Tiny resets train steadier attention.",
    actions: ["Put your phone face down for 30 seconds.", "Write one sentence of your task goal.", "Take one breath, then do the first action."],
    actionTail: "Use 30 seconds to return."
  },
  Unmotivated: {
    openers: ["Low drive is a state, not your identity.", "You can begin without feeling ready.", "A micro-start is enough for now."],
    focuses: ["Lower the bar", "Begin before confidence", "Choose the tiniest next move"],
    anchors: ["today", "in this hour", "right now"],
    mechanisms: ["Tiny starts reduce avoidance.", "Action creates momentum chemistry.", "Lowering friction improves follow-through."],
    whyTail: "Starting small makes starting easier next time.",
    actions: ["Do just 30 seconds of the task.", "Set up your workspace only.", "Open the task and do one line."],
    actionTail: "Take 30 seconds to begin."
  },
  Selfdoubt: {
    openers: ["Doubt can be present while you still move forward.", "You can trust progress over perfection.", "Your effort counts even when confidence dips."],
    focuses: ["Use evidence from your past", "Replace harsh talk with fair talk", "Take one brave step"],
    anchors: ["in this challenge", "today", "before your next action"],
    mechanisms: ["Balanced self-talk reduces fear-based avoidance.", "Evidence review improves confidence accuracy.", "Brave micro-actions build self-trust."],
    whyTail: "Self-trust grows through repeated small follow-through.",
    actions: ["List one thing you have done before.", "Say: I can do this one step at a time.", "Take one small action despite doubt."],
    actionTail: "Use 30 seconds to back yourself."
  },
  Angry: {
    openers: ["Anger carries important information.", "You can honor anger without letting it steer everything.", "A pause can protect what matters."],
    focuses: ["Create space before reacting", "Lower intensity in your body", "Choose aligned expression"],
    anchors: ["right now", "before replying", "in this heated moment"],
    mechanisms: ["Pausing reduces impulsive responses.", "Physiological downshift supports better decisions.", "Values-based response protects relationships."],
    whyTail: "Brief regulation helps anger become useful, not harmful.",
    actions: ["Exhale slowly for 8 counts once.", "Unclench fists and drop shoulders.", "Write one sentence you want to say calmly."],
    actionTail: "Take 30 seconds before acting."
  },
  Sad: {
    openers: ["Sadness deserves kindness.", "You can feel heavy and still care for yourself.", "One soft action can help right now."],
    focuses: ["Offer self-compassion", "Stay connected to your body", "Allow emotion without judgment"],
    anchors: ["in this moment", "for this hour", "right now"],
    mechanisms: ["Self-kindness reduces secondary distress.", "Body awareness can soften emotional intensity.", "Allowing feelings helps them move through."],
    whyTail: "Tiny care actions support recovery.",
    actions: ["Place a hand on your chest and breathe.", "Drink a small glass of water slowly.", "Step outside and notice one soothing detail."],
    actionTail: "Take 30 seconds for gentle care."
  },
  Guilt: {
    openers: ["You can take responsibility without attacking yourself.", "Repair matters more than rumination.", "Growth is possible from this moment."],
    focuses: ["Separate behavior from identity", "Name one lesson", "Choose one repair step"],
    anchors: ["today", "in this reflection", "before your next action"],
    mechanisms: ["Self-compassion supports constructive accountability.", "Repair-focused thinking improves emotional recovery.", "Learning orientation reduces shame spirals."],
    whyTail: "Gentle accountability creates healthier change.",
    actions: ["Say: I can learn and repair.", "Write one concrete repair action.", "Take one breath and release self-attack."],
    actionTail: "Use 30 seconds to move toward repair."
  },
  Lonely: {
    openers: ["Loneliness is a signal for connection.", "You are worthy of being reached and seen.", "A small contact can shift this feeling."],
    focuses: ["Pick low-pressure outreach", "Reconnect with one safe person", "Create one contact moment"],
    anchors: ["today", "this evening", "right now"],
    mechanisms: ["Micro-outreach can reduce isolation quickly.", "Connection cues improve emotional safety.", "Belonging behaviors support mood stability."],
    whyTail: "Even tiny social moments can help you feel less alone.",
    actions: ["Send one simple hello text.", "Share one honest sentence with someone safe.", "Join one small community interaction."],
    actionTail: "Take 30 seconds to reach outward."
  },
  Burnout: {
    openers: ["Rest is productive when your system is overloaded.", "Recovery can happen in small intervals.", "Boundaries protect your long-term energy."],
    focuses: ["Lower demand briefly", "Protect energy", "Choose restoration over depletion"],
    anchors: ["right now", "before continuing", "for this next block"],
    mechanisms: ["Short pauses improve cognitive recovery.", "Boundaries reduce cumulative fatigue.", "Nervous system downshift supports sustainability."],
    whyTail: "Micro-rest can interrupt burnout cycles.",
    actions: ["Close your eyes for one slow breath.", "Stretch your neck and shoulders gently.", "Delay one non-urgent item."],
    actionTail: "Use 30 seconds to reclaim energy."
  },
  Overthinking: {
    openers: ["You do not need perfect certainty to move.", "Action can quiet loops faster than rumination.", "Enough clarity is enough to start."],
    focuses: ["Set a decision boundary", "Move from analysis to action", "Return to what you control"],
    anchors: ["right now", "for the next 10 minutes", "in this decision"],
    mechanisms: ["Decision limits reduce mental fatigue.", "Action interrupts repetitive thought loops.", "Control-focused thinking lowers overload."],
    whyTail: "Small action often creates clarity faster than more analysis.",
    actions: ["Set a 30-second choice limit.", "Pick one option and commit for now.", "Ask: what is enough information today?"],
    actionTail: "Use 30 seconds to exit the loop."
  }
};

const personalCategoryOrder = [
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

const buildYearCategory = (theme) => {
  const entries = [];
  for (let i = 0; i < 365; i += 1) {
    entries.push({
      message: `${theme.openers[i % theme.openers.length]} ${theme.focuses[i % theme.focuses.length]} ${theme.anchors[i % theme.anchors.length]}.`,
      why: `${theme.mechanisms[i % theme.mechanisms.length]} ${theme.whyTail}`,
      action: `${theme.actions[i % theme.actions.length]} ${theme.actionTail}`
    });
  }
  return entries;
};

const personalCategories = Object.fromEntries(
  Object.entries(categoryThemes).map(([name, theme]) => [name, buildYearCategory(theme)])
);

const parentsCategoryOrder = [
  "Patience",
  "Overwhelm",
  "Guilt",
  "Anger",
  "Tantrums",
  "Coparenting",
  "Connection",
  "Discipline",
  "Balance",
  "Sleep",
  "Confidence",
  "Anxiety"
];

const parentsCategoryThemes = {
  Patience: {
    reminders: [
      "My child is learning, not giving me a hard time.",
      "Slow is still progress in parenting.",
      "I can pause before I respond.",
      "Calm is a skill I can practice in small moments.",
      "I can choose one gentle sentence before giving directions.",
      "A softer tone helps both of us regulate."
    ],
    reframes: [
      "A brief pause often prevents bigger conflict.",
      "Regulation first makes teaching easier.",
      "Connection helps cooperation happen sooner.",
      "One calm response can reset the room."
    ],
    steps: [
      "Take one breath and lower your voice by one level.",
      "Count to three before answering.",
      "Put your hand on your chest and exhale slowly.",
      "Use one short sentence instead of repeating instructions."
    ]
  },
  Overwhelm: {
    reminders: [
      "I do not need to do everything at once.",
      "Good enough care is still good care.",
      "I can shrink this moment to one next step.",
      "I can triage without guilt.",
      "I can ask for help sooner, not later.",
      "One task completed is a real win today."
    ],
    reframes: [
      "Small prioritization lowers stress quickly.",
      "A short reset helps me think clearly.",
      "Reducing demands protects my energy.",
      "One boundary can create breathing room."
    ],
    steps: [
      "Pick one must-do and let one thing wait.",
      "Set a 30-second reset timer and breathe.",
      "Write the next task in five words.",
      "Drink water, then start only the first step."
    ]
  },
  Guilt: {
    reminders: [
      "I can repair without shaming myself.",
      "Parenting mistakes are part of learning.",
      "I can be accountable and compassionate.",
      "A hard moment does not define me.",
      "I can model repair for my child.",
      "Growth matters more than perfection."
    ],
    reframes: [
      "Repair builds trust over time.",
      "Self-kindness supports better follow-through.",
      "Learning from today helps tomorrow go better.",
      "A short apology can be powerful."
    ],
    steps: [
      "Say one clear repair sentence.",
      "Name what you would do differently next time.",
      "Release your shoulders and exhale once.",
      "Offer one warm reconnecting moment."
    ]
  },
  Anger: {
    reminders: [
      "My anger is information, not my instruction.",
      "I can pause before I parent.",
      "A regulated response protects the relationship.",
      "I can be firm without being harsh.",
      "I can come back after I cool down.",
      "My child needs my guidance more than my intensity."
    ],
    reframes: [
      "A pause lowers the chance of regret.",
      "Body calm supports clearer boundaries.",
      "Firm and kind can coexist.",
      "One reset can change the direction of the moment."
    ],
    steps: [
      "Exhale longer than you inhale once.",
      "Step back one pace before speaking.",
      "Use a short boundary sentence in a calm voice.",
      "Name one feeling silently and let it pass."
    ]
  },
  Tantrums: {
    reminders: [
      "Big feelings are not bad behavior.",
      "I can be the calm while my child storms.",
      "Safety and connection come first.",
      "Coaching works better than lecturing in this moment.",
      "This wave will pass.",
      "My steadiness helps my child settle."
    ],
    reframes: [
      "Regulation precedes reasoning.",
      "Short soothing cues reduce escalation.",
      "A calm parent is the strongest intervention.",
      "Consistency builds security."
    ],
    steps: [
      "Lower your voice and speak in short phrases.",
      "Offer one simple choice if appropriate.",
      "Stay nearby and breathe slowly.",
      "Repeat one validating sentence once."
    ]
  },
  Coparenting: {
    reminders: [
      "I can focus on the child-centered goal.",
      "Clear communication reduces friction.",
      "I can choose collaboration over winning.",
      "I can keep requests specific and brief.",
      "A shared plan helps everyone feel safer.",
      "Respectful tone protects long-term teamwork."
    ],
    reframes: [
      "Simple agreements prevent repeated arguments.",
      "Boundaries and clarity create stability.",
      "Less blame leaves room for solutions.",
      "Small coordination wins matter."
    ],
    steps: [
      "Send one concise child-focused message.",
      "State one request and one timeline.",
      "Write one sentence starting with: For consistency, can we...",
      "Pause before replying to reduce reactivity."
    ]
  },
  Connection: {
    reminders: [
      "Connection can happen in tiny moments.",
      "My presence is more powerful than perfect words.",
      "I can notice my child before I direct them.",
      "One warm glance can reset the tone.",
      "Small rituals build big security.",
      "I can reconnect after a rough patch."
    ],
    reframes: [
      "Brief attunement improves cooperation.",
      "Micro-moments of warmth strengthen trust.",
      "Repairing quickly supports emotional safety.",
      "Consistency matters more than intensity."
    ],
    steps: [
      "Give 30 seconds of full eye contact.",
      "Name one thing your child did well.",
      "Offer one gentle touch or smile.",
      "Ask one curious, open question."
    ]
  },
  Discipline: {
    reminders: [
      "Discipline means teaching, not punishing.",
      "I can be clear and kind at the same time.",
      "Consistency supports learning.",
      "One boundary delivered calmly is enough.",
      "I can focus on the skill my child is learning.",
      "Short consequences work best when paired with connection."
    ],
    reframes: [
      "Predictable limits reduce power struggles.",
      "Calm follow-through builds trust.",
      "Teaching takes repetition.",
      "Clarity lowers confusion and resistance."
    ],
    steps: [
      "State the limit in one sentence.",
      "Name the expected behavior clearly.",
      "Follow through once, calmly.",
      "Offer one chance to reset."
    ]
  },
  Balance: {
    reminders: [
      "My needs matter too.",
      "I can parent and protect my energy.",
      "I do not need to earn rest.",
      "A paced day helps everyone.",
      "I can choose fewer priorities today.",
      "Small boundaries are acts of care."
    ],
    reframes: [
      "Rest improves patience and presence.",
      "Sustainable routines prevent burnout.",
      "One boundary protects many moments.",
      "Balance is built, not found."
    ],
    steps: [
      "Take one quiet minute before the next task.",
      "Drop one non-essential item today.",
      "Ask for one practical support.",
      "Schedule one short reset block."
    ]
  },
  Sleep: {
    reminders: [
      "Sleep challenges are seasons, not forever.",
      "I can simplify tonight's plan.",
      "My tiredness deserves compassion.",
      "Small routines can create steadiness.",
      "I can focus on the next bedtime step only.",
      "Rest support starts with consistency."
    ],
    reframes: [
      "Predictable cues can ease transitions.",
      "Lowering stimulation helps bodies settle.",
      "Tiny bedtime rituals add up.",
      "A calm caregiver supports calmer sleep routines."
    ],
    steps: [
      "Pick one repeatable bedtime cue tonight.",
      "Dim lights and lower noise for 30 seconds.",
      "Take one slow breath before bedtime tasks.",
      "Choose one realistic sleep support step."
    ]
  },
  Confidence: {
    reminders: [
      "I can trust my growth as a parent.",
      "I know my child better than any perfect script.",
      "I can lead with calm and clarity.",
      "My effort counts, even on hard days.",
      "I can make one grounded decision now.",
      "I can parent from values, not fear."
    ],
    reframes: [
      "Small wins build parental confidence.",
      "Evidence over self-criticism supports better choices.",
      "Consistent care matters most.",
      "Practice strengthens trust in yourself."
    ],
    steps: [
      "Name one thing you handled well today.",
      "Write one parenting value guiding this choice.",
      "Use one confident, calm sentence.",
      "Take one small action you trust."
    ]
  },
  Anxiety: {
    reminders: [
      "Worry means I care, and I can still ground myself.",
      "I can come back to what is true right now.",
      "I can parent from steadiness, not spirals.",
      "One grounded breath can interrupt fear loops.",
      "I can focus on what I can control today.",
      "Support is allowed when anxiety feels heavy."
    ],
    reframes: [
      "Grounding reduces mental overload.",
      "Present-moment focus lowers anxiety intensity.",
      "Small control actions restore agency.",
      "Calm routines support emotional safety."
    ],
    steps: [
      "Name three things you can see right now.",
      "Put both feet down and exhale slowly.",
      "Write one thing you can control today.",
      "Choose one reassuring phrase and repeat it once."
    ]
  }
};

const buildParentsCategory = (theme) => {
  const entries = [];
  for (let i = 0; i < 24; i += 1) {
    entries.push({
      message: `${theme.reminders[i % theme.reminders.length]} ${theme.reframes[i % theme.reframes.length]}`,
      why: "A gentle reset helps you respond with steadiness and care.",
      action: theme.steps[i % theme.steps.length]
    });
  }
  return entries;
};

const parentsCategories = Object.fromEntries(
  Object.entries(parentsCategoryThemes).map(([name, theme]) => [name, buildParentsCategory(theme)])
);

const sectionConfigs = {
  personal: {
    label: "Personal",
    categories: personalCategories,
    order: personalCategoryOrder
  },
  parents: {
    label: "Parents",
    categories: parentsCategories,
    order: parentsCategoryOrder
  }
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
    // ignore storage errors
  }
};

const safeStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
};

const orderFilter = document.getElementById("orderFilter");
const categorySelect = document.getElementById("categorySelect");
const activeCategoryLabel = document.getElementById("activeCategoryLabel");
const revealHelper = document.getElementById("revealHelper");
const thoughtBubble = document.getElementById("thoughtBubble");
const revealBtn = document.getElementById("revealBtn");
const savedList = document.getElementById("savedList");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const personalSectionBtn = document.getElementById("sectionPersonalBtn");
const parentsSectionBtn = document.getElementById("sectionParentsBtn");
const savedFilterBtns = document.querySelectorAll("[data-saved-filter]");

const formatTimestamp = (timestamp) => {
  const d = new Date(timestamp);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const appState = {
  activeSection: "personal",
  selectedCategoryBySection: {
    personal: "",
    parents: ""
  },
  selectedCategory: "",
  lastThoughtByBucket: {},
  currentThought: null,
  savedThoughts: [],
  savedFilter: "all"
};

const makeBucketKey = (section, category) => `${section}:${category}`;

const getCurrentConfig = () => sectionConfigs[appState.activeSection] || sectionConfigs.personal;

const getCurrentCategories = () => getCurrentConfig().categories;

const getCurrentOrder = () => getCurrentConfig().order;

const getCurrentSectionLabel = () => getCurrentConfig().label;

const isFavorited = (section, category, text) =>
  appState.savedThoughts.some(
    (item) => item.section === section && item.category === category && item.text === text
  );

const getOrderedCategoryNames = (mode) => {
  const names = Object.keys(getCurrentCategories());

  if (mode === "descending") {
    return [...names].sort((a, b) => b.localeCompare(a));
  }

  if (mode === "ascending" || mode === "alphabetical") {
    return [...names].sort((a, b) => a.localeCompare(b));
  }

  return getCurrentOrder().filter((name) => names.includes(name));
};

const setSectionButtons = () => {
  [personalSectionBtn, parentsSectionBtn].forEach((btn) => {
    if (!btn) {
      return;
    }
    const isActive = btn.dataset.section === appState.activeSection;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
};

const setRevealState = () => {
  const hasCategory = Boolean(appState.selectedCategory);
  if (revealBtn) {
    revealBtn.disabled = !hasCategory;
  }
  if (revealHelper) {
    revealHelper.textContent = hasCategory
      ? `Tap Reveal when you're ready (${getCurrentSectionLabel()}).`
      : "Pick a category to reveal your message.";
  }
  if (activeCategoryLabel) {
    activeCategoryLabel.textContent = hasCategory
      ? `${getCurrentSectionLabel()} · ${appState.selectedCategory}`
      : `${getCurrentSectionLabel()} · no category selected`;
  }
};

const fallbackThought = (section, category) => ({
  section,
  sectionLabel: sectionConfigs[section]?.label || "Personal",
  category,
  message: "No messages are available in this category yet, but your effort still matters.",
  why: "A fallback keeps your reflection practice steady while content updates.",
  action: "Take one slow breath in and out, then choose another category.",
  timestamp: Date.now()
});

const buildCategoryOptions = (mode = "positive") => {
  if (!categorySelect) {
    return;
  }

  const previous = appState.selectedCategory || categorySelect.value;
  categorySelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a category";
  categorySelect.appendChild(placeholder);

  getOrderedCategoryNames(mode).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categorySelect.appendChild(option);
  });

  if (previous && getCurrentCategories()[previous]) {
    categorySelect.value = previous;
  }
};

const setSelectedCategory = (category) => {
  const categories = getCurrentCategories();
  if (!category || !categories[category]) {
    appState.selectedCategory = "";
    appState.selectedCategoryBySection[appState.activeSection] = "";
    if (categorySelect) {
      categorySelect.value = "";
    }
    safeStorageSet(STORAGE_KEYS.selectedCategory, JSON.stringify(appState.selectedCategoryBySection));
    setRevealState();
    return;
  }

  appState.selectedCategory = category;
  appState.selectedCategoryBySection[appState.activeSection] = category;
  if (categorySelect) {
    categorySelect.value = category;
  }
  safeStorageSet(STORAGE_KEYS.selectedCategory, JSON.stringify(appState.selectedCategoryBySection));
  setRevealState();
};

const switchSection = (section) => {
  if (!sectionConfigs[section]) {
    return;
  }

  appState.activeSection = section;
  safeStorageSet("abetterthought.activeSection", section);
  appState.selectedCategory = appState.selectedCategoryBySection[section] || "";
  setSectionButtons();
  buildCategoryOptions(orderFilter?.value || "positive");
  if (categorySelect) {
    categorySelect.value = appState.selectedCategory || "";
  }
  setRevealState();

  if (thoughtBubble && appState.currentThought?.section !== section) {
    thoughtBubble.innerHTML = '<p class="placeholder">Your better thought will appear here.</p>';
  }
};

const getThoughtForCategory = (section, category) => {
  const pool = sectionConfigs[section]?.categories?.[category] || [];
  if (!pool.length) {
    return fallbackThought(section, category);
  }

  if (pool.length === 1) {
    const only = pool[0];
    appState.lastThoughtByBucket[makeBucketKey(section, category)] = only.message;
    return {
      section,
      sectionLabel: sectionConfigs[section].label,
      category,
      message: only.message,
      why: only.why,
      action: only.action,
      timestamp: Date.now()
    };
  }

  const bucket = makeBucketKey(section, category);
  const previous = appState.lastThoughtByBucket[bucket];
  let next = pool[Math.floor(Math.random() * pool.length)];
  while (next.message === previous) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }

  appState.lastThoughtByBucket[bucket] = next.message;

  return {
    section,
    sectionLabel: sectionConfigs[section].label,
    category,
    message: next.message,
    why: next.why,
    action: next.action,
    timestamp: Date.now()
  };
};

const persistSaved = () => {
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const toggleFavorite = (thought) => {
  const index = appState.savedThoughts.findIndex(
    (item) => item.section === thought.section && item.category === thought.category && item.text === thought.message
  );

  if (index >= 0) {
    appState.savedThoughts.splice(index, 1);
  } else {
    appState.savedThoughts.unshift({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      section: thought.section,
      sectionLabel: thought.sectionLabel,
      category: thought.category,
      text: thought.message,
      timestamp: Date.now()
    });
  }

  persistSaved();
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
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

const buildThoughtImageBlob = async (thought) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ececec");
  gradient.addColorStop(1, "#d8d8d8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(245,245,245,0.92)";
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(100, 140, 880, 1040, 48);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111317";
  ctx.font = '700 58px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText("A Better Thought", 165, 240);

  ctx.fillStyle = "#595f67";
  ctx.font = '600 30px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(thought.sectionLabel || "Personal", 165, 295);
  ctx.fillText(thought.category, 165, 338);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.strokeStyle = "rgba(226,226,226,1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(150, 380, 780, 580, 36);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f2329";
  ctx.font = '600 48px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(ctx, thought.message, 690)
    .slice(0, 8)
    .forEach((line, i) => ctx.fillText(line, 195, 475 + i * 64));

  ctx.fillStyle = "#6a7078";
  ctx.font = '400 30px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText("One small shift. Big difference.", 165, 1090);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
};

const downloadThoughtImage = async (thought = appState.currentThought) => {
  if (!thought) {
    return;
  }

  const blob = await buildThoughtImageBlob(thought);
  if (!blob) {
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "a-better-thought.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const shareThought = async (thought = appState.currentThought) => {
  if (!thought) {
    return;
  }

  const shareText = `${thought.message}

${thought.sectionLabel} · ${thought.category} · A Better Thought`;

  if (!navigator.share) {
    await downloadThoughtImage(thought);
    return;
  }

  const blob = await buildThoughtImageBlob(thought);
  const file = blob ? new File([blob], "a-better-thought.png", { type: "image/png" }) : null;

  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "A Better Thought",
        text: shareText,
        files: [file]
      });
      return;
    } catch {
      // cancelled or unsupported
    }
  }

  try {
    await navigator.share({ title: "A Better Thought", text: shareText });
  } catch {
    await downloadThoughtImage(thought);
  }
};

const renderThought = (thought, animate = true) => {
  appState.currentThought = thought;
  safeStorageSet(STORAGE_KEYS.lastThought, JSON.stringify(thought));

  if (!thoughtBubble) {
    return;
  }

  const favoriteActive = isFavorited(thought.section, thought.category, thought.message);

  thoughtBubble.classList.remove("is-revealed");
  thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span>${thought.sectionLabel} · ${thought.category}</span>
        <span class="last-shown">Last shown: ${new Date(thought.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </p>
      <p class="thought-text">${thought.message}</p>
      <p class="thought-detail"><strong>Why this helps:</strong> ${thought.why}</p>
      <p class="thought-detail"><strong>Do this now (30 seconds):</strong> ${thought.action}</p>
      <div class="card-actions-inline">
        <button type="button" class="icon-btn icon-star ${favoriteActive ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${favoriteActive ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="Share or download message">⤴</button>
      </div>
    </article>
  `;

  if (animate) {
    requestAnimationFrame(() => {
      thoughtBubble.classList.add("is-revealed");
    });
  }

  document.getElementById("cardFavoriteBtn")?.addEventListener("click", () => {
    toggleFavorite(thought);
    renderThought(thought, false);
    renderSaved();
  });

  document.getElementById("cardShareBtn")?.addEventListener("click", () => {
    shareThought(thought);
  });
};

const filteredSavedThoughts = () => {
  if (appState.savedFilter === "all") {
    return appState.savedThoughts;
  }
  return appState.savedThoughts.filter((item) => item.section === appState.savedFilter);
};

const renderSaved = () => {
  if (!savedList) {
    return;
  }

  savedList.innerHTML = "";
  const list = filteredSavedThoughts();

  if (!list.length) {
    const empty = document.createElement("li");
    empty.className = "saved-item";
    empty.innerHTML = `
      <p class="saved-meta">DAILY AFFIRMATIONS</p>
      <p class="saved-text">No saved thoughts for this filter yet.</p>
    `;
    savedList.appendChild(empty);
    if (clearSavedBtn) {
      clearSavedBtn.hidden = appState.savedThoughts.length === 0;
    }
    return;
  }

  if (clearSavedBtn) {
    clearSavedBtn.hidden = false;
  }

  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.innerHTML = `
      <p class="saved-meta">${formatTimestamp(item.timestamp)} · ${item.sectionLabel || item.section} · ${item.category}</p>
      <p class="saved-text">${item.text}</p>
      <div class="saved-actions">
        <button type="button" class="icon-btn icon-star is-favorited" data-unfavorite-id="${item.id}" aria-label="Remove from favorites">★</button>
        <button type="button" class="icon-btn" data-share-id="${item.id}" aria-label="Share or download favorite">⤴</button>
      </div>
    `;
    savedList.appendChild(li);
  });

  savedList.querySelectorAll("[data-unfavorite-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.savedThoughts = appState.savedThoughts.filter((item) => item.id !== btn.dataset.unfavoriteId);
      persistSaved();
      renderSaved();
      if (appState.currentThought) {
        renderThought(appState.currentThought, false);
      }
    });
  });

  savedList.querySelectorAll("[data-share-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const thought = appState.savedThoughts.find((item) => item.id === btn.dataset.shareId);
      if (!thought) {
        return;
      }
      shareThought({
        section: thought.section,
        sectionLabel: thought.sectionLabel,
        category: thought.category,
        message: thought.text,
        why: "",
        action: "",
        timestamp: thought.timestamp
      });
    });
  });
};

const revealThought = () => {
  if (!appState.selectedCategory) {
    setRevealState();
    return;
  }

  renderThought(getThoughtForCategory(appState.activeSection, appState.selectedCategory));
};

const restoreSavedThoughts = () => {
  try {
    const rawSaved = safeStorageGet(STORAGE_KEYS.savedThoughts);
    appState.savedThoughts = rawSaved ? JSON.parse(rawSaved) : [];
    if (!Array.isArray(appState.savedThoughts)) {
      appState.savedThoughts = [];
    }
  } catch {
    appState.savedThoughts = [];
  }
};

const restoreState = () => {
  restoreSavedThoughts();

  const storedSection = safeStorageGet("abetterthought.activeSection");
  if (storedSection && sectionConfigs[storedSection]) {
    appState.activeSection = storedSection;
  }

  try {
    const rawSelected = safeStorageGet(STORAGE_KEYS.selectedCategory);
    const parsed = rawSelected ? JSON.parse(rawSelected) : null;
    if (parsed && typeof parsed === "object") {
      appState.selectedCategoryBySection = {
        personal: parsed.personal || "",
        parents: parsed.parents || ""
      };
    } else if (typeof rawSelected === "string" && rawSelected && !rawSelected.startsWith("{")) {
      appState.selectedCategoryBySection.personal = rawSelected;
    }
  } catch {
    appState.selectedCategoryBySection = { personal: "", parents: "" };
  }

  appState.selectedCategory = appState.selectedCategoryBySection[appState.activeSection] || "";

  const storedOrder = safeStorageGet("abetterthought.orderFilter");
  if (storedOrder && orderFilter) {
    orderFilter.value = storedOrder;
  }

  setSectionButtons();
  if (orderFilter && categorySelect) {
    buildCategoryOptions(orderFilter.value);
    if (appState.selectedCategory && getCurrentCategories()[appState.selectedCategory]) {
      categorySelect.value = appState.selectedCategory;
    }
  }

  setRevealState();

  try {
    const rawThought = safeStorageGet(STORAGE_KEYS.lastThought);
    if (rawThought) {
      const parsed = JSON.parse(rawThought);
      if (parsed?.category && parsed?.message && parsed?.section) {
        appState.currentThought = parsed;
        appState.lastThoughtByBucket[makeBucketKey(parsed.section, parsed.category)] = parsed.message;
        if (parsed.section === appState.activeSection) {
          renderThought(
            {
              section: parsed.section,
              sectionLabel: parsed.sectionLabel || sectionConfigs[parsed.section]?.label || "Personal",
              category: parsed.category,
              message: parsed.message,
              why: parsed.why || "This reminder helps you pause and respond with intention.",
              action: parsed.action || "Take one slow breath and choose your next kind step.",
              timestamp: parsed.timestamp || Date.now()
            },
            false
          );
        }
      }
    }
  } catch {
    // ignore malformed storage
  }

  renderSaved();
};

const initHomePage = () => {
  orderFilter?.addEventListener("change", (event) => {
    safeStorageSet("abetterthought.orderFilter", event.target.value);
    buildCategoryOptions(event.target.value);
    if (appState.selectedCategory && getCurrentCategories()[appState.selectedCategory]) {
      categorySelect.value = appState.selectedCategory;
    }
  });

  categorySelect?.addEventListener("change", (event) => {
    setSelectedCategory(event.target.value);
  });

  revealBtn?.addEventListener("click", revealThought);

  [personalSectionBtn, parentsSectionBtn].forEach((btn) => {
    btn?.addEventListener("click", () => {
      switchSection(btn.dataset.section);
    });
  });

  restoreState();
};

const initFavoritesPage = () => {
  restoreSavedThoughts();

  const savedFilter = safeStorageGet("abetterthought.savedFilter");
  if (savedFilter && ["all", "personal", "parents"].includes(savedFilter)) {
    appState.savedFilter = savedFilter;
  }

  savedFilterBtns.forEach((btn) => {
    const active = btn.dataset.savedFilter === appState.savedFilter;
    btn.classList.toggle("is-active", active);
    btn.addEventListener("click", () => {
      appState.savedFilter = btn.dataset.savedFilter;
      safeStorageSet("abetterthought.savedFilter", appState.savedFilter);
      savedFilterBtns.forEach((other) => {
        other.classList.toggle("is-active", other === btn);
      });
      renderSaved();
    });
  });

  renderSaved();

  clearSavedBtn?.addEventListener("click", () => {
    appState.savedThoughts = [];
    persistSaved();
    renderSaved();
  });
};

if (document.body.dataset.page === "favorites") {
  initFavoritesPage();
} else {
  initHomePage();
}
