document.documentElement.classList.add("js");

/* ============ INTRO LOADER (text in → blocks drop) ============ */
(function loader() {
  const l = document.getElementById("loader");
  if (!l) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { l.remove(); return; }

  document.body.classList.add("loading");
  const txt = l.querySelector(".loader__text");
  txt.innerHTML = txt.textContent
    .split("")
    .map((c, i) =>
      `<span class="ch" style="transition-delay:${(i * 0.05).toFixed(2)}s">${c === " " ? "&nbsp;" : c}</span>`
    )
    .join("");

  setTimeout(() => l.classList.add("in"), 30);     // letters rise in
  setTimeout(() => l.classList.add("drop"), 1500); // text out, columns fall
  setTimeout(() => {
    l.remove();
    document.body.classList.remove("loading");
  }, 2650);
})();

/* dev helper: /?y=1200 jumps to a scroll offset on load */
const yParam = new URLSearchParams(location.search).get("y");
if (yParam) {
  addEventListener("load", () =>
    window.scrollTo({ top: +yParam, behavior: "instant" })
  );
}

/* ============ NAV: shrink to floating pill on scroll ============ */
(function navPill() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  let ticking = false;
  function update() {
    nav.classList.toggle("nav--pill", scrollY > 120);
  }
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    },
    { passive: true }
  );
  update();
})();

/* ============ THEME TOGGLE ============ */
/* dark is the default; the choice is remembered. the saved theme is applied by a
   tiny inline script in <head> so the page never flashes the wrong colors. */
(function themeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => {
    const light = root.dataset.theme === "light";
    btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  };
  sync();
  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
})();

/* ============ FOOTER HEADLINE WORD ============ */
/* cycles the highlighted word; with reduced motion it just stays on the first one */
(function rotor() {
  const words = [...document.querySelectorAll(".rotor__word")];
  if (words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i = 0;
  setInterval(() => {
    words[i].classList.remove("is-on");
    i = (i + 1) % words.length;
    words[i].classList.add("is-on");
  }, 2400);
})();

/* ============ NAV: dot under the current section ============ */
(function navSpy() {
  const links = [...document.querySelectorAll(".nav__links a[href^='#']")];
  if (!links.length) return;
  const targets = links
    .map((a) => ({ a, el: a.getAttribute("href") === "#home" ? document.querySelector(".hero") : document.querySelector(a.getAttribute("href")) }))
    .filter((t) => t.el);
  let ticking = false;
  function update() {
    const line = innerHeight * 0.35;
    let current = targets[0];
    for (const t of targets) if (t.el.getBoundingClientRect().top <= line) current = t;
    // at the very bottom the last link (Contact) should win
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = targets[targets.length - 1];
    links.forEach((a) => a.classList.toggle("is-active", a === current.a));
  }
  addEventListener("scroll", () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* ============ MOBILE MENU ============ */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

/* ============ SCROLL REVEALS ============ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============ PROJECT FILTERS ============ */
/* pills are built from the cards' data-category, so a category with no
   projects never shows (add an `ai` card and its pill appears on its own) */
(function projectFilters() {
  const bar = document.getElementById("projectFilters");
  const cards = [...document.querySelectorAll("#projectGrid .proj")];
  if (!bar || !cards.length) return;

  const LABELS = { web: "Web", mobile: "Mobile", ai: "AI" };
  const present = Object.keys(LABELS).filter((k) =>
    cards.some((c) => c.dataset.category === k)
  );
  if (present.length < 2) { bar.remove(); return; }

  const options = [["all", "All", cards.length]].concat(
    present.map((k) => [k, LABELS[k], cards.filter((c) => c.dataset.category === k).length])
  );
  bar.innerHTML = options
    .map(([k, label, n]) =>
      `<button type="button" class="filter" data-filter="${k}" aria-pressed="${k === "all"}">${label}<span class="filter__count">${n}</span></button>`
    )
    .join("");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    const key = btn.dataset.filter;
    bar.querySelectorAll(".filter").forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn))
    );
    for (const c of cards) {
      const show = key === "all" || c.dataset.category === key;
      c.hidden = !show;
      c.classList.remove("proj--in");
      if (show) {
        c.classList.add("is-visible");
        revealObserver.unobserve(c);
        void c.offsetWidth; // restart the animation
        c.classList.add("proj--in");
      }
    }
  });
})();

/* ============ TIMELINE PROGRESS ============ */
/* line fills and nodes light up as they pass mid-viewport */
(function timeline() {
  const tl = document.querySelector(".timeline");
  if (!tl || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const progress = tl.querySelector(".timeline__progress");
  const items = [...tl.querySelectorAll(":scope > li")]; // timeline entries only, not bullet lists inside cards

  function update() {
    const r = tl.getBoundingClientRect();
    const mid = innerHeight * 0.55;
    const p = Math.min(Math.max((mid - r.top - 28) / (r.height - 56), 0), 1);
    progress.style.height = p * (r.height - 56) + "px";
    for (const li of items) {
      const n = li.querySelector(".timeline__node").getBoundingClientRect();
      li.classList.toggle("is-active", n.top + n.height / 2 <= mid);
    }
  }

  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    },
    { passive: true }
  );
  addEventListener("resize", update);
  addEventListener("load", update);
  update();
})();

