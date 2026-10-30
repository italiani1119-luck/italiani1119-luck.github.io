(() => {
  const list = document.querySelector(".project-tabs__list");
  if (!list) return;

  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  const panels = tabs
    .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
    .filter(Boolean);
  const defaultTitle = document.title;
  const titles = {
    alibaba: "Alibaba conversion study — where a high-value order stalls | Ita Liani",
    rfq: "1688 RFQ — four quotes, one defensible award | Ita Liani"
  };
  let current = null;

  const nameOf = (tab) => tab.dataset.projectTab;

  const activate = (name, { focus = false, updateHash = true } = {}) => {
    const selected = tabs.find((tab) => nameOf(tab) === name);
    if (!selected) return;

    tabs.forEach((tab) => {
      const on = tab === selected;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });

    const panelId = selected.getAttribute("aria-controls");
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });

    current = name;
    document.title = titles[name] || defaultTitle;
    if (updateHash) history.replaceState(null, "", `#${name}`);
  };

  const nameFromHash = () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash === "rfq" || hash.startsWith("r-")) return "rfq";
    return "alibaba";
  };

  const targetFromHash = () => {
    const hash = window.location.hash;
    if (!hash || hash === "#") return null;
    try {
      return document.querySelector(hash);
    } catch (error) {
      return null;
    }
  };

  activate(nameFromHash(), { updateHash: false });

  let userMoved = false;
  const markMoved = () => {
    userMoved = true;
  };
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((type) =>
    window.addEventListener(type, markMoved, { passive: true, once: true })
  );

  const scrollToHash = () => {
    const target = targetFromHash();
    if (target) target.scrollIntoView({ block: "start" });
  };

  if (targetFromHash()) {
    requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
    const settle = () => {
      if (!userMoved) requestAnimationFrame(scrollToHash);
    };
    window.addEventListener("load", settle);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activate(nameOf(tab));
    });
  });

  list.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;

    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;

    event.preventDefault();
    activate(nameOf(tabs[next]), { focus: true });
  });

  window.addEventListener("hashchange", () => {
    const name = nameFromHash();
    if (name === current) return;
    activate(name, { updateHash: false });
    requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
  });
})();
