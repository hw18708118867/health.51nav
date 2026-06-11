import { categoryLabels } from "../data/calculators";

type CalculatorLink = {
  slug: string;
  title: string;
};

type BlogMeta = {
  title: string;
  category: "fitness" | "nutrition" | "pregnancy" | "health";
  tags: string[];
  relatedCalculators: string[];
};

type ExtensionSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type ArticleExtension = {
  intro: string;
  sections: ExtensionSection[];
  closing: string;
};

const normalizeWords = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export const estimateArticleWords = (body: string) => {
  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[>#*_~-]/g, " ");

  return (plain.match(/\b[\p{L}\p{N}']+\b/gu) || []).length;
};

const packByKeyword = {
  bmi: "bmi",
  "body-fat": "body-composition",
  "ideal-weight": "body-composition",
  "lean-body-mass": "body-composition",
  bmr: "energy",
  tdee: "energy",
  calorie: "energy",
  macro: "macro",
  protein: "macro",
  carb: "macro",
  fat: "macro",
  fiber: "macro",
  water: "hydration",
  hydration: "hydration",
  ovulation: "fertility",
  fertile: "fertility",
  "due-date": "pregnancy-timing",
  pregnancy: "pregnancy-weight",
  trimester: "pregnancy-weight",
  "weight-gain": "pregnancy-weight",
  "blood-pressure": "blood-pressure",
  pressure: "blood-pressure",
  "heart-rate": "heart-rate",
  cardio: "heart-rate",
  bac: "bac",
  alcohol: "bac",
  sleep: "sleep"
} as const;

const findPackKey = (meta: BlogMeta) => {
  const searchSpace = normalizeWords(
    [meta.title, ...meta.tags, ...meta.relatedCalculators]
      .join(" ")
      .replaceAll("/", " ")
      .replaceAll("_", " ")
  );

  for (const token of searchSpace) {
    if (token in packByKeyword) {
      return packByKeyword[token as keyof typeof packByKeyword];
    }
  }

  if (meta.category === "pregnancy") return "pregnancy-weight";
  if (meta.category === "nutrition") return "macro";
  if (meta.category === "fitness") return "energy";
  return "sleep";
};

const buildRelatedToolLine = (related: CalculatorLink[]) => {
  if (related.length === 0) return "If you want a more personal answer, pair what you just read with one of the related calculators on this site.";

  const labels = related.slice(0, 3).map((item) => item.title);
  return `If you want to turn the idea into a personal estimate, the best next step is usually ${labels.join(", ")}.`;
};

const extensionPacks: Record<string, Omit<ArticleExtension, "closing" | "intro"> & { intros: string[]; closings: string[] }> = {
  bmi: {
    intros: [
      "BMI is useful when you treat it like a quick screening tool instead of a final label. A short article can explain the formula, but most readers still need practical context before the number feels useful in real life.",
      "The reason BMI stays popular is simple: it is fast. The reason people mistrust it is also simple: one number rarely tells the whole story. The helpful middle ground is to use BMI for orientation, then add a little context before making decisions."
    ],
    sections: [
      {
        title: "How to read a BMI result without overreacting",
        paragraphs: [
          "A BMI result is better treated like a signpost than a diagnosis. If the number lands in the healthy range, that can be reassuring, but it still does not tell you how active you are, how much muscle you carry, or what your eating pattern looks like. If it lands above or below the common range, it is a cue to look a little deeper rather than jump straight into extremes.",
          "People often feel frustrated when BMI seems too simple, and that frustration is understandable. The better question is not whether BMI is perfect. It is whether BMI gives you a quick first read on body size relative to height. For many adults, it does. What matters next is what you do with the number."
        ],
        bullets: [
          "Use BMI as a first look, not a full health verdict.",
          "Pay more attention when your result is close to a category cutoff.",
          "Look for patterns over time rather than attaching too much meaning to one entry."
        ]
      },
      {
        title: "What can change the meaning of the number",
        paragraphs: [
          "Muscle mass, age, ethnicity, fluid shifts, and life stage all affect how useful BMI feels. A muscular person can land in the overweight range while having a low body-fat level. An older adult may have a BMI in a common range while carrying less muscle than expected. That is why BMI is strongest when it starts the conversation instead of ending it.",
          "It also helps to remember that a change in BMI often reflects a change in routine, not just a change in body size. Sleep, stress, training volume, and food intake all shape the direction the number moves. A more useful mindset is to ask what the trend is telling you about your habits."
        ]
      },
      {
        title: "A practical next step after checking BMI",
        paragraphs: [
          "Once you have the BMI result, the next move is usually to pair it with another useful measure. If you are focused on body composition, look at body fat. If you are trying to lose, gain, or maintain weight, check calories, protein, or TDEE. If you want a broad health picture, consider blood pressure, sleep, and everyday activity as part of the same conversation.",
          "This is also where mindset matters. A BMI result should help you make calmer choices, not harsher ones. Small changes that you can repeat for months will do far more for your health than a dramatic response to one screening number."
        ]
      },
      {
        title: "Common mistakes people make with BMI",
        paragraphs: [
          "The most common mistake is assuming BMI should match how you feel about your body. It is not a self-image score, and it is not designed to capture confidence, fitness, or effort. Another common mistake is using bad inputs, especially mixing pounds with kilograms or rounding height too aggressively.",
          "A third mistake is using BMI in isolation. People often search for BMI because they want certainty, but health decisions usually improve when you compare several signals. One number can start the story. It usually cannot finish it."
        ],
        bullets: [
          "Do not mix metric and imperial units.",
          "Do not assume BMI measures body fat directly.",
          "Do not let one result replace the bigger picture of your habits and health."
        ]
      },
      {
        title: "When a fuller conversation makes sense",
        paragraphs: [
          "If your BMI is far outside the common adult range, or if your weight has changed quickly without a clear reason, it can be worth talking with a clinician or registered dietitian. The same is true if the number does not line up with how you feel physically, how you perform, or what other measures suggest.",
          "For most people, the goal is not to chase a perfect number. It is to build a body and routine that feel steady, capable, and sustainable. BMI can be part of that process, but it works best when it stays in proportion to the rest of your health picture."
        ]
      }
    ],
    closings: [
      "Use the number as a starting point, compare it with your daily habits, and then move to the next tool that answers the question you actually have.",
      "A good BMI check should leave you with a clearer next step, not more noise. Read the number, add context, and keep moving."
    ]
  },
  "body-composition": {
    intros: [
      "Body-composition topics usually attract people who want a more personal answer than weight alone can give. That is sensible, because lean mass, body-fat level, and goal weight all add context that scale weight cannot provide by itself.",
      "When people read about body-fat percentage, lean mass, or ideal weight, they are usually trying to answer a practical question: what number matters most for the goal I have right now? The helpful answer is almost always: compare a few related measures instead of treating one estimate like the whole story."
    ],
    sections: [
      {
        title: "What these numbers are good for",
        paragraphs: [
          "Body-composition estimates are most useful for planning. They help you set calorie targets, estimate protein needs, compare weight goals, and decide whether progress is coming from fat loss, muscle gain, or a mix of both. That makes them useful even when the exact number is not perfect.",
          "The real value is not precision down to the decimal. The real value is direction. If your estimate moves the right way over time, and the change fits what you are doing in training and nutrition, the tool is helping."
        ]
      },
      {
        title: "Why the estimate can shift",
        paragraphs: [
          "Hydration status, recent meals, training fatigue, menstrual cycle changes, and measurement technique can all affect body-composition estimates. Skinfolds, waist measurements, and formula-based calculators all have tradeoffs. That is why consistency matters more than chasing the most flattering method.",
          "You will often get the most value by repeating the same method under similar conditions. A good trend beats a one-time perfect-looking number."
        ],
        bullets: [
          "Measure under similar conditions each time.",
          "Compare trends over weeks, not day to day.",
          "Use performance and recovery as context, not just appearance goals."
        ]
      },
      {
        title: "How to use the result in a practical way",
        paragraphs: [
          "If the result suggests you are carrying more body fat than expected, the next step may be a modest calorie deficit and better protein consistency. If lean mass looks lower than you expected, strength training and protein intake may deserve more attention. If ideal weight feels confusing, it may help to focus less on a target scale number and more on a range that supports your energy, movement, and routine.",
          "This is where calculators become useful as a set. Body-composition tools often work best alongside BMI, calorie, macro, and protein calculators rather than on their own."
        ]
      },
      {
        title: "What not to do with body-composition tools",
        paragraphs: [
          "The biggest trap is treating every estimate like a judgment. These tools are rough guides, and they are supposed to simplify decisions, not create more stress. Another trap is changing your plan every time the number moves a little. Water balance alone can create noise that looks meaningful when it is not.",
          "A calmer approach is to use these numbers to support steady habits: enough protein, enough movement, enough sleep, and a realistic calorie target."
        ]
      },
      {
        title: "When it helps to step back",
        paragraphs: [
          "If body-composition numbers are making you more reactive than informed, it may be worth returning to the basics for a while. Consistent meals, training you can recover from, and a routine you can maintain will usually matter more than squeezing meaning out of tiny estimate changes.",
          "The best tool is the one that helps you make a steady decision today and a better decision next month. If a number does not help with that, it may not deserve as much attention as you are giving it."
        ]
      }
    ],
    closings: [
      "Use body-composition numbers to guide your plan, not to grade yourself. The most useful result is the one that helps you eat, train, and recover with a little more confidence.",
      "A body-composition estimate is most helpful when it leads to one calm adjustment, not ten reactive ones."
    ]
  },
  energy: {
    intros: [
      "Energy and calorie topics usually sound simple at first, but people often need more context than a single calorie number can provide. Maintenance, deficit, surplus, metabolism, and activity all influence how useful a calculator result feels in daily life.",
      "Most people do not need a perfect calorie estimate. They need a reasonable starting point they can actually use for a week or two. That is where these tools help most."
    ],
    sections: [
      {
        title: "How to use calorie estimates in real life",
        paragraphs: [
          "A calculator result is best treated as a starting range, not a promise. If your result says you maintain around a certain intake, the next step is to test that range against real life: appetite, workouts, scale trend, measurements, and energy levels. A result becomes useful when you match it against what your week actually looks like.",
          "This matters because calorie burn changes with movement, stress, sleep, training load, and body size. Two people can use the same formula and still need different adjustments after a week of tracking."
        ]
      },
      {
        title: "Why metabolism talk gets confusing",
        paragraphs: [
          "Many people search for BMR, TDEE, or maintenance calories because they want one fixed number. The problem is that real energy use moves. Your resting needs may be fairly stable, but daily totals change with steps, lifting, cardio, fidgeting, work demands, and how much food you are digesting.",
          "That does not mean calculators are wrong. It means they are tools for estimating a moving target. A useful estimate plus a little observation is often better than waiting for certainty."
        ],
        bullets: [
          "BMR is your baseline at rest.",
          "TDEE adds movement, exercise, and daily activity.",
          "Weekly trends matter more than one perfect-looking day."
        ]
      },
      {
        title: "What to adjust first",
        paragraphs: [
          "If progress is slower than expected, the first step is usually to check consistency before changing the target. Are you logging accurately? Are weekends very different from weekdays? Has activity dropped? Are you recovering well enough to move normally? These questions often explain the gap before the formula does.",
          "When you do adjust, small changes usually work best. Moving calories up or down by a modest amount gives you cleaner feedback and keeps the plan more sustainable."
        ]
      },
      {
        title: "The role of food quality and protein",
        paragraphs: [
          "Calories matter, but the source of those calories changes how easy the plan feels. Protein helps with fullness and muscle retention. Fiber and whole foods often make it easier to stay consistent. A macro plan can make a calorie target easier to follow because it gives the day more shape.",
          "That is why people often move from a calorie calculator into macro or protein tools. The calorie number tells you how much. The follow-up tools help answer how to build meals around that target."
        ]
      },
      {
        title: "When to look beyond the estimate",
        paragraphs: [
          "If your calorie result feels far off from your lived experience, it may be worth stepping back and looking at the full picture. Training changes, sleep disruption, dieting history, medication, and hormonal shifts can all influence appetite, recovery, and energy use. The calculator is still useful, but it may need more real-world interpretation.",
          "A good calorie plan is not the one that looks smartest on paper. It is the one you can follow long enough to learn from."
        ]
      }
    ],
    closings: [
      "A calorie estimate becomes valuable when you pair it with observation, not when you expect it to predict everything perfectly.",
      "Use the number, test it in your normal week, and then make the smallest change that moves you closer to your goal."
    ]
  },
  macro: {
    intros: [
      "Nutrition topics tend to sound technical, but the real question is usually simple: what should I eat more of, less of, or more consistently? Macro, protein, carb, fat, fiber, and hydration tools help answer that question in a way that is easier to use than generic advice.",
      "A useful nutrition target does not need to be complicated. It just needs to be clear enough that you can apply it at breakfast, lunch, dinner, and the moments in between."
    ],
    sections: [
      {
        title: "How to turn the target into meals",
        paragraphs: [
          "Most people get more value from a nutrition target when they translate it into a repeatable meal pattern. A protein goal can become a target per meal. A macro split can become a simple plate structure. A fiber goal can become a check that each day includes beans, fruit, vegetables, oats, or other high-fiber foods.",
          "This matters because numbers alone do not make meals easier. Patterns do. Once the target becomes a familiar structure, it stops feeling like math and starts feeling like a routine."
        ]
      },
      {
        title: "What usually gets in the way",
        paragraphs: [
          "The biggest barrier is often inconsistency, not lack of information. Eating enough protein on weekdays but not weekends, forgetting fiber when meals are rushed, or underestimating liquid calories can all make a reasonable target feel ineffective. In many cases the plan is fine, but the pattern is too uneven to judge yet.",
          "Hydration can also blur the picture. Low fluid intake affects appetite, energy, training feel, and even digestion. That is one reason water tools pair naturally with macro and meal planning tools."
        ],
        bullets: [
          "Check the pattern before changing the target.",
          "Build meals around foods you will actually keep buying.",
          "Use the result to simplify choices, not to micromanage every bite."
        ]
      },
      {
        title: "A better way to use macro-style tools",
        paragraphs: [
          "The best use of a macro or protein result is to create a repeatable baseline. That might mean setting a protein floor, aiming for a fiber minimum, or deciding how to split calories across meals. You do not need a flawless ratio to make progress. You need a plan that reduces guesswork.",
          "For people who are active, nutrition tools are especially useful when paired with energy tools. Calories tell you the size of the plan. Macros help shape the quality and feel of the plan."
        ]
      },
      {
        title: "When a food target needs context",
        paragraphs: [
          "Targets may need to change if you are pregnant, training hard, eating for performance, dealing with appetite swings, or managing a medical condition. The calculator gives a sensible starting point, but context still matters. The most useful plan is the one that fits the season you are in.",
          "That is also why comparison helps. If your protein looks fine but meals still feel chaotic, a meal calorie calculator may be more useful. If fiber is low but appetite is high, food choices may matter more than another calorie cut."
        ]
      },
      {
        title: "Keep the goal practical",
        paragraphs: [
          "Nutrition plans fall apart when they ask too much precision from ordinary days. The better approach is to keep a small number of targets that matter most, then repeat them often enough that they become part of your usual routine.",
          "If a calculator result helps you grocery shop better, build a steadier lunch, or recover better after training, it is already doing its job."
        ]
      }
    ],
    closings: [
      "Good nutrition targets do not need to feel strict to be useful. They just need to give your day more structure than guessing.",
      "If the target helps you build steadier meals, it is working even before the numbers look perfect."
    ]
  },
  hydration: {
    intros: [
      "Hydration sounds basic, but people often underestimate how much it changes energy, exercise, appetite, concentration, and even how a diet feels. A water target becomes useful when it fits your day instead of living as a vague health reminder you forget by noon.",
      "Most people are not looking for a perfect hydration formula. They are trying to answer something more practical: how much water is enough for me, and how do I actually remember to drink it?"
    ],
    sections: [
      {
        title: "Why hydration advice feels so inconsistent",
        paragraphs: [
          "Water needs change with body size, climate, sweat rate, food choices, exercise, and life stage. That is why one-size-fits-all advice can feel vague. A calculator helps by giving you a rough personal target, but that target still needs to be checked against how your day feels and what your routine demands.",
          "Someone working out in heat, eating a high-fiber diet, or recovering from illness will often need a more deliberate hydration plan than someone spending a quiet day indoors."
        ]
      },
      {
        title: "What a practical hydration plan looks like",
        paragraphs: [
          "The easiest hydration plans are anchored to habits rather than good intentions. A glass after waking, another with meals, one near training, and one during the afternoon slump is often more useful than carrying a bottle and hoping for the best. Structure beats vague reminders.",
          "If you are active, spacing water across the day matters more than trying to make up for low intake in one large rush. Slow, steady intake is easier on the body and easier to repeat."
        ],
        bullets: [
          "Tie drinking water to routine moments.",
          "Add a little more structure on training days or hot days.",
          "Use urine color and thirst as rough signals, not as your only guide."
        ]
      },
      {
        title: "When hydration affects other goals",
        paragraphs: [
          "Hydration is rarely a goal on its own. It usually supports something else: more stable appetite, better digestion, fewer headaches, better workouts, or steadier energy. That is why water targets often work best alongside calorie, fiber, protein, or exercise tools.",
          "If you are eating more fiber, training more often, or trying to improve overall diet quality, hydration usually deserves more attention than it gets."
        ]
      },
      {
        title: "Common hydration mistakes",
        paragraphs: [
          "The biggest mistake is forgetting that drinks are part of a broader routine. If you only drink when you suddenly feel dry or tired, you are already catching up. Another common mistake is ignoring context such as caffeine, alcohol, salty meals, or heavy sweating days.",
          "Some people also overcorrect and assume more is always better. A useful hydration target should feel steady and supportive, not forced."
        ]
      },
      {
        title: "How to know if the target is working",
        paragraphs: [
          "A good hydration target should make the day feel easier. Energy should be steadier, training should feel better, and you should need fewer last-minute catch-up drinks. If nothing about the plan feels realistic, adjust the routine, not just the number.",
          "The goal is not to be perfect. It is to make hydration simple enough that it stops being an afterthought."
        ]
      }
    ],
    closings: [
      "A water target works best when it becomes part of your routine, not another health task you keep postponing.",
      "Keep it simple, repeat it often, and let hydration support the bigger goal you actually care about."
    ]
  },
  fertility: {
    intros: [
      "Fertility and ovulation topics are easier to understand when you separate what is typical from what is personal. Many people want one fixed date, but cycle timing is usually better understood as a window shaped by patterns, not certainty.",
      "A calculator can help you estimate fertile days, but most people feel more confident when they combine that estimate with what their own cycle has been doing lately."
    ],
    sections: [
      {
        title: "Why timing can move around from month to month",
        paragraphs: [
          "Ovulation timing is influenced by cycle length, stress, travel, illness, sleep changes, postpartum recovery, and natural variation. Even people with usually steady cycles can notice small shifts. That does not automatically mean something is wrong. It usually means the body is responding to life as well as biology.",
          "This is why many fertility conversations work better when you think in windows instead of exact dates. A well-timed estimate is often more realistic than trying to guess one perfect day."
        ]
      },
      {
        title: "What helps you read the pattern better",
        paragraphs: [
          "Cycle tracking becomes more useful when you compare several clues over time: cycle length, cervical mucus changes, ovulation test results, and how the last few months have behaved. The calculator gives you a quick starting point. Your pattern fills in the rest.",
          "If your cycles are irregular, the estimate can still be helpful, but expectations should stay flexible. In that case, the tool works best as a planning aid rather than a promise."
        ],
        bullets: [
          "Look at the last few cycles, not just the current one.",
          "Treat fertile days as a range, not a single date.",
          "Use real observations when you have them."
        ]
      },
      {
        title: "When the calculator is most helpful",
        paragraphs: [
          "An ovulation calculator is especially useful when you want a quick estimate for planning, calendar awareness, or timing intercourse within a broader window. It is also helpful for people who want to understand how cycle length changes the likely timing of ovulation.",
          "What it cannot do is confirm whether ovulation definitely happened in a given month. For that, people often combine estimates with test strips, temperature tracking, or medical guidance when needed."
        ]
      },
      {
        title: "When to ask bigger questions",
        paragraphs: [
          "If cycles are highly irregular, very long, very short, or changing suddenly for several months, it may help to talk with a clinician. The same is true if you are trying to conceive and feel like your cycle signs are hard to interpret. A calculator can reduce guesswork, but it is not meant to replace care when the pattern is consistently unclear.",
          "Getting help does not mean the tool failed. It means the tool did its job by showing you where a more personal conversation may help."
        ]
      },
      {
        title: "Keep the process manageable",
        paragraphs: [
          "Fertility tracking can become stressful if every signal feels high stakes. A healthier approach is to use the calculator as a planning guide, track a small number of signs, and let several months of pattern give you more confidence than one cycle ever could.",
          "Consistency matters more than perfection. Small notes repeated over time usually teach you more than one intense week of tracking."
        ]
      }
    ],
    closings: [
      "Use the estimate to narrow the window, then let your own cycle pattern do the rest of the work.",
      "The goal is not perfect timing on paper. The goal is a clearer sense of what your cycle is doing and what to do next."
    ]
  },
  "pregnancy-timing": {
    intros: [
      "Due date questions seem straightforward, but most people want more than a date on a screen. They want to know what the estimate is based on, how precise it really is, and what it helps with in everyday planning.",
      "A due date calculator is most useful when it gives you a sensible timeline and a calmer way to think about the weeks ahead."
    ],
    sections: [
      {
        title: "What the estimate is really based on",
        paragraphs: [
          "Most due date tools work from the first day of the last menstrual period or from a conception-based estimate when that is known. That creates a practical reference point, but it is still an estimate. Many pregnancies do not land exactly on that calendar day, and that is normal.",
          "The value of the tool is not that it predicts the exact birthday. The value is that it helps organize the pregnancy timeline into something easier to understand and discuss."
        ]
      },
      {
        title: "How people actually use the result",
        paragraphs: [
          "For many people, the due date becomes a planning anchor. It helps with appointments, trimester milestones, work planning, baby preparation, and understanding when screening windows usually happen. In that way, the estimate supports logistics as much as curiosity.",
          "It also gives context for other tools. Ovulation timing, pregnancy week calculations, and weight-gain guidance all make more sense when the overall timeline feels grounded."
        ],
        bullets: [
          "Use it for planning, not prediction.",
          "Expect some movement if later information changes the timeline.",
          "Think in ranges and milestones, not just one date."
        ]
      },
      {
        title: "Why the date can change",
        paragraphs: [
          "Cycle length differences, uncertainty about ovulation, and ultrasound information can all change how the date is interpreted. That can feel unsettling at first, but it is common. An updated estimate does not mean something went wrong. It usually means the timeline is being refined with better information.",
          "This is one reason due date tools are best treated as a practical first estimate rather than a final medical timeline."
        ]
      },
      {
        title: "What to do with uncertainty",
        paragraphs: [
          "Pregnancy planning often feels emotional because dates carry meaning. The best way to use a due date is to let it guide the big picture while leaving room for normal variation. Weeks and windows are usually more useful than exact predictions.",
          "A steadier mindset can make the rest of pregnancy planning feel less tense. The tool is there to help you orient yourself, not to give you one more thing to worry about."
        ]
      },
      {
        title: "Where the calculator fits in",
        paragraphs: [
          "A due date result is often the start of a set of related questions: when conception likely happened, which week of pregnancy you are in, and how weight-gain guidance or pregnancy milestones should be interpreted. That is why pregnancy tools work best when they connect naturally rather than standing alone.",
          "Used well, the calculator gives you a timeline you can keep returning to as the pregnancy progresses."
        ]
      }
    ],
    closings: [
      "A due date estimate is most helpful when it turns the next few months into a timeline you can actually work with.",
      "Treat the date as a planning anchor, keep room for normal variation, and use the rest of the pregnancy tools when you need more context."
    ]
  },
  "pregnancy-weight": {
    intros: [
      "Pregnancy planning and weight-gain topics are easier to handle when they are framed as guidance rather than pressure. Most people are not looking for one perfect number. They are looking for a reasonable range and a calmer way to understand change over time.",
      "A helpful pregnancy article should leave you with context, not anxiety. The goal is to understand the range, the pace, and what questions are worth bringing to a clinician."
    ],
    sections: [
      {
        title: "Why ranges matter more than exact numbers",
        paragraphs: [
          "Pregnancy weight gain is usually discussed in ranges because bodies, symptoms, appetite, and starting points vary. Pre-pregnancy BMI can help set a common frame, but even then the path is not perfectly even from one week to the next. Some stages bring more nausea, some bring more appetite, and some bring obvious fluid shifts.",
          "A range makes room for real life. It gives you a guide without asking the body to behave like a spreadsheet."
        ]
      },
      {
        title: "How to use the guidance without getting stuck on every week",
        paragraphs: [
          "The most useful approach is to check the broader trend instead of reacting to each single weigh-in. Looking at the overall pace, the trimester you are in, and how you are feeling physically gives a more accurate picture than fixating on a small jump or stall.",
          "This matters because pregnancy includes normal changes in fluid, digestion, and appetite. A weekly number may reflect much more than body tissue change."
        ],
        bullets: [
          "Look at the trend over several weeks.",
          "Use trimester context, not one isolated number.",
          "Bring questions forward if the pattern feels far from expected."
        ]
      },
      {
        title: "What supports steadier progress",
        paragraphs: [
          "Regular meals, enough protein, hydration, fiber, and gentle movement often support more stable energy and more manageable eating patterns during pregnancy. That does not mean the plan has to be rigid. In many cases, simple consistency matters more than perfect nutrient math.",
          "If appetite, nausea, or fatigue are making things unpredictable, the most helpful plan is often the most flexible one that still keeps a few basics in place."
        ]
      },
      {
        title: "When to ask for more individual guidance",
        paragraphs: [
          "If weight gain feels much faster or slower than expected, or if eating is limited by nausea, vomiting, or strong food aversions, it can help to ask for medical or nutrition support. The same is true if blood pressure, swelling, or other symptoms are changing the bigger picture.",
          "In that setting, the calculator is still useful, but it becomes a reference point rather than the main decision-maker."
        ]
      },
      {
        title: "Keep the focus where it helps",
        paragraphs: [
          "Pregnancy is rarely improved by turning weight into a source of constant self-monitoring. A calmer focus is to use the guidance range, eat in a steady way when possible, and notice whether your body, energy, and prenatal care are moving in a reassuring direction.",
          "The best use of a pregnancy tool is to feel more oriented, not more pressured."
        ]
      }
    ],
    closings: [
      "Use the range as a guide, check the broader trend, and let the rest of the pregnancy picture matter too.",
      "Pregnancy guidance works best when it makes the next conversation easier, not when it makes the day heavier."
    ]
  },
  "blood-pressure": {
    intros: [
      "Blood pressure topics are easier to understand when you break the number into parts and look at pattern rather than panic. One reading can be useful. Several readings taken well are much more useful.",
      "Most people are not trying to become experts in blood pressure categories. They just want to know whether the number they saw deserves attention, monitoring, or a calmer response."
    ],
    sections: [
      {
        title: "Why one reading is only a starting point",
        paragraphs: [
          "Blood pressure changes with stress, recent activity, caffeine, timing, posture, and even the way the reading was taken. That means a single result can be informative without being definitive. A higher reading should usually lead to a better measurement routine before it leads to a big conclusion.",
          "This is why categories like normal, elevated, and stage 1 are most useful when they are paired with repeat readings rather than treated as an instant label."
        ]
      },
      {
        title: "How to get a cleaner reading",
        paragraphs: [
          "The quality of the measurement matters more than many people realize. Resting for a few minutes, keeping the cuff at the right height, sitting with support, and avoiding immediate post-exercise readings all help. A cleaner reading makes the category more trustworthy.",
          "If you are checking at home, repeating the same method at similar times often teaches you more than chasing random spot checks."
        ],
        bullets: [
          "Rest before measuring when possible.",
          "Use similar conditions each time.",
          "Look for patterns across days, not just one number."
        ]
      },
      {
        title: "What the result is useful for",
        paragraphs: [
          "A blood pressure result helps you decide whether follow-up is worth doing. It can also show whether sleep, stress, alcohol, exercise, or overall health habits may deserve more attention. That is where the number becomes practical instead of abstract.",
          "For many people, the result is less about one dramatic moment and more about what kind of routine will make the next few weeks look steadier."
        ]
      },
      {
        title: "When home context matters",
        paragraphs: [
          "Home readings can differ from clinic readings, and that difference can be meaningful. Some people run high in medical settings and lower at home. Others are the opposite. A home pattern often gives a better picture of the day-to-day baseline than one rushed reading ever could.",
          "That does not replace care. It just makes the conversation with a clinician more informed."
        ]
      },
      {
        title: "When not to sit on the result",
        paragraphs: [
          "If readings are consistently high, or if they are paired with symptoms such as chest pain, severe headache, shortness of breath, or neurological symptoms, it is important to get prompt medical guidance. A calculator helps with interpretation, but it is not the place to gamble with urgent symptoms.",
          "Used well, the tool helps you notice patterns earlier and respond more calmly when action is needed."
        ]
      }
    ],
    closings: [
      "A blood pressure number becomes useful when it helps you measure better, track better, and decide what kind of follow-up actually makes sense.",
      "The goal is not to stare at one reading. It is to understand the pattern and know what the next reasonable step is."
    ]
  },
  "heart-rate": {
    intros: [
      "Heart-rate tools are useful because they give exercise and recovery a little more shape. Whether you are looking at resting heart rate or training zones, the number becomes meaningful when you compare it with effort, routine, and progress.",
      "Most people do not need perfect heart-rate data. They need a simple range that helps them train at the intended intensity instead of guessing every session."
    ],
    sections: [
      {
        title: "What heart-rate zones are good for",
        paragraphs: [
          "Training zones help separate easy work from moderate work and hard efforts. That matters because many people accidentally do too much of their training in the middle. A heart-rate range can make easy days easier and hard days more deliberate.",
          "Used this way, the number is less about precision for its own sake and more about matching the workout to the goal."
        ]
      },
      {
        title: "Why the number changes from day to day",
        paragraphs: [
          "Heat, hydration, stress, caffeine, sleep, illness, and training fatigue can all shift heart rate. That means the same pace or same bike resistance may not produce the same number every day. The tool still helps, but the body is allowed to be human.",
          "This is also why perceived effort stays useful. A zone estimate works best when it sits beside how the session actually feels."
        ],
        bullets: [
          "Use zones as guides, not rigid rules.",
          "Compare heart rate with effort and recovery.",
          "Expect some drift on hot or tiring days."
        ]
      },
      {
        title: "How to use a zone calculator well",
        paragraphs: [
          "A good zone estimate helps you structure the week. Easier aerobic work should feel manageable. Harder sessions should feel clearly harder. If every workout feels the same, the number may be telling you that the training mix needs work.",
          "People often get the most value by using zones for a few repeatable sessions each week instead of trying to micromanage every walk or every lift."
        ]
      },
      {
        title: "What resting heart rate can and cannot tell you",
        paragraphs: [
          "Resting heart rate can give a rough sense of recovery and baseline fitness, but it is not a complete health score. A lower number is not always better, and a temporary rise does not automatically mean something is wrong. The value comes from watching your normal pattern and noticing meaningful changes.",
          "If the number shifts alongside poor sleep, illness, stress, or overreaching, it may be a useful clue. By itself, it is just one signal."
        ]
      },
      {
        title: "Where this tool fits in a routine",
        paragraphs: [
          "Heart-rate tools work best as part of a broader rhythm that includes sleep, hydration, recovery, and sensible training volume. The number helps you steer, but it cannot do the whole job by itself.",
          "The simpler the system is to repeat, the more likely it is to help."
        ]
      }
    ],
    closings: [
      "Use heart rate to shape the session, then let recovery, effort, and consistency tell you whether the plan is working.",
      "A training zone is most useful when it helps you pace the week better, not when it turns every workout into homework."
    ]
  },
  bac: {
    intros: [
      "BAC topics are helpful when they stay grounded in safety instead of false precision. People often search for a number because they want reassurance, but the responsible use of a BAC estimate is to understand risk, not to argue for risky choices.",
      "A BAC calculator can show why alcohol affects people differently, but it should never be used as a green light for driving or other safety decisions."
    ],
    sections: [
      {
        title: "What a BAC estimate can help with",
        paragraphs: [
          "A BAC estimate can show how body size, sex, drink count, time, and alcohol strength all change the picture. That helps people understand why one person's experience cannot be copied safely by someone else. It also helps explain why impairment can rise faster than many expect.",
          "That educational value matters. It turns the conversation from guesswork into a clearer sense of how alcohol builds up in the body."
        ]
      },
      {
        title: "Why the estimate is never the whole story",
        paragraphs: [
          "Drink size, pouring accuracy, food intake, metabolism, medication, fatigue, and pace of drinking all affect what happens in real life. The calculator uses averages. Real life is messier. That means the estimate can help explain risk while still being too uncertain to support a safety decision.",
          "This is especially important because impairment can start before a person feels obviously impaired."
        ],
        bullets: [
          "Use the estimate for education, not permission.",
          "Assume real-life variation can make the situation riskier than the number suggests.",
          "Never use the result to decide whether driving is safe."
        ]
      },
      {
        title: "How people underestimate alcohol effect",
        paragraphs: [
          "People often underestimate mixed drinks, forget how little time has passed, or assume that eating automatically cancels out the effect. Others rely too much on how they feel. That is unreliable because judgment itself is affected by alcohol.",
          "The more useful question is not whether you feel okay. It is whether the situation includes unnecessary risk. In many cases, the safest answer is to avoid the gamble entirely."
        ]
      },
      {
        title: "What the result should change",
        paragraphs: [
          "A good BAC estimate should make transportation, pacing, and safety planning more serious, not less. It is most useful before drinking, when it helps with decisions about rides, spacing, or choosing not to put yourself in a risky situation later in the evening.",
          "If the number feels uncomfortable, that discomfort is often doing something helpful."
        ]
      },
      {
        title: "Keep the safety goal simple",
        paragraphs: [
          "The goal is not to get better at staying close to a legal line. The goal is to keep yourself and other people safe. A BAC tool can support that goal by showing how quickly alcohol can create more risk than expected.",
          "Used well, the tool encourages better planning, not more confidence."
        ]
      }
    ],
    closings: [
      "Use BAC estimates to understand risk earlier, not to justify last-minute decisions.",
      "If the number helps you plan a safer night, it has already done the job it is supposed to do."
    ]
  },
  sleep: {
    intros: [
      "Sleep tools are most helpful when they turn a vague goal into a routine you can actually try tonight. People rarely need more pressure around sleep. They need a clearer sense of timing, consistency, and what is realistic in ordinary life.",
      "A sleep calculator does not fix recovery on its own, but it can make the daily rhythm easier to understand."
    ],
    sections: [
      {
        title: "Why timing matters more than it seems",
        paragraphs: [
          "Sleep quality is influenced by duration, but timing matters too. Bedtime drift, very late nights, early alarms, and irregular weekends can all make a person feel worse even when total time in bed looks decent on paper. A sleep window becomes useful when it helps the schedule settle down a little.",
          "That is why sleep tools often focus on cycles, wake times, or bedtime estimates. They give the day a shape that is easier to repeat."
        ]
      },
      {
        title: "What the calculator is actually helping you do",
        paragraphs: [
          "The point is not to chase a mathematically perfect bedtime. The point is to avoid random sleep timing and give yourself a better chance of waking up at a sensible point in the cycle. That can make mornings feel less brutal, especially when the wake time is fixed.",
          "Used this way, the tool supports real decisions: when to stop scrolling, when to get in bed, and how to build a more repeatable evening."
        ],
        bullets: [
          "Use the result as a planning guide, not a rule.",
          "Aim for a repeatable pattern more than a perfect night.",
          "Let wake time anchor the plan when possible."
        ]
      },
      {
        title: "Why some nights still feel off",
        paragraphs: [
          "Stress, alcohol, travel, illness, late meals, and screen-heavy evenings can all make a good sleep window feel worse than expected. That does not mean the timing tool failed. It usually means the schedule is only one part of the picture.",
          "This is where recovery habits matter. Wind-down routines, light exposure, caffeine timing, and daytime activity often do more for sleep than one perfect bedtime calculation."
        ]
      },
      {
        title: "How to use sleep data without obsessing over it",
        paragraphs: [
          "People often overcomplicate sleep by trying to interpret every rough night. A more helpful approach is to use the calculator for structure and then judge success by broader patterns: how often mornings feel manageable, whether energy is steadier, and whether the schedule is getting easier to keep.",
          "That kind of feedback is much more useful than a one-night score."
        ]
      },
      {
        title: "Where sleep fits with other tools",
        paragraphs: [
          "Sleep affects hunger, blood pressure, recovery, exercise feel, and even how hard a calorie deficit feels. That is why it pairs naturally with wellness, fitness, and stress-related tools. A better night of sleep often improves several other numbers at once.",
          "In that sense, sleep tools are less about one bedtime and more about making the rest of the week work better."
        ]
      }
    ],
    closings: [
      "A sleep tool is useful when it helps you repeat a better rhythm, not when it gives you one more number to worry about.",
      "Start with a realistic bedtime or wake time, repeat it often, and let consistency do more of the work."
    ]
  }
};

export const getArticleExtension = (meta: BlogMeta, related: CalculatorLink[]): ArticleExtension => {
  const packKey = findPackKey(meta);
  const pack = extensionPacks[packKey];
  const tagLine = meta.tags.length > 0 ? meta.tags.map((tag) => tag.replaceAll("-", " ")).join(", ") : categoryLabels[meta.category];
  const relatedNames = related.slice(0, 3).map((item) => item.title).join(", ");
  const genericSections: ExtensionSection[] = [
    {
      title: "How this topic shows up in everyday life",
      paragraphs: [
        "Most health questions do not arrive as textbook questions. They usually show up in the middle of the day: while planning meals, checking a number, comparing tools, or trying to decide whether a habit is worth keeping.",
        "That is why a short article often needs a little more context. The point is not to memorize definitions. The point is to make the next decision a little clearer."
      ]
    },
    {
      title: "Questions worth asking after you read",
      paragraphs: [
        "Before moving on, it helps to ask a few simple questions. Do you need a personal estimate, a trend over time, or just a clearer explanation of the number? Are you looking for a quick answer today, or are you trying to build a steadier routine over the next few weeks?"
      ],
      bullets: [
        "Do I need a one-time estimate or a longer-term trend?",
        "What other signal would help me read this number better?",
        "Would a related calculator make this easier to apply?",
        "What is one small decision I can make with this information today?"
      ]
    }
  ];

  return {
    intro: `${pack.intros[0]} This article sits in the ${categoryLabels[meta.category].toLowerCase()} section of HealthCalcHub and works best when you read it with a clear question in mind, such as ${tagLine}.`,
    sections: [
      ...pack.sections,
      ...genericSections,
      {
        title: "Where to go next",
        paragraphs: [
          relatedNames
            ? `A good next step is usually ${relatedNames}. Those pages help you apply the idea to your own numbers.`
            : "A good next step is usually to open a related calculator and see how the topic applies to your own situation.",
          "Reading and calculating work well together. First understand the topic well enough to know what the number means. Then use the tool for a personal estimate."
        ]
      }
    ],
    closing: `${pack.closings[0]} ${buildRelatedToolLine(related)}`
  };
};

export const estimateExtensionWords = (extension: ArticleExtension) => {
  const combined = [
    extension.intro,
    ...extension.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]),
    extension.closing
  ].join(" ");

  return estimateArticleWords(combined);
};
