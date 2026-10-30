/* =========================================================
   Ita Liani — portfolio interactions
   ========================================================= */

// TODO: replace these two values with the exact profile URLs.
const LINKS = {
  linkedin: "https://www.linkedin.com/search/results/people/?keywords=Ita%20Liani",
  upwork: "https://www.upwork.com/"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* ---------- profile links ---------- */
$$("[data-link]").forEach((el) => {
  const key = el.dataset.link;
  if (!LINKS[key]) return;
  el.href = LINKS[key];
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- year ---------- */
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

/* ---------- header, progress ---------- */
const header = $("#header");
const progress = $("#progress");

const onScroll = () => {
  const y = window.scrollY || 0;
  if (header) header.classList.toggle("is-scrolled", y > 8);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- mobile menu ---------- */
const menuBtn = $("#menuBtn");
const nav = $("#siteNav");

const closeMenu = () => {
  if (!menuBtn || !nav) return;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
  nav.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
};

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    menuBtn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("no-scroll", !open);
  });

  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* ---------- reveal on scroll ---------- */
const revealTargets = $$(
  ".hero__copy, .snapshot, .section__head, .card, .case__head, .case__copy, .case__evidence, .shot, .principle, .experience__aside, .job, .capabilities, .facts, .contact h2, .contact__lede, .contact__actions, .contact__grid"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-in"));
}

/* ---------- lightbox ---------- */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxCaption = $("#lightboxCaption");
const lightboxClose = $("#lightboxClose");
let lastTrigger = null;

const openLightbox = (button) => {
  if (!lightbox || !lightboxImg) return;
  const img = $("img", button);
  lightboxImg.src = button.dataset.full || (img ? img.src : "");
  lightboxImg.alt = img ? img.alt : "";
  lightboxCaption.textContent = button.dataset.caption || (img ? img.alt : "");
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  lastTrigger = button;
  if (lightboxClose) lightboxClose.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lightboxImg) lightboxImg.removeAttribute("src");
  if (lastTrigger) lastTrigger.focus();
};

$$(".figure__btn").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});

/* ---------- copy email ---------- */
$$("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = original; }, 2000);
  });
});
