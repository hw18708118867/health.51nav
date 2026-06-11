type SavedPreference = {
  name: string;
  notes: string;
  topics: string[];
  savedAt: string;
};

const STORAGE_KEY = "healthcalchub:updates-preference";

const readPreference = (): SavedPreference | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedPreference;
  } catch {
    return null;
  }
};

const initUpdatesPreference = () => {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-updates-preference]"));

  sections.forEach((section) => {
    const form = section.querySelector<HTMLFormElement>("[data-updates-form]");
    const feedback = section.querySelector<HTMLElement>("[data-updates-feedback]");
    if (!form || !feedback) return;

    const saved = readPreference();
    if (saved) {
      const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
      const notesInput = form.elements.namedItem("notes") as HTMLTextAreaElement | null;
      if (nameInput) nameInput.value = saved.name;
      if (notesInput) notesInput.value = saved.notes;

      const topicInputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="topics"]'));
      topicInputs.forEach((input) => {
        input.checked = saved.topics.includes(input.value);
      });

      feedback.textContent = `Saved locally on ${new Date(saved.savedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}. You can update it anytime on this device.`;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const topics = formData.getAll("topics").map((topic) => String(topic));
      const payload: SavedPreference = {
        name: String(formData.get("name") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        topics,
        savedAt: new Date().toISOString()
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      feedback.textContent = "Preferences saved locally in this browser. When a real updates system is added, this can become the first step of signup.";
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUpdatesPreference, { once: true });
} else {
  initUpdatesPreference();
}

export {};
