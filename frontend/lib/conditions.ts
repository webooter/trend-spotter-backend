export interface Condition {
  slug:        string;
  name:        string;
  emoji:       string;
  tagline:     string;
  volume:      string;
  spoonacular: string;
  color:       string;
}

export const CONDITIONS: Condition[] = [
  {
    slug:        "joint-pain",
    name:        "Joint Pain & Arthritis",
    emoji:       "🦴",
    tagline:     "Reduce swelling, move freely",
    volume:      "3,600/mo",
    spoonacular: "turmeric ginger",
    color:       "from-orange-500 to-red-500",
  },
  {
    slug:        "eczema",
    name:        "Eczema & Skin Inflammation",
    emoji:       "🌿",
    tagline:     "Calm flare-ups from within",
    volume:      "2,900/mo",
    spoonacular: "omega-3 anti-inflammatory",
    color:       "from-emerald-500 to-teal-500",
  },
  {
    slug:        "weight-loss",
    name:        "Weight Loss",
    emoji:       "⚡",
    tagline:     "Burn fat, not muscle",
    volume:      "3,600/mo",
    spoonacular: "low calorie anti-inflammatory",
    color:       "from-violet-500 to-purple-500",
  },
  {
    slug:        "gut-health",
    name:        "Gut Health",
    emoji:       "🫁",
    tagline:     "Heal your microbiome",
    volume:      "14,800/mo",
    spoonacular: "fermented probiotic",
    color:       "from-blue-500 to-cyan-500",
  },
  {
    slug:        "perimenopause",
    name:        "Perimenopause",
    emoji:       "🌸",
    tagline:     "Balance hormones naturally",
    volume:      "590/mo",
    spoonacular: "phytoestrogen flaxseed",
    color:       "from-pink-500 to-rose-500",
  },
  {
    slug:        "autoimmune",
    name:        "Autoimmune Conditions",
    emoji:       "🛡️",
    tagline:     "Support immune regulation",
    volume:      "2,900/mo",
    spoonacular: "anti-inflammatory whole foods",
    color:       "from-amber-500 to-orange-500",
  },
];

export function getCondition(slug: string): Condition | undefined {
  return CONDITIONS.find((c) => c.slug === slug);
}

export const COOKING_TIMES = [
  { value: "under-20", label: "Under 20 min", emoji: "⚡" },
  { value: "30-45",    label: "30–45 min",    emoji: "🍳" },
  { value: "any",      label: "No preference", emoji: "🕐" },
];

export const DIETARY = [
  { value: "none",        label: "No restrictions" },
  { value: "gluten-free", label: "Gluten-free"     },
  { value: "dairy-free",  label: "Dairy-free"      },
  { value: "vegan",       label: "Vegan"            },
  { value: "vegetarian",  label: "Vegetarian"       },
];
