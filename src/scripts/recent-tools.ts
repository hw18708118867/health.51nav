type RecentTool = {
  category: string;
  slug?: string;
  title: string;
  url: string;
  visitedAt: string;
};

type Suggestion = {
  category: string;
  slug: string;
  title: string;
  url: string;
};

const iconMarkup = (slug?: string) =>
  slug
    ? `<span class="tool-icon-shell tool-icon-shell-sm ${slug.includes("pregnancy") || slug.includes("ovulation") || slug.includes("due-date") ? "tool-icon-pregnancy" : slug.includes("calorie") || slug.includes("macro") || slug.includes("carb") || slug.includes("fat") || slug.includes("fiber") ? "tool-icon-nutrition" : slug.includes("bmi") || slug.includes("bmr") || slug.includes("tdee") || slug.includes("body-fat") || slug.includes("lean-body-mass") || slug.includes("ideal-weight") || slug.includes("protein") || slug.includes("water-intake") ? "tool-icon-fitness" : "tool-icon-health"}"><span class="tool-icon-initial">${slug.split("-")[0].slice(0, 2).toUpperCase()}</span></span>`
    : `<span class="tool-icon-shell tool-icon-shell-sm tool-icon-health"><span class="tool-icon-initial">HC</span></span>`;

const STORAGE_KEY = "healthcalchub:recent-tools";

const readRecentTools = (): RecentTool[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentTool[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initRecentTools = () => {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-recent-tools]"));

  sections.forEach((section) => {
    if (section.dataset.recentToolsReady === "true") return;
    section.dataset.recentToolsReady = "true";

    const rawSuggestions = section.dataset.suggestions;
    if (!rawSuggestions) return;

    const suggestions = JSON.parse(rawSuggestions) as Suggestion[];
    const container = section.querySelector<HTMLElement>("[data-recent-tools-list]");
    if (!container) return;

    const recent = readRecentTools();

    if (recent.length > 0) {
      container.innerHTML = recent
        .slice(0, 6)
        .map(
          (item) => `
            <a href="${item.url}" class="surface-card brand-frame block p-5 transition hover:-translate-y-1">
              <div class="flex items-start justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-pine">${item.category}</p>
                ${iconMarkup(item.slug)}
              </div>
              <h3 class="mt-3 text-xl font-bold text-ink">${item.title}</h3>
              <p class="mt-3 text-sm leading-7 text-ink/70">Last opened ${new Date(item.visitedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}</p>
            </a>
          `
        )
        .join("");
      return;
    }

    container.innerHTML = suggestions
      .slice(0, 3)
      .map(
        (item) => `
          <a href="${item.url}" class="tinted-panel tinted-panel-sage block p-5 transition hover:-translate-y-1">
            <div class="flex items-start justify-between gap-3">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-pine">${item.category}</p>
              ${iconMarkup(item.slug)}
            </div>
            <h3 class="mt-3 text-xl font-bold text-ink">${item.title}</h3>
            <p class="mt-3 text-sm leading-7 text-ink/70">Use a tool and it will appear here for quick return access.</p>
          </a>
        `
      )
      .join("");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRecentTools, { once: true });
} else {
  initRecentTools();
}

document.addEventListener("astro:page-load", initRecentTools);

export {};
