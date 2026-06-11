import type { CalculatorConfig, CategoryKey } from "../types/calculator";

const ageField = {
  name: "age",
  label: "Age",
  type: "number",
  suffix: "years",
  min: 14,
  max: 90,
  defaultValue: 30,
  required: true
} as const;

const sexField = {
  name: "sex",
  label: "Sex",
  type: "select",
  options: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" }
  ],
  defaultValue: "male",
  required: true
} as const;

const metricHeightField = {
  name: "heightCm",
  label: "Height",
  type: "number",
  suffix: "cm",
  min: 120,
  max: 230,
  defaultValue: 170,
  required: true,
  unitSystems: ["metric"]
} as const;

const imperialHeightFeetField = {
  name: "heightFt",
  label: "Height",
  type: "number",
  suffix: "ft",
  min: 3,
  max: 8,
  defaultValue: 5,
  required: true,
  unitSystems: ["imperial"]
} as const;

const imperialHeightInchesField = {
  name: "heightIn",
  label: "Height Inches",
  type: "number",
  suffix: "in",
  min: 0,
  max: 11,
  defaultValue: 7,
  required: true,
  unitSystems: ["imperial"]
} as const;

const metricWeightField = {
  name: "weightKg",
  label: "Weight",
  type: "number",
  suffix: "kg",
  min: 30,
  max: 250,
  step: "0.1",
  defaultValue: 70,
  required: true,
  unitSystems: ["metric"]
} as const;

const imperialWeightField = {
  name: "weightLb",
  label: "Weight",
  type: "number",
  suffix: "lb",
  min: 60,
  max: 550,
  step: "0.1",
  defaultValue: 154,
  required: true,
  unitSystems: ["imperial"]
} as const;

const activityField = {
  name: "activity",
  label: "Activity Level",
  type: "select",
  options: [
    { label: "Sedentary", value: "1.2" },
    { label: "Lightly active", value: "1.375" },
    { label: "Moderately active", value: "1.55" },
    { label: "Very active", value: "1.725" },
    { label: "Extra active", value: "1.9" }
  ],
  defaultValue: "1.55",
  required: true
} as const;

const goalField = {
  name: "goal",
  label: "Goal",
  type: "select",
  options: [
    { label: "Maintain", value: "maintain" },
    { label: "Mild fat loss", value: "cut" },
    { label: "Lean gain", value: "bulk" }
  ],
  defaultValue: "maintain",
  required: true
} as const;

const calculatorContent = (
  title: string,
  description: string,
  customSections: CalculatorConfig["sections"],
  faqs: CalculatorConfig["faqs"]
) => ({
  description,
  intro: `${title} helps you turn body data into a practical health benchmark. Use the calculator, review the result, and then read the guidance below to understand what the number means and how to use it.`,
  sections: customSections,
  faqs
});

export const calculators: CalculatorConfig[] = [
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    seoTitle: "BMI Calculator (Metric & Imperial) - HealthCalcHub",
    cardBlurb: "Check your Body Mass Index with metric or imperial units and understand the result.",
    category: "fitness",
    formula: "bmi",
    unitSystems: ["metric", "imperial"],
    fields: [
      metricHeightField,
      imperialHeightFeetField,
      imperialHeightInchesField,
      metricWeightField,
      imperialWeightField
    ],
    related: ["bmr-calculator", "tdee-calculator", "body-fat-calculator", "ideal-weight-calculator"],
    updatedAt: "2026-06-06",
    ...calculatorContent(
      "BMI Calculator",
      "Free BMI Calculator using metric and imperial units. Calculate your Body Mass Index instantly.",
      [
        {
          title: "What is BMI?",
          paragraphs: [
            "Body Mass Index estimates whether your body weight is proportionate to your height. It is a simple screening tool used in public health, clinical settings, and wellness programs.",
            "BMI does not directly measure body fat, but it remains useful for spotting broad patterns and comparing your current result with healthy-weight ranges."
          ]
        },
        {
          title: "BMI Formula",
          paragraphs: [
            "In metric units, BMI equals weight in kilograms divided by height in meters squared.",
            "In imperial units, BMI equals weight in pounds divided by height in inches squared, multiplied by 703."
          ]
        },
        {
          title: "BMI Categories",
          paragraphs: [
            "Adults are commonly grouped into underweight, healthy weight, overweight, and obesity classes. The category helps you see whether your result is near a healthier range."
          ],
          bullets: ["Underweight: under 18.5", "Healthy weight: 18.5 to 24.9", "Overweight: 25 to 29.9", "Obesity: 30 or higher"]
        },
        {
          title: "Healthy BMI Range",
          paragraphs: [
            "For most adults, a BMI between 18.5 and 24.9 is considered the healthy range. The best target still depends on age, muscle mass, ethnicity, and medical context.",
            "If your BMI is outside this range, use related tools like body fat, BMR, and TDEE to build a fuller picture."
          ]
        }
      ],
      [
        {
          question: "Is BMI accurate for athletes?",
          answer: "BMI can overestimate body fat in muscular people because it only uses height and weight. Athletes should also check body fat and waist measurements."
        },
        {
          question: "Can I use BMI during pregnancy?",
          answer: "BMI is mainly used before pregnancy or in early pregnancy for screening. During pregnancy, weight gain guidance is more helpful than tracking BMI changes."
        },
        {
          question: "What is a healthy BMI?",
          answer: "A BMI of 18.5 to 24.9 is considered healthy for most adults, though individual context still matters."
        }
      ]
    )
  },
  {
    slug: "bmr-calculator",
    title: "BMR Calculator",
    seoTitle: "BMR Calculator - Basal Metabolic Rate - HealthCalcHub",
    description: "Estimate your Basal Metabolic Rate to understand how many calories your body burns at rest.",
    intro: "BMR Calculator estimates the calories your body needs just to support essential functions like breathing, circulation, and temperature regulation.",
    cardBlurb: "Estimate daily calories burned at complete rest using the Mifflin-St Jeor formula.",
    category: "fitness",
    formula: "bmr",
    unitSystems: ["metric", "imperial"],
    fields: [ageField, sexField, metricHeightField, imperialHeightFeetField, imperialHeightInchesField, metricWeightField, imperialWeightField],
    related: ["tdee-calculator", "calorie-calculator", "macro-calculator", "protein-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is BMR?",
        paragraphs: [
          "Basal Metabolic Rate is the minimum energy your body needs to stay alive while fully at rest. It covers core functions such as breathing, heartbeat, and cell repair.",
          "BMR is not the same as maintenance calories because daily movement, exercise, digestion, and lifestyle all add more energy demand."
        ]
      },
      {
        title: "BMR Formula",
        paragraphs: [
          "This calculator uses the Mifflin-St Jeor equation, which is widely used for practical calorie planning.",
          "The formula includes sex, age, height, and weight to estimate resting calorie needs."
        ]
      },
      {
        title: "How to Use Your BMR",
        paragraphs: [
          "Use BMR as the starting point for estimating TDEE, cutting calories responsibly, or setting a minimum nutrition floor during a weight-loss phase.",
          "Most people should not eat below BMR for long periods without medical supervision."
        ]
      }
    ],
    faqs: [
      {
        question: "What is the difference between BMR and TDEE?",
        answer: "BMR is what your body burns at rest. TDEE adds activity, exercise, and daily movement on top of BMR."
      },
      {
        question: "Does BMR change over time?",
        answer: "Yes. BMR can shift with age, body weight, muscle mass, hormones, and long-term activity habits."
      }
    ]
  },
  {
    slug: "tdee-calculator",
    title: "TDEE Calculator",
    seoTitle: "TDEE Calculator - Total Daily Energy Expenditure - HealthCalcHub",
    description: "Calculate your Total Daily Energy Expenditure and estimate calories for maintenance, fat loss, or muscle gain.",
    intro: "TDEE Calculator turns your resting metabolism into an actionable daily calorie target by factoring in how active you are.",
    cardBlurb: "Estimate maintenance calories and adjust for cutting or bulking goals.",
    category: "fitness",
    formula: "tdee",
    unitSystems: ["metric", "imperial"],
    fields: [ageField, sexField, metricHeightField, imperialHeightFeetField, imperialHeightInchesField, metricWeightField, imperialWeightField, activityField, goalField],
    related: ["bmr-calculator", "calorie-calculator", "macro-calculator", "water-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is TDEE?",
        paragraphs: [
          "Total Daily Energy Expenditure is the total number of calories you burn in a full day. It includes your resting metabolism, physical activity, and the energy used to process food.",
          "TDEE is one of the most useful numbers for planning fat loss, weight maintenance, or lean muscle gain."
        ]
      },
      {
        title: "TDEE Formula",
        paragraphs: [
          "This page first calculates BMR with the Mifflin-St Jeor formula and then multiplies it by an activity factor.",
          "Choosing the right activity level matters. Overestimating your movement often leads to calorie targets that are too high."
        ]
      },
      {
        title: "Calories for Different Goals",
        paragraphs: [
          "A small calorie deficit can support steady fat loss, while a modest surplus can support muscle gain. Maintenance sits near your estimated TDEE.",
          "Use your real-world progress over two to four weeks to fine-tune the number."
        ]
      }
    ],
    faqs: [
      {
        question: "How accurate is TDEE?",
        answer: "TDEE is an estimate, not an exact number. It works best as a starting point that you adjust based on weight trends and energy levels."
      },
      {
        question: "Should I use sedentary or lightly active?",
        answer: "Pick the lower option if you mostly sit during the day and only train a few times per week. Many people overestimate their activity."
      }
    ]
  },
  {
    slug: "body-fat-calculator",
    title: "Body Fat Calculator",
    seoTitle: "Body Fat Calculator - Navy Formula - HealthCalcHub",
    description: "Estimate body fat percentage with waist, neck, and height measurements using a practical body fat formula.",
    intro: "Body Fat Calculator gives you a clearer body-composition estimate than BMI alone by using body measurements instead of weight only.",
    cardBlurb: "Estimate body fat percentage using the U.S. Navy method.",
    category: "fitness",
    formula: "body-fat",
    unitSystems: ["metric", "imperial"],
    fields: [
      sexField,
      metricHeightField,
      imperialHeightFeetField,
      imperialHeightInchesField,
      {
        name: "neckCm",
        label: "Neck",
        type: "number",
        suffix: "cm",
        step: "0.1",
        defaultValue: 38,
        unitSystems: ["metric"]
      },
      {
        name: "waistCm",
        label: "Waist",
        type: "number",
        suffix: "cm",
        step: "0.1",
        defaultValue: 82,
        unitSystems: ["metric"]
      },
      {
        name: "hipCm",
        label: "Hip",
        type: "number",
        suffix: "cm",
        step: "0.1",
        defaultValue: 96,
        unitSystems: ["metric"],
        showWhen: { field: "sex", equals: "female" }
      },
      {
        name: "neckIn",
        label: "Neck",
        type: "number",
        suffix: "in",
        step: "0.1",
        defaultValue: 15,
        unitSystems: ["imperial"]
      },
      {
        name: "waistIn",
        label: "Waist",
        type: "number",
        suffix: "in",
        step: "0.1",
        defaultValue: 32,
        unitSystems: ["imperial"]
      },
      {
        name: "hipIn",
        label: "Hip",
        type: "number",
        suffix: "in",
        step: "0.1",
        defaultValue: 38,
        unitSystems: ["imperial"],
        showWhen: { field: "sex", equals: "female" }
      }
    ],
    related: ["bmi-calculator", "lean-body-mass-calculator", "ideal-weight-calculator", "tdee-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is Body Fat Percentage?",
        paragraphs: [
          "Body fat percentage estimates how much of your total body weight comes from fat tissue. It helps you distinguish between body size and body composition.",
          "That makes it more helpful than BMI alone for muscular adults, active people, and body recomposition goals."
        ]
      },
      {
        title: "Body Fat Formula",
        paragraphs: [
          "This calculator uses the U.S. Navy circumference method. It estimates body fat from height, neck, waist, and for women, hip measurements.",
          "Results are useful for trend tracking, though small measurement errors can change the estimate."
        ]
      },
      {
        title: "Healthy Body Fat Range",
        paragraphs: [
          "Healthy ranges vary by sex, age, and athletic background. Use the result as context, not as a strict label."
        ],
        bullets: ["Men often land in a healthy range around 10% to 20%", "Women often land in a healthy range around 18% to 28%", "Performance athletes may sit lower than the general population"]
      }
    ],
    faqs: [
      {
        question: "Is body fat percentage better than BMI?",
        answer: "For body composition, it is usually more informative than BMI because it estimates fat mass rather than only using height and weight."
      },
      {
        question: "Where should I measure my waist?",
        answer: "Measure around your natural waist, typically near the narrowest point or just above the navel, depending on the method you follow."
      }
    ]
  },
  {
    slug: "lean-body-mass-calculator",
    title: "Lean Body Mass Calculator",
    seoTitle: "Lean Body Mass Calculator - HealthCalcHub",
    description: "Estimate your lean body mass from body fat percentage and body weight to support training and nutrition planning.",
    intro: "Lean Body Mass Calculator shows how much of your body weight is made up of muscle, bone, water, and organs rather than body fat.",
    cardBlurb: "Estimate fat-free mass to guide protein, training, and target-weight planning.",
    category: "fitness",
    formula: "lean-body-mass",
    unitSystems: ["metric", "imperial"],
    fields: [
      metricWeightField,
      imperialWeightField,
      {
        name: "bodyFatPercent",
        label: "Body Fat",
        type: "number",
        suffix: "%",
        step: "0.1",
        min: 3,
        max: 60,
        defaultValue: 22
      }
    ],
    related: ["body-fat-calculator", "protein-calculator", "macro-calculator", "ideal-weight-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is Lean Body Mass?",
        paragraphs: [
          "Lean body mass is your total body weight minus fat mass. It includes muscle, bone, water, connective tissue, and organs.",
          "Knowing your lean mass can make calorie and protein planning more individualized."
        ]
      },
      {
        title: "Lean Body Mass Formula",
        paragraphs: [
          "The formula is simple: lean body mass equals body weight multiplied by one minus body fat percentage expressed as a decimal."
        ]
      },
      {
        title: "How to Use Lean Body Mass",
        paragraphs: [
          "Lean body mass is often used to estimate protein needs, compare body-composition changes, or set realistic physique goals over time."
        ]
      }
    ],
    faqs: [
      {
        question: "Is lean body mass the same as muscle mass?",
        answer: "No. Lean body mass includes muscle, but it also includes water, bone, organs, and other non-fat tissue."
      }
    ]
  },
  {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    seoTitle: "Ideal Weight Calculator - Healthy Weight Range - HealthCalcHub",
    description: "Estimate an ideal body weight range using height and sex-based formulas for general health planning.",
    intro: "Ideal Weight Calculator provides a practical target range rather than one fixed number, making it more useful for long-term planning.",
    cardBlurb: "Estimate a healthy target weight range from your height.",
    category: "fitness",
    formula: "ideal-weight",
    unitSystems: ["metric", "imperial"],
    fields: [sexField, metricHeightField, imperialHeightFeetField, imperialHeightInchesField],
    related: ["bmi-calculator", "body-fat-calculator", "lean-body-mass-calculator", "water-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is Ideal Weight?",
        paragraphs: [
          "Ideal weight formulas estimate a reasonable body weight based on height and sex. They are best viewed as a range, not a rule.",
          "Your healthiest weight may vary depending on muscle mass, frame size, age, and medical history."
        ]
      },
      {
        title: "Ideal Weight Formula",
        paragraphs: [
          "This calculator uses the Devine formula as a practical benchmark. It is commonly used in clinical and fitness contexts."
        ]
      },
      {
        title: "Healthy Weight Range",
        paragraphs: [
          "Treat the result as a planning checkpoint. Combine it with BMI, body fat, and performance markers before deciding on a goal."
        ]
      }
    ],
    faqs: [
      {
        question: "Should I aim for one exact ideal weight?",
        answer: "Usually no. A healthy range is more realistic and more useful than a single exact target."
      }
    ]
  },
  {
    slug: "protein-calculator",
    title: "Protein Calculator",
    seoTitle: "Protein Calculator - Daily Protein Intake - HealthCalcHub",
    description: "Calculate daily protein intake based on body weight, activity, and fitness goal.",
    intro: "Protein Calculator helps you set a daily intake target that matches weight maintenance, fat loss, or muscle-building priorities.",
    cardBlurb: "Set a practical daily protein target for maintenance, cutting, or muscle gain.",
    category: "fitness",
    formula: "protein",
    unitSystems: ["metric", "imperial"],
    fields: [metricWeightField, imperialWeightField, activityField, goalField],
    related: ["macro-calculator", "calorie-calculator", "lean-body-mass-calculator", "body-fat-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "Why Protein Matters",
        paragraphs: [
          "Protein supports muscle repair, satiety, and long-term body composition. It becomes especially important during calorie deficits or resistance training."
        ]
      },
      {
        title: "How Protein Needs Are Calculated",
        paragraphs: [
          "This calculator uses body weight and goal-based multipliers. More active people and people in a fat-loss phase generally benefit from higher protein intake."
        ]
      },
      {
        title: "Best Times to Eat Protein",
        paragraphs: [
          "Daily total matters most, but distributing protein across three to five meals can support recovery, appetite control, and muscle protein synthesis."
        ]
      }
    ],
    faqs: [
      {
        question: "How much protein do I need to build muscle?",
        answer: "Many active adults do well around 1.6 to 2.2 grams of protein per kilogram of body weight per day."
      }
    ]
  },
  {
    slug: "macro-calculator",
    title: "Macro Calculator",
    seoTitle: "Macro Calculator - Macros for Fat Loss or Muscle Gain - HealthCalcHub",
    description: "Calculate protein, carbs, and fat targets based on calories, body size, and fitness goals.",
    intro: "Macro Calculator takes your calorie target and turns it into practical grams of protein, carbohydrates, and fat.",
    cardBlurb: "Split calories into protein, carbs, and fats for your goal.",
    category: "fitness",
    formula: "macro",
    unitSystems: ["metric", "imperial"],
    fields: [ageField, sexField, metricHeightField, imperialHeightFeetField, imperialHeightInchesField, metricWeightField, imperialWeightField, activityField, goalField],
    related: ["calorie-calculator", "protein-calculator", "carb-calculator", "fat-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What Are Macros?",
        paragraphs: [
          "Macros are the three main energy-providing nutrients: protein, carbohydrates, and fat. Tracking macros can make calorie goals easier to apply in real meals."
        ]
      },
      {
        title: "Macro Formula",
        paragraphs: [
          "This calculator first estimates calories and then allocates those calories into macro targets with a high-protein structure suitable for general fitness goals."
        ]
      },
      {
        title: "How to Adjust Macros",
        paragraphs: [
          "Carbs can be pushed higher for performance, while fat can be pushed slightly higher for preference and satiety. Protein usually stays relatively stable."
        ]
      }
    ],
    faqs: [
      {
        question: "Do macros matter more than calories?",
        answer: "Calories still drive weight change, but macros influence fullness, recovery, and body-composition outcomes."
      }
    ]
  },
  {
    slug: "water-intake-calculator",
    title: "Water Intake Calculator",
    seoTitle: "Water Intake Calculator - Daily Hydration Needs - HealthCalcHub",
    description: "Estimate how much water you should drink each day based on body weight and activity level.",
    intro: "Water Intake Calculator gives you a practical daily hydration target that you can scale for climate, exercise, and sweat loss.",
    cardBlurb: "Estimate a sensible daily hydration target from body weight and activity.",
    category: "fitness",
    formula: "water",
    unitSystems: ["metric", "imperial"],
    fields: [
      metricWeightField,
      imperialWeightField,
      {
        name: "exerciseMinutes",
        label: "Exercise",
        type: "number",
        suffix: "minutes/day",
        min: 0,
        max: 240,
        defaultValue: 45
      }
    ],
    related: ["calorie-calculator", "macro-calculator", "sleep-calculator", "tdee-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "How Much Water Should You Drink?",
        paragraphs: [
          "Hydration needs vary by body size, climate, and activity. A body-weight-based estimate gives you a practical baseline that is easy to follow."
        ]
      },
      {
        title: "Water Intake Formula",
        paragraphs: [
          "This calculator uses a simple ounces-per-pound or milliliters-per-kilogram approach, then adds extra fluid for exercise time."
        ]
      },
      {
        title: "Signs You May Need More Fluids",
        paragraphs: [
          "Dark urine, unusual fatigue, headaches, and poor workout performance can all signal that hydration needs are not being met."
        ]
      }
    ],
    faqs: [
      {
        question: "Does coffee count toward hydration?",
        answer: "For most adults, yes. Coffee and tea still contribute to total fluid intake, even though plain water is still a good default."
      }
    ]
  },
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    seoTitle: "Calorie Calculator - Daily Calories to Eat - HealthCalcHub",
    description: "Estimate how many calories you should eat per day for maintenance, fat loss, or weight gain.",
    intro: "Calorie Calculator is the practical bridge between metabolism math and real nutrition planning.",
    cardBlurb: "Estimate daily calories for maintenance, cutting, or bulking.",
    category: "nutrition",
    formula: "calorie",
    unitSystems: ["metric", "imperial"],
    fields: [ageField, sexField, metricHeightField, imperialHeightFeetField, imperialHeightInchesField, metricWeightField, imperialWeightField, activityField, goalField],
    related: ["tdee-calculator", "macro-calculator", "meal-calorie-calculator", "protein-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "How Many Calories Should I Eat?",
        paragraphs: [
          "Your ideal calorie intake depends on body size, age, sex, and activity level. The right number also changes depending on whether you want to maintain, lose, or gain weight."
        ]
      },
      {
        title: "Calorie Formula",
        paragraphs: [
          "This calculator estimates BMR, multiplies by activity to get TDEE, and then adjusts calories based on your chosen goal."
        ]
      },
      {
        title: "How to Use a Calorie Target",
        paragraphs: [
          "Track your average intake and body-weight trend for two or more weeks. If progress is too slow or too fast, adjust the target by a small amount."
        ]
      }
    ],
    faqs: [
      {
        question: "How many calories should I cut to lose weight?",
        answer: "A moderate deficit of roughly 300 to 500 calories below maintenance works well for many adults."
      }
    ]
  },
  {
    slug: "meal-calorie-calculator",
    title: "Meal Calorie Calculator",
    seoTitle: "Meal Calorie Calculator - Per Meal Calories - HealthCalcHub",
    description: "Split your daily calories into breakfast, lunch, dinner, and snacks for easier meal planning.",
    intro: "Meal Calorie Calculator helps you turn a daily target into a simple meal-by-meal eating plan.",
    cardBlurb: "Divide daily calories into meals and snacks.",
    category: "nutrition",
    formula: "meal-calorie",
    fields: [
      {
        name: "dailyCalories",
        label: "Daily Calories",
        type: "number",
        suffix: "kcal",
        min: 1000,
        max: 5000,
        defaultValue: 2200
      },
      {
        name: "meals",
        label: "Meals Per Day",
        type: "select",
        options: [
          { label: "3 meals", value: "3" },
          { label: "4 meals", value: "4" },
          { label: "5 meals", value: "5" }
        ],
        defaultValue: "4"
      }
    ],
    related: ["calorie-calculator", "macro-calculator", "protein-calculator", "fiber-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "Why Meal Planning Helps",
        paragraphs: [
          "Many people know their daily calorie target but still struggle to structure meals. Breaking calories into meals can reduce guesswork and improve consistency."
        ]
      },
      {
        title: "Meal Calorie Formula",
        paragraphs: [
          "This calculator divides your chosen calorie target across the number of meals you plan to eat, while leaving a little room for day-to-day flexibility."
        ]
      },
      {
        title: "Best Way to Use Meal Calories",
        paragraphs: [
          "Keep larger meals around your busiest or hungriest parts of the day. Consistency matters more than perfect equal splits."
        ]
      }
    ],
    faqs: [
      {
        question: "Do all meals need the same calories?",
        answer: "No. Even splits are convenient, but many people prefer a larger lunch or dinner and a smaller breakfast or snack."
      }
    ]
  },
  {
    slug: "carb-calculator",
    title: "Carb Calculator",
    seoTitle: "Carb Calculator - Daily Carbohydrate Intake - HealthCalcHub",
    description: "Estimate daily carbohydrate intake from calories and activity level for performance or fat loss.",
    intro: "Carb Calculator helps you decide how much room carbohydrates should take in your daily plan.",
    cardBlurb: "Estimate carb grams from calories and training demands.",
    category: "nutrition",
    formula: "carb",
    fields: [
      {
        name: "dailyCalories",
        label: "Daily Calories",
        type: "number",
        suffix: "kcal",
        min: 1000,
        max: 5000,
        defaultValue: 2200
      },
      activityField,
      goalField
    ],
    related: ["macro-calculator", "calorie-calculator", "fat-intake-calculator", "fiber-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What Do Carbs Do?",
        paragraphs: [
          "Carbohydrates provide a fast and efficient energy source, especially for strength training, endurance work, and higher-intensity activity."
        ]
      },
      {
        title: "Carb Formula",
        paragraphs: [
          "This calculator assigns a share of daily calories to carbohydrates based on your activity level and goal, then converts that to grams."
        ]
      },
      {
        title: "When to Adjust Carbs",
        paragraphs: [
          "People training hard often benefit from more carbs, while lower-activity fat-loss phases may feel easier with slightly fewer."
        ]
      }
    ],
    faqs: [
      {
        question: "Are carbs bad for weight loss?",
        answer: "No. Weight loss depends on total calories. Carbs can still fit well into a fat-loss plan."
      }
    ]
  },
  {
    slug: "fat-intake-calculator",
    title: "Fat Intake Calculator",
    seoTitle: "Fat Intake Calculator - Daily Fat Grams - HealthCalcHub",
    description: "Calculate a healthy daily fat intake based on calories and body size.",
    intro: "Fat Intake Calculator estimates a healthy fat target that supports hormones, satiety, and overall diet quality.",
    cardBlurb: "Find a healthy daily fat target from calories and body weight.",
    category: "nutrition",
    formula: "fat-intake",
    unitSystems: ["metric", "imperial"],
    fields: [
      {
        name: "dailyCalories",
        label: "Daily Calories",
        type: "number",
        suffix: "kcal",
        min: 1000,
        max: 5000,
        defaultValue: 2200
      },
      metricWeightField,
      imperialWeightField
    ],
    related: ["macro-calculator", "carb-calculator", "fiber-intake-calculator", "protein-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "Why Dietary Fat Matters",
        paragraphs: [
          "Fat supports hormone production, nutrient absorption, brain function, and meal satisfaction. Eating too little fat can make a diet harder to sustain."
        ]
      },
      {
        title: "Fat Intake Formula",
        paragraphs: [
          "This calculator checks both calorie percentage and body-weight minimums so the fat target stays practical and balanced."
        ]
      },
      {
        title: "Healthy Fat Sources",
        paragraphs: [
          "Focus on unsaturated fats from foods like olive oil, nuts, seeds, avocados, and fatty fish, while keeping overall calories in view."
        ]
      }
    ],
    faqs: [
      {
        question: "How many grams of fat should I eat daily?",
        answer: "Many balanced diets land around 20% to 35% of total calories from fat, with enough grams to support health and satiety."
      }
    ]
  },
  {
    slug: "fiber-intake-calculator",
    title: "Fiber Intake Calculator",
    seoTitle: "Fiber Intake Calculator - Daily Fiber Needs - HealthCalcHub",
    description: "Estimate your recommended daily fiber intake from calorie intake and sex.",
    intro: "Fiber Intake Calculator gives you a simple benchmark for digestion, fullness, and long-term health support.",
    cardBlurb: "Estimate a smart daily fiber target for better digestion and satiety.",
    category: "nutrition",
    formula: "fiber",
    fields: [
      sexField,
      {
        name: "dailyCalories",
        label: "Daily Calories",
        type: "number",
        suffix: "kcal",
        min: 1000,
        max: 5000,
        defaultValue: 2200
      }
    ],
    related: ["meal-calorie-calculator", "macro-calculator", "water-intake-calculator", "calorie-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "Why Fiber Matters",
        paragraphs: [
          "Fiber supports digestion, helps regulate appetite, and can improve overall dietary quality. Many adults still eat less fiber than recommended."
        ]
      },
      {
        title: "Fiber Formula",
        paragraphs: [
          "A practical rule is about 14 grams of fiber for every 1,000 calories consumed, with slight adjustments for sex-based recommendations."
        ]
      },
      {
        title: "How to Increase Fiber Safely",
        paragraphs: [
          "Increase fiber gradually and pair it with enough fluids to avoid digestive discomfort."
        ]
      }
    ],
    faqs: [
      {
        question: "What foods are high in fiber?",
        answer: "Beans, lentils, oats, berries, whole grains, vegetables, seeds, and nuts are all strong fiber sources."
      }
    ]
  },
  {
    slug: "due-date-calculator",
    title: "Due Date Calculator",
    seoTitle: "Due Date Calculator - Pregnancy Due Date Estimator - HealthCalcHub",
    description: "Estimate your pregnancy due date from the first day of your last menstrual period or conception date.",
    intro: "Due Date Calculator gives an estimated due date and a quick pregnancy timeline you can use for planning and education.",
    cardBlurb: "Estimate your baby's due date from LMP or conception date.",
    category: "pregnancy",
    formula: "due-date",
    fields: [
      {
        name: "method",
        label: "Calculation Method",
        type: "select",
        options: [
          { label: "Last menstrual period", value: "lmp" },
          { label: "Conception date", value: "conception" }
        ],
        defaultValue: "lmp"
      },
      {
        name: "lmpDate",
        label: "First Day of Last Period",
        type: "date",
        showWhen: { field: "method", equals: "lmp" }
      },
      {
        name: "conceptionDate",
        label: "Conception Date",
        type: "date",
        showWhen: { field: "method", equals: "conception" }
      }
    ],
    related: ["ovulation-calculator", "pregnancy-weight-gain-calculator", "sleep-calculator", "water-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "How Due Dates Are Estimated",
        paragraphs: [
          "A typical pregnancy is estimated as 40 weeks from the first day of the last menstrual period. This is why due dates are best viewed as approximations, not promises."
        ]
      },
      {
        title: "Due Date Formula",
        paragraphs: [
          "If you choose last menstrual period, the calculator adds 280 days. If you choose conception date, it adds 266 days."
        ]
      },
      {
        title: "What to Expect Next",
        paragraphs: [
          "Use the estimated due date as a planning guide, then confirm with a prenatal care provider for more precise dating."
        ]
      }
    ],
    faqs: [
      {
        question: "How accurate is a due date calculator?",
        answer: "It is a helpful estimate, but actual delivery dates vary widely. Ultrasound dating and clinical guidance are more precise."
      }
    ]
  },
  {
    slug: "ovulation-calculator",
    title: "Ovulation Calculator",
    seoTitle: "Ovulation Calculator - Fertile Window Estimator - HealthCalcHub",
    description: "Estimate your fertile window and likely ovulation day based on your cycle length.",
    intro: "Ovulation Calculator helps you estimate the most fertile part of your cycle using your period start date and average cycle length.",
    cardBlurb: "Estimate fertile days and likely ovulation timing.",
    category: "pregnancy",
    formula: "ovulation",
    fields: [
      {
        name: "cycleStart",
        label: "Last Period Start Date",
        type: "date"
      },
      {
        name: "cycleLength",
        label: "Average Cycle Length",
        type: "number",
        suffix: "days",
        min: 21,
        max: 40,
        defaultValue: 28
      }
    ],
    related: ["due-date-calculator", "pregnancy-weight-gain-calculator", "sleep-calculator", "water-intake-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What is Ovulation?",
        paragraphs: [
          "Ovulation is the point in the menstrual cycle when an ovary releases an egg. It usually happens about 14 days before the next period, though timing varies."
        ]
      },
      {
        title: "Ovulation Formula",
        paragraphs: [
          "This calculator estimates ovulation by subtracting 14 days from your expected next period date, then builds a fertile window around that day."
        ]
      },
      {
        title: "Understanding the Fertile Window",
        paragraphs: [
          "The fertile window generally includes the five days before ovulation and the ovulation day itself."
        ]
      }
    ],
    faqs: [
      {
        question: "Can ovulation happen earlier or later than predicted?",
        answer: "Yes. Stress, travel, illness, and natural cycle variation can all shift ovulation timing."
      }
    ]
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    title: "Pregnancy Weight Gain Calculator",
    seoTitle: "Pregnancy Weight Gain Calculator - Healthy Range - HealthCalcHub",
    description: "Estimate a healthy pregnancy weight gain range based on pre-pregnancy BMI and current trimester.",
    intro: "Pregnancy Weight Gain Calculator offers a general planning range based on pre-pregnancy BMI categories.",
    cardBlurb: "Estimate healthy pregnancy weight gain guidance from pre-pregnancy BMI.",
    category: "pregnancy",
    formula: "pregnancy-weight-gain",
    unitSystems: ["metric", "imperial"],
    fields: [
      metricHeightField,
      imperialHeightFeetField,
      imperialHeightInchesField,
      metricWeightField,
      imperialWeightField,
      {
        name: "weeksPregnant",
        label: "Weeks Pregnant",
        type: "number",
        suffix: "weeks",
        min: 1,
        max: 40,
        defaultValue: 20
      }
    ],
    related: ["due-date-calculator", "ovulation-calculator", "water-intake-calculator", "bmi-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "Why Pregnancy Weight Gain Matters",
        paragraphs: [
          "Steady, appropriate weight gain helps support fetal growth and maternal health. Recommended ranges vary by pre-pregnancy BMI."
        ]
      },
      {
        title: "How Weight Gain Is Estimated",
        paragraphs: [
          "This calculator first estimates your pre-pregnancy BMI and then compares it with common pregnancy weight-gain ranges."
        ]
      },
      {
        title: "When to Talk With a Clinician",
        paragraphs: [
          "If your gain is much higher or lower than expected, or if you have twins or a high-risk pregnancy, clinical guidance is especially important."
        ]
      }
    ],
    faqs: [
      {
        question: "Is the same weight gain target used for all pregnancies?",
        answer: "No. The recommended range depends on pre-pregnancy BMI and pregnancy context."
      }
    ]
  },
  {
    slug: "blood-pressure-calculator",
    title: "Blood Pressure Calculator",
    seoTitle: "Blood Pressure Calculator - Blood Pressure Category - HealthCalcHub",
    description: "Enter systolic and diastolic values to classify your blood pressure reading into standard categories.",
    intro: "Blood Pressure Calculator classifies a reading so you can quickly understand whether it falls into a normal, elevated, or high range.",
    cardBlurb: "Classify systolic and diastolic readings into standard blood pressure categories.",
    category: "health",
    formula: "blood-pressure",
    fields: [
      {
        name: "systolic",
        label: "Systolic",
        type: "number",
        suffix: "mmHg",
        min: 70,
        max: 250,
        defaultValue: 118
      },
      {
        name: "diastolic",
        label: "Diastolic",
        type: "number",
        suffix: "mmHg",
        min: 40,
        max: 150,
        defaultValue: 76
      }
    ],
    related: ["heart-rate-zone-calculator", "sleep-calculator", "water-intake-calculator", "bmi-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What Do Blood Pressure Numbers Mean?",
        paragraphs: [
          "Systolic pressure reflects the force when the heart beats, while diastolic pressure reflects pressure between beats."
        ]
      },
      {
        title: "Blood Pressure Categories",
        paragraphs: [
          "This calculator uses common adult blood-pressure categories to interpret your reading."
        ],
        bullets: ["Normal: less than 120 and less than 80", "Elevated: 120 to 129 and less than 80", "High blood pressure stage 1: 130 to 139 or 80 to 89", "High blood pressure stage 2: 140 or higher or 90 or higher"]
      },
      {
        title: "When to Seek Medical Advice",
        paragraphs: [
          "Persistent high readings or concerning symptoms deserve prompt clinical follow-up. This calculator is educational and not diagnostic."
        ]
      }
    ],
    faqs: [
      {
        question: "Can one blood pressure reading diagnose hypertension?",
        answer: "No. Diagnosis usually requires repeated readings and clinical evaluation."
      }
    ]
  },
  {
    slug: "heart-rate-zone-calculator",
    title: "Heart Rate Zone Calculator",
    seoTitle: "Heart Rate Zone Calculator - Training Zones - HealthCalcHub",
    description: "Estimate training heart rate zones from your age and resting heart rate.",
    intro: "Heart Rate Zone Calculator helps you train with purpose by estimating zone ranges for easy sessions, aerobic work, and higher-intensity efforts.",
    cardBlurb: "Estimate target training zones from age and resting pulse.",
    category: "health",
    formula: "heart-rate-zone",
    fields: [
      ageField,
      {
        name: "restingHeartRate",
        label: "Resting Heart Rate",
        type: "number",
        suffix: "bpm",
        min: 35,
        max: 120,
        defaultValue: 62
      }
    ],
    related: ["blood-pressure-calculator", "tdee-calculator", "water-intake-calculator", "sleep-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What Are Heart Rate Zones?",
        paragraphs: [
          "Heart rate zones divide exercise intensity into practical bands. They help structure endurance work, recovery sessions, and performance training."
        ]
      },
      {
        title: "Heart Rate Zone Formula",
        paragraphs: [
          "This calculator estimates maximum heart rate from age and applies the Karvonen method, which also uses resting heart rate."
        ]
      },
      {
        title: "How to Use Training Zones",
        paragraphs: [
          "Lower zones support recovery and basic aerobic work, while higher zones are better for interval sessions and speed development."
        ]
      }
    ],
    faqs: [
      {
        question: "What is zone 2 training?",
        answer: "Zone 2 is a moderate aerobic intensity that supports endurance development and is often sustainable for longer sessions."
      }
    ]
  },
  {
    slug: "bac-calculator",
    title: "BAC Calculator",
    seoTitle: "BAC Calculator - Blood Alcohol Concentration Estimate - HealthCalcHub",
    description: "Estimate blood alcohol concentration from body weight, sex, drinks consumed, and drinking time.",
    intro: "BAC Calculator estimates blood alcohol concentration so you can better understand how alcohol intake may affect your body.",
    cardBlurb: "Estimate blood alcohol concentration from drinks, body weight, and time.",
    category: "health",
    formula: "bac",
    unitSystems: ["metric", "imperial"],
    fields: [
      sexField,
      metricWeightField,
      imperialWeightField,
      {
        name: "drinks",
        label: "Standard Drinks",
        type: "number",
        step: "0.5",
        min: 0,
        max: 20,
        defaultValue: 3
      },
      {
        name: "hours",
        label: "Hours Drinking",
        type: "number",
        step: "0.5",
        min: 0.5,
        max: 24,
        defaultValue: 2
      }
    ],
    related: ["water-intake-calculator", "sleep-calculator", "bmi-calculator", "heart-rate-zone-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "What Is BAC?",
        paragraphs: [
          "Blood Alcohol Concentration estimates the amount of alcohol in the bloodstream. It can help illustrate how body size, sex, drinks, and time interact."
        ]
      },
      {
        title: "BAC Formula",
        paragraphs: [
          "This calculator uses a Widmark-style estimate and subtracts average alcohol elimination over time."
        ]
      },
      {
        title: "Important Safety Note",
        paragraphs: [
          "BAC estimates are approximate and can never guarantee fitness to drive or work safely. When in doubt, do not drive."
        ]
      }
    ],
    faqs: [
      {
        question: "Is this BAC calculator exact?",
        answer: "No. Food, metabolism, drink size, and timing can all change actual BAC."
      }
    ]
  },
  {
    slug: "sleep-calculator",
    title: "Sleep Calculator",
    seoTitle: "Sleep Calculator - Bedtime and Wake Time - HealthCalcHub",
    description: "Calculate ideal bedtime or wake time based on 90-minute sleep cycles.",
    intro: "Sleep Calculator helps you choose a bedtime or wake-up time that aligns more closely with common sleep-cycle timing.",
    cardBlurb: "Estimate bedtime or wake-up times around 90-minute sleep cycles.",
    category: "health",
    formula: "sleep",
    fields: [
      {
        name: "mode",
        label: "Calculate",
        type: "select",
        options: [
          { label: "Bedtime from wake time", value: "bedtime" },
          { label: "Wake time from bedtime", value: "wake" }
        ],
        defaultValue: "bedtime"
      },
      {
        name: "wakeTime",
        label: "Wake Time",
        type: "time",
        defaultValue: "07:00",
        showWhen: { field: "mode", equals: "bedtime" }
      },
      {
        name: "bedTime",
        label: "Bedtime",
        type: "time",
        defaultValue: "22:30",
        showWhen: { field: "mode", equals: "wake" }
      }
    ],
    related: ["heart-rate-zone-calculator", "blood-pressure-calculator", "water-intake-calculator", "bac-calculator"],
    updatedAt: "2026-06-06",
    sections: [
      {
        title: "How Sleep Cycles Work",
        paragraphs: [
          "Many adults move through sleep in cycles of roughly 90 minutes. Waking between cycles can feel easier than waking in the middle of one."
        ]
      },
      {
        title: "Sleep Calculator Formula",
        paragraphs: [
          "This calculator adds or subtracts six common 90-minute cycles and includes a short buffer for falling asleep."
        ]
      },
      {
        title: "Better Sleep Habits",
        paragraphs: [
          "A consistent schedule, wind-down routine, and morning light exposure often matter more than exact cycle timing."
        ]
      }
    ],
    faqs: [
      {
        question: "Are sleep cycles exactly 90 minutes?",
        answer: "Not exactly. Ninety minutes is a useful average, but individual cycles vary."
      }
    ]
  }
];

export const calculatorMap = new Map(calculators.map((calculator) => [calculator.slug, calculator]));

export const categoryLabels: Record<CategoryKey, string> = {
  fitness: "Fitness",
  nutrition: "Nutrition",
  pregnancy: "Pregnancy",
  health: "Health"
};
