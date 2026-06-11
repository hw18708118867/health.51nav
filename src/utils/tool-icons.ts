export type ToolIconMeta = {
  category: "fitness" | "nutrition" | "pregnancy" | "health";
  label: string;
};

const iconMeta: Record<string, ToolIconMeta> = {
  "bmi-calculator": { category: "fitness", label: "BMI" },
  "bmr-calculator": { category: "fitness", label: "BMR" },
  "tdee-calculator": { category: "fitness", label: "TDEE" },
  "body-fat-calculator": { category: "fitness", label: "Body Fat" },
  "lean-body-mass-calculator": { category: "fitness", label: "Lean Body Mass" },
  "ideal-weight-calculator": { category: "fitness", label: "Ideal Weight" },
  "protein-calculator": { category: "fitness", label: "Protein" },
  "macro-calculator": { category: "fitness", label: "Macros" },
  "water-intake-calculator": { category: "fitness", label: "Water Intake" },
  "calorie-calculator": { category: "nutrition", label: "Calories" },
  "meal-calorie-calculator": { category: "nutrition", label: "Meal Calories" },
  "carb-calculator": { category: "nutrition", label: "Carbs" },
  "fat-intake-calculator": { category: "nutrition", label: "Fat Intake" },
  "fiber-intake-calculator": { category: "nutrition", label: "Fiber" },
  "due-date-calculator": { category: "pregnancy", label: "Due Date" },
  "ovulation-calculator": { category: "pregnancy", label: "Ovulation" },
  "pregnancy-weight-gain-calculator": { category: "pregnancy", label: "Pregnancy Weight Gain" },
  "blood-pressure-calculator": { category: "health", label: "Blood Pressure" },
  "heart-rate-zone-calculator": { category: "health", label: "Heart Rate Zone" },
  "bac-calculator": { category: "health", label: "BAC" },
  "sleep-calculator": { category: "health", label: "Sleep" }
};

export const getToolIconMeta = (slug: string): ToolIconMeta =>
  iconMeta[slug] ?? { category: "health", label: "Tool" };

export const renderToolIconSvg = (slug: string, className = "tool-icon-svg"): string => {
  const svgOpen = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${className}">`;
  const svgClose = "</svg>";

  const paths: Record<string, string> = {
    "bmi-calculator": '<path d="M7 5h10"/><path d="M8 5v12"/><path d="M16 5v12"/><path d="M5 17h14"/><path d="M12 9v4"/><path d="M10 11h4"/>',
    "bmr-calculator": '<path d="M12 3c2 2 3 3.7 3 5.6A3 3 0 0 1 12 12a3 3 0 0 1-3-3.4C9 6.7 10 5 12 3Z"/><path d="M8 14c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5"/><path d="M7 19h10"/>',
    "tdee-calculator": '<path d="M5 15a7 7 0 1 1 14 0"/><path d="M12 12l3-3"/><path d="M12 15h.01"/>',
    "body-fat-calculator": '<path d="M12 4c2.8 3.2 4 5.1 4 7a4 4 0 1 1-8 0c0-1.9 1.2-3.8 4-7Z"/><path d="M10 15c.5.6 1.1 1 2 1"/>',
    "lean-body-mass-calculator": '<path d="M9 7 7 9v6l2 2"/><path d="M15 7 17 9v6l-2 2"/><path d="M9 7h6"/><path d="M9 17h6"/>',
    "ideal-weight-calculator": '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 5v2"/><path d="M19 12h-2"/><path d="M12 19v-2"/><path d="M5 12h2"/>',
    "protein-calculator": '<path d="M8 6c0-1.1.9-2 2-2 1.6 0 2.4 1.3 2 2.6"/><path d="M14 6c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-1.3 2.8-3 4.5-1.7-1.7-3-3-3-4.5Z"/><path d="M6 12h12"/><path d="M8 16h8"/>',
    "macro-calculator": '<path d="M12 4v8l6 3"/><circle cx="12" cy="12" r="8"/><path d="M12 12 5 8"/>',
    "water-intake-calculator": '<path d="M12 3c2.5 3 4 5 4 7a4 4 0 1 1-8 0c0-2 1.5-4 4-7Z"/><path d="M9 15c1 .8 1.8 1 3 1"/>',
    "calorie-calculator": '<path d="M12 3v4"/><path d="M16.5 5.5 14 8"/><path d="M7.5 5.5 10 8"/><path d="M5 12h14"/><path d="M8 17h8"/>',
    "meal-calorie-calculator": '<path d="M4 11h16"/><path d="M6 11a6 6 0 0 1 12 0"/><path d="M8 15h8"/><path d="M12 7v2"/>',
    "carb-calculator": '<path d="M8 18c0-4 2-6 4-8 2 2 4 4 4 8"/><path d="M10 10c0-1.7 1-3 2-4 1 1 2 2.3 2 4"/>',
    "fat-intake-calculator": '<path d="M12 4c2.4 2.5 4 4.6 4 6.8A4 4 0 1 1 8 10.8C8 8.6 9.6 6.5 12 4Z"/><path d="M14 16c1-.7 1.6-1.7 1.9-3"/>',
    "fiber-intake-calculator": '<path d="M7 17c3-5 7-7 10-8-1 4-4 8-10 8Z"/><path d="M9 15c.8-2 2.2-3.8 4.5-5.5"/>',
    "due-date-calculator": '<rect x="5" y="6" width="14" height="13" rx="2"/><path d="M8 4v4"/><path d="M16 4v4"/><path d="M5 10h14"/><path d="M9 14h6"/>',
    "ovulation-calculator": '<circle cx="12" cy="12" r="3"/><path d="M12 4v3"/><path d="M12 17v3"/><path d="M4 12h3"/><path d="M17 12h3"/><path d="m6.5 6.5 2 2"/><path d="m15.5 15.5 2 2"/><path d="m17.5 6.5-2 2"/><path d="m8.5 15.5-2 2"/>',
    "pregnancy-weight-gain-calculator": '<path d="M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3"/><path d="M8 10c0-1.7 1.8-3 4-3s4 1.3 4 3v5c0 2-1.8 4-4 4s-4-2-4-4Z"/><path d="M9 15h6"/>',
    "blood-pressure-calculator": '<path d="M7 12c0-3 2.2-5 5-5s5 2 5 5"/><path d="M12 12l3-3"/><path d="M6 17h12"/>',
    "heart-rate-zone-calculator": '<path d="M4 13h4l2-4 3 7 2-3h5"/><path d="M4 17h16"/>',
    "bac-calculator": '<path d="M9 4h6"/><path d="M10 4v5l-3 7a2 2 0 0 0 2 3h6a2 2 0 0 0 2-3l-3-7V4"/><path d="M9 11h6"/>',
    "sleep-calculator": '<path d="M15.5 4.5a7.5 7.5 0 1 0 4 13.5 6.5 6.5 0 1 1-4-13.5Z"/><path d="M6 8h.01"/><path d="M8.5 6h.01"/>'
  };

  return `${svgOpen}${paths[slug] ?? '<circle cx="12" cy="12" r="7"/><path d="M12 8v4"/><path d="M12 16h.01"/>'}${svgClose}`;
};
