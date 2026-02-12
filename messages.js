(function () {
  const SPACES = {
    Personal: [
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

  const IDEAS = [
    {
      main: "You do not need to solve all of this at once. One clear next step is enough.",
      why: "This helps because narrowing your focus lowers mental load and makes starting easier.",
      do: "Write one next step and do only that step for 60 seconds."
    },
    {
      main: "Slow is still progress. A steady pace often gets more done than a rushed one.",
      why: "This helps because a calmer pace reduces errors and saves energy for what matters.",
      do: "Take one slow breath, then continue at a pace you can sustain."
    },
    {
      main: "You can be kind and clear at the same time.",
      why: "This helps because clear communication prevents confusion and lowers tension.",
      do: "Say one short sentence that states what you need right now."
    },
    {
      main: "Start where your feet are. Use what is already in front of you.",
      why: "This helps because immediate action builds momentum faster than overplanning.",
      do: "Choose one item in front of you and complete the smallest useful action."
    },
    {
      main: "A small reset can change the next hour.",
      why: "This helps because short resets interrupt stress cycles and improve attention.",
      do: "Relax your shoulders, unclench your jaw, and exhale slowly once."
    },
    {
      main: "Done is more useful than perfect in this moment.",
      why: "This helps because aiming for completion creates feedback you can improve later.",
      do: "Finish a rough first version instead of refining details."
    },
    {
      main: "You can choose the next right action even if you feel uncertain.",
      why: "This helps because action creates clarity that thinking alone cannot provide.",
      do: "Set a 2-minute timer and begin the task you are delaying."
    },
    {
      main: "You are allowed to protect your energy.",
      why: "This helps because energy boundaries reduce burnout and support consistent effort.",
      do: "Pause one nonessential task and keep only the top priority active."
    },
    {
      main: "Your attention is a resource. Spend it on what moves things forward.",
      why: "This helps because directed attention increases progress and reduces scattered effort.",
      do: "Mute one distraction and work in a single tab for 5 minutes."
    },
    {
      main: "One supportive thought can shift your response.",
      why: "This helps because self-talk influences stress levels and decision quality.",
      do: "Replace one self-critical sentence with a practical supportive one."
    },
    {
      main: "You can reset this moment without rewriting the whole day.",
      why: "This helps because a present-moment reset prevents one hard moment from cascading.",
      do: "Name what happened, then choose one helpful next move."
    },
    {
      main: "Progress comes from repetition, not intensity.",
      why: "This helps because consistent small actions compound into meaningful change.",
      do: "Repeat one tiny helpful action three times today."
    }
  ];

  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const buildCardsFor = (space, category) =>
    IDEAS.map((idea, idx) => ({
      id: `${slug(space)}-${slug(category)}-${String(idx + 1).padStart(3, "0")}`,
      main: idea.main,
      why: idea.why,
      do: idea.do
    }));

  const messageCards = {};
  Object.entries(SPACES).forEach(([space, categories]) => {
    messageCards[space] = {};
    categories.forEach((category) => {
      messageCards[space][category] = buildCardsFor(space, category);
    });
  });

  window.APP_CONTENT = { SPACES, messageCards };
})();
