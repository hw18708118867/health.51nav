import Fuse from "fuse.js";

type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: string;
  category?: string;
  keywords?: string;
};

type SearchFilter = "all" | "calculator" | "article";

const initSearchBoxes = () => {
  const boxes = Array.from(document.querySelectorAll<HTMLElement>("[data-search-index]"));

  boxes.forEach((box) => {
    if (box.dataset.searchReady === "true") return;
    box.dataset.searchReady = "true";

    const rawIndex = box.dataset.searchIndex;
    if (!rawIndex) return;

    const searchIndex = JSON.parse(rawIndex) as SearchItem[];
    const input = box.querySelector<HTMLInputElement>("#site-search-input");
    const container = box.querySelector<HTMLElement>("#site-search-results");
    const summary = box.querySelector<HTMLElement>("[data-site-search-summary]");
    const emptyState = box.querySelector<HTMLElement>("[data-site-search-empty]");
    const filterButtons = Array.from(box.querySelectorAll<HTMLButtonElement>("[data-search-filter]"));
    const typeInput = box.querySelector<HTMLInputElement>("[data-search-type-input]");

    const fuse = new Fuse<SearchItem>(searchIndex, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "category", weight: 0.2 },
        { name: "description", weight: 0.2 },
        { name: "keywords", weight: 0.1 }
      ],
      includeScore: true,
      threshold: 0.32
    });

    const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightText = (text: string, query: string) => {
      const tokens = query
        .trim()
        .split(/\s+/)
        .filter((token) => token.length > 1)
        .slice(0, 6);

      if (tokens.length === 0) return text;

      const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
      return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
    };

    const updateFilterButtons = (activeFilter: SearchFilter) => {
      filterButtons.forEach((button) => {
        const isActive = button.dataset.searchFilter === activeFilter;
        button.classList.toggle("search-filter-chip-active", isActive);
      });
      if (typeInput) typeInput.value = activeFilter;
    };

    const updateUrl = (query: string, filter: SearchFilter) => {
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      if (filter !== "all") {
        params.set("type", filter);
      } else {
        params.delete("type");
      }

      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    };

    let lastTrackedQuery = "";

    const renderEmpty = (message: string) => {
      if (!container) return;
      container.innerHTML = `<p class="text-sm leading-7 text-ink/60">${message}</p>`;
    };

    const render = (query: string, filter: SearchFilter, items: Array<{ item: SearchItem }>) => {
      if (!container) return;

      if (items.length === 0) {
        if (summary) {
          const label = filter === "all" ? "results" : filter === "calculator" ? "calculators" : "articles";
          summary.textContent = `No ${label} matched "${query}". Try a calculator name, body metric, nutrition topic, or article title.`;
        }
        if (emptyState) emptyState.hidden = false;
        renderEmpty("No results yet. Try searching BMI, calories, ovulation, hydration, sleep, or blood pressure.");
        return;
      }

      if (summary) {
        const resultLabel = items.length === 1 ? "result" : "results";
        const scopeLabel =
          filter === "all" ? "across calculators and articles" : filter === "calculator" ? "in calculators" : "in articles";
        summary.textContent = `${items.length} ${resultLabel} for "${query}" ${scopeLabel}.`;
      }
      if (emptyState) emptyState.hidden = true;

      container.innerHTML = items
        .map(
          ({ item }) => `
            <a href="${item.url}" class="surface-card brand-frame block p-5 transition hover:border-sage/35">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sage">${item.type}</p>
                ${item.category ? `<span class="rounded-full bg-mint px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pine/76">${item.category}</span>` : ""}
              </div>
              <h3 class="mt-3 text-xl font-bold text-ink">${highlightText(item.title, query)}</h3>
              <p class="mt-3 text-sm leading-7 text-ink/72">${highlightText(item.description, query)}</p>
              <div class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pine">
                Open page
                <span>→</span>
              </div>
            </a>
          `
        )
        .join("");
    };

    const getFilteredItems = (query: string, filter: SearchFilter) => {
      const results = fuse.search(query);
      if (filter === "all") return results;
      const wantedType = filter === "calculator" ? "Calculator" : "Article";
      return results.filter(({ item }) => item.type === wantedType);
    };

    const runSearch = (value: string, filter: SearchFilter, syncUrl = true) => {
      const query = value.trim();
      updateFilterButtons(filter);
      if (syncUrl) updateUrl(query, filter);

      if (!query) {
        if (summary) {
          summary.textContent = "Search calculators and articles by tool name, health topic, or everyday goal.";
        }
        if (emptyState) emptyState.hidden = false;
        renderEmpty("Start typing to search calculators and articles.");
        return;
      }

      const normalizedQuery = query.toLowerCase();
      if (normalizedQuery && normalizedQuery !== lastTrackedQuery) {
        lastTrackedQuery = normalizedQuery;
        window.gtag?.("event", "search", {
          search_term: query,
          search_type: filter
        });
      }

      render(query, filter, getFilteredItems(query, filter).slice(0, 8));
    };

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q")?.trim() ?? "";
    const initialFilterParam = params.get("type");
    const initialFilter: SearchFilter =
      initialFilterParam === "calculator" || initialFilterParam === "article" ? initialFilterParam : "all";
    if (input && initialQuery) {
      input.value = initialQuery;
    }

    runSearch(initialQuery, initialFilter, false);

    input?.addEventListener("input", () => {
      runSearch(input.value, (typeInput?.value as SearchFilter) || "all");
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextFilter = (button.dataset.searchFilter as SearchFilter) || "all";
        runSearch(input?.value ?? "", nextFilter);
      });
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearchBoxes, { once: true });
} else {
  initSearchBoxes();
}

document.addEventListener("astro:page-load", initSearchBoxes);
