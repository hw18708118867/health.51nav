export type UnitSystem = "metric" | "imperial";

export type SelectOption = {
  label: string;
  value: string;
};

export type FieldCondition = {
  field: string;
  equals: string;
};

export type FieldDefinition = {
  name: string;
  label: string;
  type: "number" | "select" | "date" | "time";
  helper?: string;
  placeholder?: string;
  suffix?: string;
  step?: string;
  min?: number;
  max?: number;
  options?: readonly SelectOption[];
  defaultValue?: string | number;
  required?: boolean;
  unitSystems?: readonly UnitSystem[];
  showWhen?: FieldCondition;
};

export type ContentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CategoryKey = "fitness" | "nutrition" | "pregnancy" | "health";

export type CalculatorFormula =
  | "bmi"
  | "bmr"
  | "tdee"
  | "body-fat"
  | "lean-body-mass"
  | "ideal-weight"
  | "protein"
  | "macro"
  | "water"
  | "calorie"
  | "meal-calorie"
  | "carb"
  | "fat-intake"
  | "fiber"
  | "due-date"
  | "ovulation"
  | "pregnancy-weight-gain"
  | "blood-pressure"
  | "heart-rate-zone"
  | "bac"
  | "sleep";

export type CalculatorConfig = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  category: CategoryKey;
  cardBlurb: string;
  formula: CalculatorFormula;
  fields: FieldDefinition[];
  faqs: FaqItem[];
  sections: ContentSection[];
  related: string[];
  unitSystems?: UnitSystem[];
  updatedAt: string;
};

export type CalculationDetail = {
  label: string;
  value: string;
};

export type CalculationResult = {
  summary: string;
  details: CalculationDetail[];
  note?: string;
  tips?: string[];
};
