(function () {
  const SPACES = {
    Personal: [
      "Gratitude", "Calm", "Joy", "Hope", "Confidence", "Focused", "Motivated", "Connected", "Balanced", "Overwhelmed",
      "Anxious", "Distracted", "Unmotivated", "Selfdoubt", "Angry", "Sad", "Guilt", "Lonely", "Burnout", "Overthinking"
    ],
    Work: ["Focus", "Boundaries", "Confidence", "Clarity", "Pressure", "Conflict", "Feedback", "Priorities", "Momentum", "Balance", "Burnout", "Purpose"],
    Parents: ["Patience", "Presence", "Calm", "Consistency", "Connection", "Energy", "Guilt", "Overwhelm", "Play", "Discipline", "Partnership", "Rest"],
    Relationships: ["Connection", "Trust", "Respect", "Listening", "Conflict", "Repair", "Boundaries", "Intimacy", "Appreciation", "Patience", "Honesty", "Growth"],
    Single: ["Confidence", "Independence", "Healing", "Standards", "Courage", "Social", "Peace", "Openness", "Purpose", "Selfworth", "Adventure", "Hope"],
    Student: ["Focus", "Discipline", "Motivation", "Confidence", "Time", "Stress", "Clarity", "Memory", "Progress", "Rest", "Momentum", "Resilience"],
    ADHD: ["Focus", "Momentum", "Clarity", "Planning", "Distraction", "Overwhelm", "Routine", "Impulses", "Energy", "Patience", "Followthrough", "Reset"],
    Caregiver: ["Patience", "Compassion", "Boundaries", "Rest", "Support", "Guilt", "Stress", "Strength", "Presence", "Acceptance", "Balance", "Recovery"],
    "Military/Veteran": ["Purpose", "Discipline", "Transition", "Identity", "Calm", "Brotherhood", "Resilience", "Stress", "Recovery", "Leadership", "Routine", "Mission"],
    Entrepreneur: ["Vision", "Focus", "Momentum", "Risk", "Clarity", "Discipline", "Consistency", "Confidence", "Burnout", "Patience", "Systems", "Growth"]
  };

  const CATEGORY_CONTEXT = {
    Gratitude: "one detail you appreciate", Calm: "your breathing pace", Joy: "one small pleasant moment", Hope: "the next workable step",
    Confidence: "evidence from past wins", Focused: "a single priority", Motivated: "a tiny starting action", Connected: "a meaningful check-in",
    Balanced: "one thing to pause", Overwhelmed: "one task at a time", Anxious: "the present moment", Distracted: "one distraction to close",
    Unmotivated: "a two-minute start", Selfdoubt: "facts instead of fear", Angry: "space before response", Sad: "a kind next action",
    Guilt: "what can be repaired now", Lonely: "one brief connection", Burnout: "an energy boundary", Overthinking: "one decision limit"
  };

  const LANE_CONTEXT = {
    Work: "the next useful work move",
    Parents: "co-regulation before direction",
    Relationships: "clear and respectful communication",
    Single: "self-trust in daily choices",
    Student: "short focused study blocks",
    ADHD: "external structure and one-step momentum",
    Caregiver: "sustainable care with boundaries",
    "Military/Veteran": "steady mission-focused routines",
    Entrepreneur: "execution over over-analysis"
  };

  const MAIN_PATTERNS = [
    "You don’t need to solve everything now. Choose {focus} and start there.",
    "Keep this simple: commit to {focus} for the next few minutes.",
    "Progress grows when you narrow your attention to {focus}.",
    "A small reset helps: return to {focus} before adding anything else.",
    "Clarity comes faster when you work from {focus}, not pressure.",
    "Let this moment be manageable. Anchor yourself in {focus}."
  ];

  const WHY_PATTERNS = [
    "Narrowing attention to {focus} reduces cognitive load and makes follow-through easier.",
    "A clear target like {focus} calms the nervous system by reducing uncertainty.",
    "This perspective shift turns rumination into action you can complete around {focus}.",
    "Repeating {focus} strengthens a practical habit loop you can trust.",
    "A boundary around {focus} protects your energy and prevents overload.",
    "Simple, direct self-talk about {focus} lowers internal conflict."
  ];

  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const buildCards = (space, category) => {
    const focus = space === "Personal" ? (CATEGORY_CONTEXT[category] || `one grounded step for ${category.toLowerCase()}`) : (LANE_CONTEXT[space] || `one clear step for ${category.toLowerCase()}`);
    return MAIN_PATTERNS.map((pattern, i) => ({
      id: `${slug(space)}-${slug(category)}-${String(i + 1).padStart(3, "0")}`,
      space,
      category,
      main: pattern.replaceAll("{focus}", focus),
      why: WHY_PATTERNS[i % WHY_PATTERNS.length].replaceAll("{focus}", focus)
    }));
  };

  const messageCards = {};
  Object.entries(SPACES).forEach(([space, categories]) => {
    messageCards[space] = {};
    categories.forEach((category) => {
      messageCards[space][category] = buildCards(space, category);
    });
  });

  window.APP_CONTENT = { SPACES, messageCards };
})();
