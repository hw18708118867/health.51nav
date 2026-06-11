import type { CalculationResult, CalculatorConfig, UnitSystem } from "../types/calculator";

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

const round = (value: number, digits = 1) => Number(value.toFixed(digits));

const getHeightCm = (data: Record<string, FormDataEntryValue>, unitSystem: UnitSystem) => {
  if (unitSystem === "metric") {
    return Number(data.heightCm);
  }

  return (Number(data.heightFt) * 12 + Number(data.heightIn)) * CM_PER_IN;
};

const getWeightKg = (data: Record<string, FormDataEntryValue>, unitSystem: UnitSystem) => {
  if (unitSystem === "metric") {
    return Number(data.weightKg);
  }

  return Number(data.weightLb) * KG_PER_LB;
};

const getBodyFatCategory = (sex: string, bodyFat: number) => {
  if (sex === "male") {
    if (bodyFat < 6) return "essential fat range";
    if (bodyFat < 14) return "athletic range";
    if (bodyFat < 18) return "fit range";
    if (bodyFat < 25) return "average range";
    return "higher body fat range";
  }

  if (bodyFat < 14) return "essential fat range";
  if (bodyFat < 21) return "athletic range";
  if (bodyFat < 25) return "fit range";
  if (bodyFat < 32) return "average range";
  return "higher body fat range";
};

const classifyBmi = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
};

const calcBmr = (sex: string, weightKg: number, heightCm: number, age: number) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
};

const adjustCaloriesForGoal = (tdee: number, goal: string) => {
  if (goal === "cut") return tdee - 400;
  if (goal === "bulk") return tdee + 250;
  return tdee;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const date = new Date(2024, 0, 1, hours, mins);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
};

export const calculate = (
  calculator: CalculatorConfig,
  data: Record<string, FormDataEntryValue>,
  unitSystem: UnitSystem
): CalculationResult => {
  switch (calculator.formula) {
    case "bmi": {
      const weightKg = getWeightKg(data, unitSystem);
      const heightM = getHeightCm(data, unitSystem) / 100;
      const bmi = weightKg / (heightM * heightM);
      const category = classifyBmi(bmi);
      return {
        summary: `${round(bmi)} BMI (${category})`,
        details: [
          { label: "BMI", value: round(bmi, 1).toString() },
          { label: "Category", value: category },
          { label: "Healthy range", value: "18.5 to 24.9" }
        ],
        tips: ["Use BMI as a screening number, then compare it with body fat, waist size, and lifestyle factors."]
      };
    }
    case "bmr": {
      const weightKg = getWeightKg(data, unitSystem);
      const heightCm = getHeightCm(data, unitSystem);
      const bmr = calcBmr(String(data.sex), weightKg, heightCm, Number(data.age));
      return {
        summary: `${Math.round(bmr)} calories/day at rest`,
        details: [
          { label: "Estimated BMR", value: `${Math.round(bmr)} kcal/day` },
          { label: "Formula", value: "Mifflin-St Jeor" }
        ],
        tips: ["Use BMR as your baseline, then apply activity with the TDEE calculator for a real daily target."]
      };
    }
    case "tdee":
    case "calorie":
    case "macro": {
      const weightKg = getWeightKg(data, unitSystem);
      const heightCm = getHeightCm(data, unitSystem);
      const bmr = calcBmr(String(data.sex), weightKg, heightCm, Number(data.age));
      const tdee = bmr * Number(data.activity);
      const target = adjustCaloriesForGoal(tdee, String(data.goal));

      if (calculator.formula === "tdee") {
        return {
          summary: `${Math.round(tdee)} calories/day to maintain`,
          details: [
            { label: "BMR", value: `${Math.round(bmr)} kcal/day` },
            { label: "Maintenance calories", value: `${Math.round(tdee)} kcal/day` },
            { label: "Goal calories", value: `${Math.round(target)} kcal/day` }
          ],
          tips: ["Track two weeks of body-weight averages and adjust calories up or down if the estimate misses your real maintenance level."]
        };
      }

      if (calculator.formula === "calorie") {
        return {
          summary: `${Math.round(target)} calories/day for your goal`,
          details: [
            { label: "Maintenance calories", value: `${Math.round(tdee)} kcal/day` },
            { label: "Goal", value: String(data.goal) },
            { label: "Recommended intake", value: `${Math.round(target)} kcal/day` }
          ],
          tips: ["Consistency matters more than exact perfection. Use weekly averages rather than judging a single day."]
        };
      }

      const proteinGrams = Math.round(weightKg * (String(data.goal) === "cut" ? 2 : 1.8));
      const fatGrams = Math.round((target * 0.28) / 9);
      const carbGrams = Math.round((target - proteinGrams * 4 - fatGrams * 9) / 4);

      return {
        summary: `${proteinGrams}g protein, ${carbGrams}g carbs, ${fatGrams}g fat`,
        details: [
          { label: "Calories", value: `${Math.round(target)} kcal/day` },
          { label: "Protein", value: `${proteinGrams} g/day` },
          { label: "Carbohydrates", value: `${carbGrams} g/day` },
          { label: "Fat", value: `${fatGrams} g/day` }
        ],
        tips: ["Keep protein stable first, then shift carbs and fats based on training style and personal preference."]
      };
    }
    case "body-fat": {
      const heightCm = getHeightCm(data, unitSystem);
      const neck = unitSystem === "metric" ? Number(data.neckCm) : Number(data.neckIn) * CM_PER_IN;
      const waist = unitSystem === "metric" ? Number(data.waistCm) : Number(data.waistIn) * CM_PER_IN;
      const sex = String(data.sex);
      const hip =
        sex === "female"
          ? unitSystem === "metric"
            ? Number(data.hipCm)
            : Number(data.hipIn) * CM_PER_IN
          : 0;

      const bodyFat =
        sex === "male"
          ? 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450
          : 495 /
              (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(heightCm)) -
            450;

      return {
        summary: `${round(bodyFat)}% body fat`,
        details: [
          { label: "Body fat", value: `${round(bodyFat)}%` },
          { label: "Range", value: getBodyFatCategory(sex, bodyFat) }
        ],
        tips: ["Measure under the same conditions each time if you want trend data that is actually useful."]
      };
    }
    case "lean-body-mass": {
      const weightKg = getWeightKg(data, unitSystem);
      const bodyFat = Number(data.bodyFatPercent);
      const lbm = weightKg * (1 - bodyFat / 100);
      return {
        summary: `${round(lbm)} kg lean body mass`,
        details: [
          { label: "Lean body mass", value: `${round(lbm)} kg` },
          { label: "Fat mass", value: `${round(weightKg - lbm)} kg` }
        ],
        tips: ["Lean body mass is useful for protein planning and for comparing progress during a cut or recomposition phase."]
      };
    }
    case "ideal-weight": {
      const totalInches = getHeightCm(data, unitSystem) / CM_PER_IN;
      const baseInches = Math.max(totalInches - 60, 0);
      const idealKg = String(data.sex) === "male" ? 50 + 2.3 * baseInches : 45.5 + 2.3 * baseInches;
      return {
        summary: `${round(idealKg)} kg estimated ideal weight`,
        details: [
          { label: "Estimated target", value: `${round(idealKg)} kg` },
          { label: "Practical range", value: `${round(idealKg - 4)} to ${round(idealKg + 4)} kg` }
        ],
        tips: ["Treat ideal weight as a reference point, not a requirement. Body composition and health habits still matter more."]
      };
    }
    case "protein": {
      const weightKg = getWeightKg(data, unitSystem);
      const activity = Number(data.activity);
      const goal = String(data.goal);
      const multiplier = goal === "cut" ? 2.2 : activity >= 1.725 ? 2 : 1.6;
      const protein = Math.round(weightKg * multiplier);
      return {
        summary: `${protein} grams of protein per day`,
        details: [
          { label: "Protein target", value: `${protein} g/day` },
          { label: "Per meal over 4 meals", value: `${Math.round(protein / 4)} g/meal` }
        ],
        tips: ["Most people find it easier to hit protein by anchoring each meal around one strong protein source."]
      };
    }
    case "water": {
      const weightKg = getWeightKg(data, unitSystem);
      const exerciseMinutes = Number(data.exerciseMinutes);
      const liters = weightKg * 0.033 + exerciseMinutes * 0.012;
      return {
        summary: `${round(liters, 2)} liters per day`,
        details: [
          { label: "Water target", value: `${round(liters, 2)} L/day` },
          { label: "Approximate cups", value: `${Math.round(liters * 4.23)} cups/day` }
        ],
        tips: ["If you sweat heavily, live in a hot climate, or exercise longer than usual, you may need more than this estimate."]
      };
    }
    case "meal-calorie": {
      const daily = Number(data.dailyCalories);
      const meals = Number(data.meals);
      const perMeal = Math.round(daily / meals);
      return {
        summary: `${perMeal} calories per meal`,
        details: [
          { label: "Daily calories", value: `${daily} kcal/day` },
          { label: "Meals", value: `${meals}` },
          { label: "Average per meal", value: `${perMeal} kcal` }
        ],
        tips: ["You do not need perfect equal splits. Use this as a planning anchor and adjust around hunger and schedule."]
      };
    }
    case "carb": {
      const calories = Number(data.dailyCalories);
      const activity = Number(data.activity);
      const carbRatio = activity >= 1.725 ? 0.5 : activity >= 1.55 ? 0.45 : 0.4;
      const carbs = Math.round((calories * carbRatio) / 4);
      return {
        summary: `${carbs} grams of carbs per day`,
        details: [
          { label: "Daily calories", value: `${calories} kcal/day` },
          { label: "Carb target", value: `${carbs} g/day` }
        ],
        tips: ["Center more of your carbs around training if performance and recovery are priorities."]
      };
    }
    case "fat-intake": {
      const calories = Number(data.dailyCalories);
      const weightKg = getWeightKg(data, unitSystem);
      const target = Math.max((calories * 0.28) / 9, weightKg * 0.6);
      return {
        summary: `${Math.round(target)} grams of fat per day`,
        details: [
          { label: "Fat target", value: `${Math.round(target)} g/day` },
          { label: "Calories from fat", value: `${Math.round(target * 9)} kcal/day` }
        ],
        tips: ["Going extremely low on dietary fat often makes diets harder to maintain and can reduce meal satisfaction."]
      };
    }
    case "fiber": {
      const calories = Number(data.dailyCalories);
      const target = Math.max((calories / 1000) * 14, String(data.sex) === "male" ? 31 : 25);
      return {
        summary: `${Math.round(target)} grams of fiber per day`,
        details: [
          { label: "Fiber target", value: `${Math.round(target)} g/day` },
          { label: "Based on intake", value: "14 g per 1,000 calories" }
        ],
        tips: ["Increase fiber gradually and make sure water intake rises with it."]
      };
    }
    case "due-date": {
      const method = String(data.method);
      const start = new Date(String(method === "lmp" ? data.lmpDate : data.conceptionDate));
      const dueDate = addDays(start, method === "lmp" ? 280 : 266);
      const currentWeek = Math.max(Math.floor((Date.now() - start.getTime()) / 604800000), 0);
      return {
        summary: `Estimated due date: ${formatDate(dueDate)}`,
        details: [
          { label: "Estimated due date", value: formatDate(dueDate) },
          { label: "Estimated pregnancy week", value: `${currentWeek} weeks` }
        ],
        tips: ["A due date is an estimate. Your care team may refine dating with ultrasound and clinical history."]
      };
    }
    case "ovulation": {
      const cycleStart = new Date(String(data.cycleStart));
      const cycleLength = Number(data.cycleLength);
      const nextPeriod = addDays(cycleStart, cycleLength);
      const ovulation = addDays(nextPeriod, -14);
      const fertileStart = addDays(ovulation, -5);
      return {
        summary: `Likely ovulation: ${formatDate(ovulation)}`,
        details: [
          { label: "Fertile window starts", value: formatDate(fertileStart) },
          { label: "Likely ovulation day", value: formatDate(ovulation) },
          { label: "Expected next period", value: formatDate(nextPeriod) }
        ],
        tips: ["Cycle tracking gives estimates only. Ovulation can shift from month to month."]
      };
    }
    case "pregnancy-weight-gain": {
      const weightKg = getWeightKg(data, unitSystem);
      const heightM = getHeightCm(data, unitSystem) / 100;
      const bmi = weightKg / (heightM * heightM);
      const weeks = Number(data.weeksPregnant);
      const range =
        bmi < 18.5 ? [12.5, 18] : bmi < 25 ? [11.5, 16] : bmi < 30 ? [7, 11.5] : [5, 9];
      const progress = Math.min(Math.max((weeks - 13) / 27, 0), 1);
      const currentLow = weeks <= 13 ? 2 : 2 + (range[0] - 2) * progress;
      const currentHigh = weeks <= 13 ? 3 : 3 + (range[1] - 3) * progress;
      return {
        summary: `${round(currentLow)} to ${round(currentHigh)} kg by week ${weeks}`,
        details: [
          { label: "Pre-pregnancy BMI", value: round(bmi).toString() },
          { label: "Full pregnancy range", value: `${range[0]} to ${range[1]} kg` },
          { label: "Suggested gain so far", value: `${round(currentLow)} to ${round(currentHigh)} kg` }
        ],
        tips: ["Pregnancy guidance should always be personalized by your clinician, especially for twins or high-risk pregnancies."]
      };
    }
    case "blood-pressure": {
      const systolic = Number(data.systolic);
      const diastolic = Number(data.diastolic);
      let category = "Normal";
      if (systolic >= 140 || diastolic >= 90) category = "High blood pressure stage 2";
      else if (systolic >= 130 || diastolic >= 80) category = "High blood pressure stage 1";
      else if (systolic >= 120 && diastolic < 80) category = "Elevated";
      return {
        summary: category,
        details: [
          { label: "Reading", value: `${systolic}/${diastolic} mmHg` },
          { label: "Category", value: category }
        ],
        tips: ["One reading is not a diagnosis. Repeated measurements and clinical advice matter more."]
      };
    }
    case "heart-rate-zone": {
      const age = Number(data.age);
      const resting = Number(data.restingHeartRate);
      const maxHeartRate = 220 - age;
      const reserve = maxHeartRate - resting;
      const z2Low = Math.round(resting + reserve * 0.6);
      const z2High = Math.round(resting + reserve * 0.7);
      const z4Low = Math.round(resting + reserve * 0.8);
      const z4High = Math.round(resting + reserve * 0.9);
      return {
        summary: `Zone 2: ${z2Low}-${z2High} bpm`,
        details: [
          { label: "Estimated max heart rate", value: `${maxHeartRate} bpm` },
          { label: "Zone 2", value: `${z2Low} to ${z2High} bpm` },
          { label: "Zone 4", value: `${z4Low} to ${z4High} bpm` }
        ],
        tips: ["Heart-rate zones are approximations. Perceived effort and actual performance still matter."]
      };
    }
    case "bac": {
      const sex = String(data.sex);
      const weightKg = getWeightKg(data, unitSystem);
      const weightLb = weightKg / KG_PER_LB;
      const drinks = Number(data.drinks);
      const hours = Number(data.hours);
      const ratio = sex === "male" ? 0.73 : 0.66;
      const bac = Math.max((drinks * 14 * 5.14) / (weightLb * ratio) - 0.015 * hours, 0);
      const category =
        bac < 0.03 ? "mild effects" : bac < 0.08 ? "significant impairment risk" : "high impairment risk";
      return {
        summary: `${round(bac, 3)} BAC estimate`,
        details: [
          { label: "Estimated BAC", value: round(bac, 3).toString() },
          { label: "Interpretation", value: category }
        ],
        note: "Never use this estimate to decide whether it is safe to drive.",
        tips: ["BAC varies by food intake, timing, medication use, and individual metabolism."]
      };
    }
    case "sleep": {
      const mode = String(data.mode);
      const baseTime = parseTime(String(mode === "bedtime" ? data.wakeTime : data.bedTime));
      const sleepLatency = 15;
      const cycles = [6, 5, 4];
      const times = cycles.map((cycleCount) => {
        const delta = cycleCount * 90 + sleepLatency;
        return mode === "bedtime" ? formatTime(baseTime - delta) : formatTime(baseTime + delta);
      });
      return {
        summary: mode === "bedtime" ? `Try sleeping around ${times[0]}` : `Try waking around ${times[0]}`,
        details: times.map((time, index) => ({
          label: `${cycles[index]} cycles`,
          value: time
        })),
        tips: ["Sleep quality, consistency, and total duration matter more than exact clock math."]
      };
    }
  }
};
