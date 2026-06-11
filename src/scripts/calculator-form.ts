import { calculate } from "../utils/calculations";
import { getToolIconMeta, renderToolIconSvg } from "../utils/tool-icons";
import { withBasePath } from "../utils/site";

type ResultSignal = {
  label: string;
  value: string;
};

type ResultTone = {
  badge: string;
  meterLabel: string;
  meterPercent: number;
  signals: ResultSignal[];
};

type StoredRecentTool = {
  category: string;
  slug: string;
  title: string;
  url: string;
  visitedAt: string;
};

const RECENT_TOOLS_KEY = "healthcalchub:recent-tools";
const PENDING_SWITCH_KEY = "healthcalchub:pending-calculator-switch";

const readRecentTools = (): StoredRecentTool[] => {
  try {
    const raw = window.localStorage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredRecentTool[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const rememberPendingCalculatorSwitch = () => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-calculator-switch-link]"));

  links.forEach((link) => {
    if (link.dataset.switchBound === "true") return;
    link.dataset.switchBound = "true";

    link.addEventListener("click", () => {
      try {
        window.sessionStorage.setItem(
          PENDING_SWITCH_KEY,
          JSON.stringify({
            href: link.getAttribute("href"),
            at: Date.now()
          })
        );
      } catch {
        // Ignore session storage issues.
      }
    });
  });
};

const closeQuickSwitchPanel = (root: HTMLElement) => {
  const toggle = root.querySelector<HTMLElement>("[data-quick-switch-toggle]");
  const panel = root.querySelector<HTMLElement>("[data-quick-switch-panel]");
  const backdrop = root.querySelector<HTMLElement>("[data-quick-switch-backdrop]");
  if (!toggle || !panel) return;

  toggle.setAttribute("aria-expanded", "false");
  toggle.dataset.state = "closed";
  panel.dataset.state = "closed";
  panel.hidden = true;
  if (backdrop) {
    backdrop.dataset.state = "closed";
    backdrop.hidden = true;
  }
};

const openQuickSwitchPanel = (root: HTMLElement) => {
  const toggle = root.querySelector<HTMLElement>("[data-quick-switch-toggle]");
  const panel = root.querySelector<HTMLElement>("[data-quick-switch-panel]");
  const closeButton = root.querySelector<HTMLElement>("[data-quick-switch-close]");
  const backdrop = root.querySelector<HTMLElement>("[data-quick-switch-backdrop]");
  if (!toggle || !panel) return;

  toggle.setAttribute("aria-expanded", "true");
  toggle.dataset.state = "open";
  if (backdrop) {
    backdrop.hidden = false;
    backdrop.dataset.state = "preparing";
  }
  panel.hidden = false;
  panel.dataset.state = "preparing";

  window.requestAnimationFrame(() => {
    if (backdrop) backdrop.dataset.state = "open";
    panel.dataset.state = "open";
    closeButton?.focus();
  });
};

const renderQuickSwitchRecent = (section: HTMLElement) => {
  const currentSlug = section.dataset.calculatorSlug;
  const recentSection = section.querySelector<HTMLElement>("[data-quick-switch-recent-shell]");
  const container = section.querySelector<HTMLElement>("[data-quick-switch-recent]");
  if (!currentSlug || !recentSection || !container) return;

  const recent = readRecentTools()
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 4);

  if (recent.length === 0) {
    recentSection.hidden = true;
    return;
  }

  recentSection.hidden = false;
  container.innerHTML = recent
    .map(
      (item) => {
        const iconMeta = item.slug ? getToolIconMeta(item.slug) : { category: "health" };
        const iconSvg = item.slug ? renderToolIconSvg(item.slug, "tool-icon-svg") : "";
        return `
        <a href="${withBasePath(`/${item.slug}#calculator`)}" class="quick-switch-pill-compact" data-calculator-switch-link>
          <span class="tool-icon-shell tool-icon-shell-sm tool-icon-${iconMeta.category}">${iconSvg}</span>
          <span>${item.title}</span>
        </a>
      `;
      }
    )
    .join("");
};

const initQuickSwitchPanels = () => {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-calculator-config]"));

  sections.forEach((section) => {
    renderQuickSwitchRecent(section);

    const root = section;
    const toggle = section.querySelector<HTMLElement>("[data-quick-switch-toggle]");
    const panel = section.querySelector<HTMLElement>("[data-quick-switch-panel]");
    const closeButton = section.querySelector<HTMLElement>("[data-quick-switch-close]");
    const backdrop = section.querySelector<HTMLElement>("[data-quick-switch-backdrop]");
    if (!root || !toggle || !panel || !closeButton || !backdrop) return;

    if (root.dataset.quickSwitchReady === "true") return;
    root.dataset.quickSwitchReady = "true";

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeQuickSwitchPanel(root);
        return;
      }

      document.querySelectorAll<HTMLElement>("[data-quick-switch-root]").forEach((otherRoot) => {
        if (otherRoot !== root) closeQuickSwitchPanel(otherRoot);
      });

      openQuickSwitchPanel(root);
    });

    closeButton.addEventListener("click", () => {
      closeQuickSwitchPanel(root);
      toggle.focus();
    });

    backdrop.addEventListener("click", () => {
      closeQuickSwitchPanel(root);
      toggle.focus();
    });
  });
};

const bindQuickSwitchDismiss = () => {
  if (document.body.dataset.quickSwitchDismissReady === "true") return;
  document.body.dataset.quickSwitchDismissReady = "true";

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    document.querySelectorAll<HTMLElement>("[data-quick-switch-root]").forEach((root) => {
      if (root.contains(target)) return;
      closeQuickSwitchPanel(root);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll<HTMLElement>("[data-quick-switch-root]").forEach((root) => {
      closeQuickSwitchPanel(root);
    });
  });
};

const settleCalculatorViewport = () => {
  if (window.location.hash !== "#calculator") return;

  const calculatorSection = document.getElementById("calculator");
  if (!calculatorSection) return;

  let shouldSettle = false;

  try {
    const raw = window.sessionStorage.getItem(PENDING_SWITCH_KEY);
    if (raw) {
      const pending = JSON.parse(raw) as { href?: string; at?: number };
      if (typeof pending.at === "number" && Date.now() - pending.at < 5000) {
        shouldSettle = true;
      }
      window.sessionStorage.removeItem(PENDING_SWITCH_KEY);
    }
  } catch {
    shouldSettle = true;
  }

  if (!shouldSettle) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      calculatorSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
};

const initCalculatorForms = () => {
  initQuickSwitchPanels();
  rememberPendingCalculatorSwitch();
  settleCalculatorViewport();
  bindQuickSwitchDismiss();

  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-calculator-config]"));

  sections.forEach((section) => {
    if (section.dataset.calculatorReady === "true") return;
    section.dataset.calculatorReady = "true";

    const rawConfig = section.dataset.calculatorConfig;
    if (!rawConfig) return;

    const calculator = JSON.parse(rawConfig);
    const form = section.querySelector<HTMLFormElement>("#calculator-form");
    const resultSummary = section.querySelector<HTMLElement>("[data-result-summary]");
    const resultDetails = section.querySelector<HTMLElement>("[data-result-details]");
    const resultNote = section.querySelector<HTMLElement>("[data-result-note]");
    const resultTips = section.querySelector<HTMLElement>("[data-result-tips]");
    const resultBadge = section.querySelector<HTMLElement>("[data-result-badge]");
    const resultSignals = section.querySelector<HTMLElement>("[data-result-signals]");
    const resultMeterFill = section.querySelector<HTMLElement>("[data-result-meter-fill]");
    const resultMeterLabel = section.querySelector<HTMLElement>("[data-result-meter-label]");
    const resultVisual = section.querySelector<HTMLElement>("[data-result-visual]");
    const resultStage = section.querySelector<HTMLElement>("[data-result-stage]");
    const hiddenUnitSystem = form?.querySelector<HTMLInputElement>('input[name="unitSystem"]');
    const toggles = Array.from(section.querySelectorAll<HTMLElement>("[data-unit-toggle]"));
    const fields = Array.from(section.querySelectorAll<HTMLElement>(".field"));

    try {
      const currentUrl = window.location.pathname;
      const existing = readRecentTools();
      const nextEntry: StoredRecentTool = {
        category: calculator.category,
        slug: calculator.slug,
        title: calculator.title,
        url: currentUrl,
        visitedAt: new Date().toISOString()
      };
      const merged = [nextEntry, ...existing.filter((item) => item.url !== currentUrl)].slice(0, 6);
      window.localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(merged));
    } catch {
      // Ignore local storage issues and keep calculators usable.
    }

    const getDetailValue = (label: string, details: Array<{ label: string; value: string }>) =>
      details.find((detail) => detail.label === label)?.value ?? "";

    const getResultTone = (
      formula: string,
      result: ReturnType<typeof calculate>
    ): ResultTone => {
      const base: ResultTone = {
        badge: "Guided estimate",
        meterLabel: "Estimate",
        meterPercent: 58,
        signals: [
          { label: "Primary signal", value: result.summary },
          { label: "Use it for", value: "Quick orientation before reading the guidance below." }
        ]
      };

      if (formula === "bmi") {
        const category = getDetailValue("Category", result.details);
        const bmi = Number.parseFloat(getDetailValue("BMI", result.details));
        if (category === "Healthy weight") {
          return {
            badge: "Balanced zone",
            meterLabel: "Healthy range",
            meterPercent: 62,
            signals: [
              { label: "BMI category", value: category || "Healthy weight" },
              { label: "Next move", value: "Compare with body fat and lifestyle before making decisions." }
            ]
          };
        }
        return {
          badge: bmi >= 30 || bmi < 18.5 ? "Needs context" : "Watch zone",
          meterLabel: "Screening result",
          meterPercent: bmi >= 30 || bmi < 18.5 ? 84 : 72,
          signals: [
            { label: "BMI category", value: category || "Outside typical range" },
            { label: "Next move", value: "Use body fat and calorie tools to add context to this screening number." }
          ]
        };
      }

      if (formula === "blood-pressure") {
        const category = result.summary;
        const isHigh = category.includes("stage 1") || category.includes("stage 2");
        return {
          badge: isHigh ? "Take seriously" : category === "Normal" ? "Within range" : "Watch zone",
          meterLabel: isHigh ? "Follow up" : "Reading guide",
          meterPercent: category === "Normal" ? 45 : isHigh ? 88 : 68,
          signals: [
            { label: "Reading status", value: category },
            { label: "Reminder", value: "One reading is not a diagnosis, but repeat patterns matter." }
          ]
        };
      }

      if (formula === "bac") {
        const interpretation = getDetailValue("Interpretation", result.details);
        const bac = Number.parseFloat(getDetailValue("Estimated BAC", result.details));
        return {
          badge: bac >= 0.08 ? "High risk" : bac > 0 ? "Impairment risk" : "No alcohol signal",
          meterLabel: "Safety caution",
          meterPercent: Math.min(Math.max(bac * 1000, 0), 100),
          signals: [
            { label: "Interpretation", value: interpretation || "Impairment estimate" },
            { label: "Critical note", value: "Never use this number to decide whether driving is safe." }
          ]
        };
      }

      if (formula === "due-date" || formula === "ovulation" || formula === "sleep") {
        return {
          badge: "Planning estimate",
          meterLabel: "Timing tool",
          meterPercent: 56,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Planning and preparation rather than certainty." }
          ]
        };
      }

      if (formula === "macro" || formula === "protein" || formula === "carb" || formula === "fat-intake" || formula === "fiber") {
        return {
          badge: "Nutrition target",
          meterLabel: "Daily planning",
          meterPercent: 61,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Set a practical daily intake target and adjust with real-world tracking." }
          ]
        };
      }

      if (formula === "tdee" || formula === "calorie" || formula === "bmr") {
        return {
          badge: "Energy estimate",
          meterLabel: "Planning baseline",
          meterPercent: 59,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Start here, then adjust from weekly trends and recovery." }
          ]
        };
      }

      if (formula === "heart-rate-zone") {
        return {
          badge: "Training guide",
          meterLabel: "Workout signal",
          meterPercent: 64,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Anchor easier cardio and compare with perceived effort." }
          ]
        };
      }

      if (formula === "sleep") {
        return {
          badge: "Recovery timing",
          meterLabel: "Sleep cycle guide",
          meterPercent: 57,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Choose a realistic bedtime or wake time around full sleep cycles." }
          ]
        };
      }

      if (formula === "body-fat" || formula === "lean-body-mass" || formula === "ideal-weight") {
        return {
          badge: "Body composition",
          meterLabel: "Reference estimate",
          meterPercent: 63,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Reference planning, not a complete health judgment." }
          ]
        };
      }

      if (formula === "pregnancy-weight-gain") {
        return {
          badge: "Pregnancy guidance",
          meterLabel: "Progress guide",
          meterPercent: 58,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Compare your progress with a typical range and check with your clinician." }
          ]
        };
      }

      if (formula === "macro") {
        return {
          badge: "Macro blueprint",
          meterLabel: "Meal planning",
          meterPercent: 62,
          signals: [
            { label: "Primary signal", value: result.summary },
            { label: "Use it for", value: "Translate calories into an easier daily eating structure." }
          ]
        };
      }

      return base;
    };

    const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

    const getResultStageClass = (formula: string) => {
      if (formula === "blood-pressure" || formula === "heart-rate-zone") return "result-stage-heart";
      if (formula === "bac") return "result-stage-caution";
      if (formula === "due-date" || formula === "ovulation" || formula === "sleep") return "result-stage-timing";
      if (formula === "pregnancy-weight-gain") return "result-stage-pregnancy";
      if (formula === "water" || formula === "fiber") return "result-stage-hydration";
      if (formula === "macro" || formula === "protein" || formula === "carb" || formula === "fat-intake" || formula === "meal-calorie")
        return "result-stage-nutrition";
      if (formula === "body-fat" || formula === "lean-body-mass" || formula === "ideal-weight" || formula === "bmi")
        return "result-stage-body";
      return "result-stage-energy";
    };

    const getResultVisual = (formula: string, result: ReturnType<typeof calculate>) => {
      if (formula === "bmr") {
        const bmr = getDetailValue("Estimated BMR", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Resting energy view</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Estimated BMR</p>
              <p class="mt-2 text-2xl font-bold text-white">${bmr}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Meaning</p>
              <p class="mt-2 text-sm font-semibold leading-6 text-white">Baseline calories for core body functions at complete rest.</p>
            </div>
          </div>
        `;
      }

      if (formula === "bmi") {
        const bmi = Number.parseFloat(getDetailValue("BMI", result.details));
        const category = getDetailValue("Category", result.details);
        const marker = clampPercent((bmi / 40) * 100);
        const safeStart = 46;
        const safeWidth = 16;
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">BMI range view</p>
          <p class="mt-2 text-sm leading-6 text-white/88">This marker shows where your current BMI sits relative to the standard adult healthy range.</p>
          <div class="range-bar">
            <div class="range-safe-window" style="left:${safeStart}%; width:${safeWidth}%"></div>
            <div class="range-marker" style="left:${marker}%"></div>
          </div>
          <div class="mt-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-white/70">
            <span>Under</span>
            <span>Healthy</span>
            <span>Higher</span>
          </div>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Current category</p>
              <p class="mt-2 text-base font-semibold text-white">${category || "BMI result"}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Healthy reference</p>
              <p class="mt-2 text-base font-semibold text-white">18.5 to 24.9 BMI</p>
            </div>
          </div>
        `;
      }

      if (formula === "blood-pressure") {
        const reading = getDetailValue("Reading", result.details);
        const category = getDetailValue("Category", result.details) || result.summary;
        const [systolic, diastolic] = reading.split("/").map((part) => Number.parseInt(part, 10));
        const sysPercent = clampPercent(((systolic || 0) / 180) * 100);
        const diaPercent = clampPercent(((diastolic || 0) / 120) * 100);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Blood pressure profile</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Systolic</p>
              <p class="mt-2 text-2xl font-bold text-white">${Number.isFinite(systolic) ? systolic : "--"}</p>
              <div class="range-bar">
                <div class="range-marker" style="left:${sysPercent}%"></div>
              </div>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Diastolic</p>
              <p class="mt-2 text-2xl font-bold text-white">${Number.isFinite(diastolic) ? diastolic : "--"}</p>
              <div class="range-bar">
                <div class="range-marker" style="left:${diaPercent}%"></div>
              </div>
            </div>
          </div>
          <div class="signal-panel mt-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Classification</p>
            <p class="mt-2 text-base font-semibold text-white">${category}</p>
          </div>
        `;
      }

      if (formula === "heart-rate-zone") {
        const maxHeartRate = getDetailValue("Estimated max heart rate", result.details);
        const zone2 = getDetailValue("Zone 2", result.details);
        const zone4 = getDetailValue("Zone 4", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Training zones</p>
          <div class="zone-stack">
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Zone 2</p>
              <p class="mt-2 text-xl font-bold text-white">${zone2}</p>
              <p class="mt-1 text-sm leading-6 text-white/82">Steady aerobic work and easier endurance sessions.</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Zone 4</p>
              <p class="mt-2 text-xl font-bold text-white">${zone4}</p>
              <p class="mt-1 text-sm leading-6 text-white/82">Harder interval work where effort climbs significantly.</p>
            </div>
          </div>
          <div class="signal-panel mt-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Estimated max heart rate</p>
            <p class="mt-2 text-base font-semibold text-white">${maxHeartRate}</p>
          </div>
        `;
      }

      if (formula === "tdee") {
        const bmr = getDetailValue("BMR", result.details);
        const maintenance = getDetailValue("Maintenance calories", result.details);
        const target = getDetailValue("Goal calories", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Energy ladder</p>
          <div class="zone-stack">
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Resting baseline</p>
              <p class="mt-2 text-xl font-bold text-white">${bmr}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Maintenance</p>
              <p class="mt-2 text-xl font-bold text-white">${maintenance}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Goal target</p>
              <p class="mt-2 text-xl font-bold text-white">${target}</p>
            </div>
          </div>
        `;
      }

      if (formula === "calorie") {
        const maintenance = getDetailValue("Maintenance calories", result.details);
        const goal = getDetailValue("Goal", result.details);
        const intake = getDetailValue("Recommended intake", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Calorie target view</p>
          <div class="zone-stack">
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Maintenance</p>
              <p class="mt-2 text-xl font-bold text-white">${maintenance}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Current goal</p>
              <p class="mt-2 text-xl font-bold text-white">${goal}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Recommended intake</p>
              <p class="mt-2 text-xl font-bold text-white">${intake}</p>
            </div>
          </div>
        `;
      }

      if (formula === "macro") {
        const calories = getDetailValue("Calories", result.details);
        const protein = getDetailValue("Protein", result.details);
        const carbs = getDetailValue("Carbohydrates", result.details);
        const fat = getDetailValue("Fat", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Macro split view</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Protein</p>
              <p class="mt-2 text-xl font-bold text-white">${protein}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Carbs</p>
              <p class="mt-2 text-xl font-bold text-white">${carbs}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Fat</p>
              <p class="mt-2 text-xl font-bold text-white">${fat}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Calories</p>
              <p class="mt-2 text-xl font-bold text-white">${calories}</p>
            </div>
          </div>
        `;
      }

      if (formula === "protein") {
        const protein = getDetailValue("Protein target", result.details);
        const meal = getDetailValue("Per meal over 4 meals", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Protein distribution</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Daily target</p>
              <p class="mt-2 text-xl font-bold text-white">${protein}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Per meal guide</p>
              <p class="mt-2 text-xl font-bold text-white">${meal}</p>
            </div>
          </div>
        `;
      }

      if (formula === "water") {
        const liters = getDetailValue("Water target", result.details);
        const cups = getDetailValue("Approximate cups", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Hydration guide</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Daily liters</p>
              <p class="mt-2 text-2xl font-bold text-white">${liters}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Cup estimate</p>
              <p class="mt-2 text-2xl font-bold text-white">${cups}</p>
            </div>
          </div>
        `;
      }

      if (formula === "meal-calorie") {
        const daily = getDetailValue("Daily calories", result.details);
        const meals = getDetailValue("Meals", result.details);
        const average = getDetailValue("Average per meal", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Meal split view</p>
          <div class="zone-stack">
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Daily calories</p>
              <p class="mt-2 text-xl font-bold text-white">${daily}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Meal count</p>
              <p class="mt-2 text-xl font-bold text-white">${meals}</p>
            </div>
            <div class="zone-band">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Average per meal</p>
              <p class="mt-2 text-xl font-bold text-white">${average}</p>
            </div>
          </div>
        `;
      }

      if (formula === "carb" || formula === "fat-intake" || formula === "fiber") {
        const values = result.details
          .map(
            (detail) => `
              <div class="bp-cell">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">${detail.label}</p>
                <p class="mt-2 text-xl font-bold text-white">${detail.value}</p>
              </div>
            `
          )
          .join("");
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Daily target view</p>
          <div class="bp-grid">${values}</div>
        `;
      }

      if (formula === "body-fat" || formula === "lean-body-mass" || formula === "ideal-weight") {
        const values = result.details
          .map(
            (detail) => `
              <div class="bp-cell">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">${detail.label}</p>
                <p class="mt-2 text-xl font-bold text-white">${detail.value}</p>
              </div>
            `
          )
          .join("");
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Body composition view</p>
          <div class="bp-grid">${values}</div>
        `;
      }

      if (formula === "due-date" || formula === "ovulation") {
        const timingValues = result.details
          .map(
            (detail) => `
              <div class="zone-band">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">${detail.label}</p>
                <p class="mt-2 text-xl font-bold text-white">${detail.value}</p>
              </div>
            `
          )
          .join("");
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Timing path</p>
          <div class="zone-stack">${timingValues}</div>
        `;
      }

      if (formula === "sleep") {
        const cycleValues = result.details.map((detail) => `<div class="zone-band"><p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">${detail.label}</p><p class="mt-2 text-xl font-bold text-white">${detail.value}</p></div>`).join("");
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Cycle timing view</p>
          <div class="zone-stack">${cycleValues}</div>
        `;
      }

      if (formula === "pregnancy-weight-gain") {
        const fullRange = getDetailValue("Full pregnancy range", result.details);
        const suggested = getDetailValue("Suggested gain so far", result.details);
        const bmi = getDetailValue("Pre-pregnancy BMI", result.details);
        return `
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Pregnancy progress guide</p>
          <div class="bp-grid">
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Pre-pregnancy BMI</p>
              <p class="mt-2 text-xl font-bold text-white">${bmi}</p>
            </div>
            <div class="bp-cell">
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Full range</p>
              <p class="mt-2 text-xl font-bold text-white">${fullRange}</p>
            </div>
          </div>
          <div class="signal-panel mt-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Suggested gain so far</p>
            <p class="mt-2 text-base font-semibold text-white">${suggested}</p>
          </div>
        `;
      }

      return `
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">Focused view</p>
        <div class="signal-panel mt-3">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">Primary takeaway</p>
          <p class="mt-2 text-base font-semibold text-white">${result.summary}</p>
        </div>
        <p class="mt-3 text-sm leading-6 text-white/84">Use the structured details and supporting guidance below to turn this estimate into a practical next step.</p>
      `;
    };

    const isFieldVisible = (field: HTMLElement, unitSystem: string) => {
      const unitSystems = field.dataset.unitSystems;
      const showWhenField = field.dataset.showWhenField;
      const showWhenValue = field.dataset.showWhenValue;

      const matchesUnit = !unitSystems || unitSystems.split(",").filter(Boolean).includes(unitSystem);
      if (!matchesUnit) return false;

      if (!showWhenField || !showWhenValue) return true;
      const dependent = form?.elements.namedItem(showWhenField) as HTMLInputElement | HTMLSelectElement | null;
      return dependent?.value === showWhenValue;
    };

    const refreshFields = () => {
      const unitSystem = hiddenUnitSystem?.value ?? "metric";
      fields.forEach((field) => {
        field.style.display = isFieldVisible(field, unitSystem) ? "" : "none";
      });
    };

    let resultAnimationResetTimer: number | null = null;

    const triggerResultStageAnimation = () => {
      if (!resultStage) return;
      resultStage.dataset.resultState = "idle";

      if (resultAnimationResetTimer) {
        window.clearTimeout(resultAnimationResetTimer);
      }

      window.requestAnimationFrame(() => {
        resultStage.dataset.resultState = "active";
        resultAnimationResetTimer = window.setTimeout(() => {
          resultStage.dataset.resultState = "idle";
        }, 1600);
      });
    };

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        toggles.forEach((item) => {
          if (item.dataset.unitToggle === hiddenUnitSystem?.value) {
            item.classList.remove("bg-pine", "text-white");
            item.classList.add("text-ink/65");
          }
        });

        toggles.forEach((item) => {
          item.classList.remove("bg-pine", "text-white");
          item.classList.add("text-ink/65");
        });

        toggle.classList.remove("text-ink/65");
        toggle.classList.add("bg-pine", "text-white");

        if (hiddenUnitSystem) hiddenUnitSystem.value = toggle.dataset.unitToggle ?? "metric";
        refreshFields();
      });
    });

    form?.addEventListener("change", refreshFields);

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const unitSystem = (data.unitSystem ?? "metric") as "metric" | "imperial";
      const result = calculate(calculator, data, unitSystem);
      const tone = getResultTone(calculator.formula, result);

      if (resultStage) {
        resultStage.className = `result-stage ${getResultStageClass(calculator.formula)} rounded-[2rem] px-5 py-5 text-white shadow-panel sm:px-6 sm:py-6`;
      }
      if (resultSummary) resultSummary.textContent = result.summary;
      if (resultBadge) resultBadge.textContent = tone.badge;
      if (resultMeterLabel) resultMeterLabel.textContent = tone.meterLabel;
      if (resultMeterFill) resultMeterFill.style.width = `${tone.meterPercent}%`;
      if (resultDetails) {
        resultDetails.innerHTML = result.details
          .map(
            (detail) => `
              <div class="result-detail-card">
                <p class="text-xs uppercase tracking-[0.16em] text-white/65">${detail.label}</p>
                <p class="mt-2 text-lg font-semibold">${detail.value}</p>
              </div>
            `
          )
          .join("");
      }
      if (resultSignals) {
        resultSignals.innerHTML = tone.signals
          .map(
            (signal) => `
              <div class="signal-panel">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/66">${signal.label}</p>
                <p class="mt-2 text-sm leading-6 text-white/90">${signal.value}</p>
              </div>
            `
          )
          .join("");
      }
      if (resultVisual) {
        resultVisual.innerHTML = getResultVisual(calculator.formula, result);
      }
      if (resultNote) {
        resultNote.textContent = result.note ?? "";
        resultNote.style.display = result.note ? "" : "none";
      }
      if (resultTips) {
        resultTips.innerHTML = (result.tips ?? []).map((tip) => `<li>${tip}</li>`).join("");
      }

      window.gtag?.("event", "calculator_submit", {
        event_category: "calculator",
        event_label: calculator.title,
        calculator_slug: calculator.slug,
        calculator_category: calculator.category,
        unit_system: unitSystem
      });

      triggerResultStageAnimation();
    });

    refreshFields();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCalculatorForms, { once: true });
} else {
  initCalculatorForms();
}

document.addEventListener("astro:page-load", initCalculatorForms);
