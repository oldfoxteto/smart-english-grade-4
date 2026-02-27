const levelByScore = [
  { min: 0, max: 24, cefr: "A1" },
  { min: 25, max: 49, cefr: "A2" },
  { min: 50, max: 74, cefr: "B1" },
  { min: 75, max: 89, cefr: "B2" },
  { min: 90, max: 97, cefr: "C1" },
  { min: 98, max: 100, cefr: "C2" }
];

export function scoreToCefr(score) {
  const matched = levelByScore.find((item) => score >= item.min && score <= item.max);
  return matched ? matched.cefr : "A1";
}

export function buildPathRules({ cefr, goalType }) {
  const base = {
    A1: ["daily-life-basics", "survival-phrases", "pronunciation-basics"],
    A2: ["daily-conversations", "travel-core", "grammar-foundations"],
    B1: ["work-communication", "story-listening", "expanded-grammar"],
    B2: ["professional-dialogues", "interview-prep", "fluency-drills"],
    C1: ["argumentation", "academic-reading", "advanced-speaking"],
    C2: ["native-like-precision", "domain-specialization", "high-stakes-speaking"]
  };

  const goalExtensions = {
    travel: ["airport-simulation", "hotel-simulation", "emergency-travel"],
    work: ["job-interview-simulation", "meeting-simulation", "email-writing"],
    study: ["lecture-notes", "exam-speaking", "academic-writing"],
    migration: ["immigration-interview", "healthcare-visit", "housing-utilities"],
    daily: ["shopping-simulation", "restaurant-simulation", "daily-routines"]
  };

  return [...(base[cefr] || base.A1), ...(goalExtensions[goalType] || goalExtensions.daily)];
}
