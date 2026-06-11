import { withBasePath } from "../utils/site";

type StoredRecentTool = {
  category: string;
  slug?: string;
  title: string;
  url: string;
  visitedAt: string;
};

const STORAGE_KEY = "healthcalchub:recent-tools";

const readRecentTools = (): StoredRecentTool[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredRecentTool[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initCalculatorQuickSwitch = () => {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-quick-switch-current]"));

  sections.forEach((section) => {
    if (section.dataset.quickSwitchReady === "true") return;
    section.dataset.quickSwitchReady = "true";

    const currentSlug = section.dataset.quickSwitchCurrent;
    const container = section.querySelector<HTMLElement>("[data-quick-switch-recent]");
    if (!currentSlug || !container) return;

    const recent = readRecentTools()
      .filter((item) => item.slug && item.slug !== currentSlug)
      .slice(0, 4);

    if (recent.length === 0) return;

    container.innerHTML = recent
      .map(
        (item) => `
          <a href="${withBasePath(`/${item.slug}#calculator`)}" class="quick-switch-recent-pill" data-calculator-switch-link>
            <span>${item.title}</span>
          </a>
        `
      )
      .join("");
  });
};

document.addEventListener("astro:page-load", initCalculatorQuickSwitch);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCalculatorQuickSwitch, { once: true });
} else {
  initCalculatorQuickSwitch();
}

export {};
