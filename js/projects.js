/* ============ PROJECTS: single source of truth ============
   Add or edit projects HERE only. Both pages read this list:
     - index.html    shows the `featured` ones (max FEATURED_MAX), in this order
     - projects.html shows every project, with category filters
   category: "web" | "mobile" | "ai"  (a filter pill appears per category in use)
   featured: true to show it on the home page; the first FEATURED_MAX win.
   img: 16:9 image, ~1600x900. */
const FEATURED_MAX = 6;

const PROJECTS = [
  {
    title: "Stocarbon",
    category: "web",   // web | mobile | ai
    label: "Website",
    desc: "First crowd platform for carbon stock in Indonesia, connecting landowners with companies offsetting emissions.",
    tags: ["Web", "Landing Page"],
    href: "https://stocarbon-landing.vercel.app/",
    img: "assets/images/stocarbon.jpg",
    alt: "Stocarbon landing page",
    featured: true,
  },
  {
    title: "Budget-in Aja",
    category: "web",   // web | mobile | ai
    label: "Website",
    desc: "A web app that helps students plan budget-friendly meals for the week.",
    tags: ["Golang", "MySQL", "HTML", "CSS", "JS"],
    href: "https://budget-in-aja.vercel.app/",
    img: "assets/images/budgetin.jpg",
    alt: "Budget-in Aja homepage",
    featured: true,
  },
  {
    title: "Waveline",
    category: "web",   // web | mobile | ai
    label: "Website",
    desc: "IoT-powered web platform for early stroke detection.",
    tags: ["Web", "IoT"],
    href: "https://wavelineaja.vercel.app/",
    img: "assets/images/waveline.jpg",
    alt: "Waveline stroke-detection website",
    featured: true,
  },
  {
    title: "ttery",
    category: "mobile",   // web | mobile | ai
    label: "iOS App",
    desc: "Playful iOS energy tracker, spend your daily battery on tasks, recharge with rest. Live on TestFlight.",
    tags: ["iOS", "Swift", "TestFlight"],
    href: "https://testflight.apple.com/join/XCR6herP",
    img: "assets/images/ttery.jpg",
    alt: "ttery iOS app — settings, logo, and pick-a-task screens",
    featured: true,
  },
  {
    title: "StitchTab",
    category: "mobile",   // web | mobile | ai
    label: "UI Design",
    desc: "Crochet companion, learn stitches, browse patterns, and follow them row by row.",
    tags: ["iOS", "Swift"],
    href: "https://github.com/imeldamayanti",
    img: "assets/images/stitchtab.jpg",
    alt: "StitchTab iOS app — explore patterns, stitch library, and pattern steps",
    featured: true,
  },
  {
    title: "KIDA",
    category: "mobile",   // web | mobile | ai
    label: "iOS App",
    desc: "Kids' AR app, scan everyday objects and they come alive to chat and teach. See it, know it, love it.",
    tags: ["iOS", "Swift", "AR"],
    href: "https://apps.apple.com/id/app/kida/id6788231771",
    img: "assets/images/kida.jpg?v=2",
    alt: "KIDA iOS app — scan, AR chat, and collection screens",
    featured: true,
  },
];

const ARROW_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function projectCard(p) {
  const tags = (p.tags || []).map((t) => `<li>${esc(t)}</li>`).join("");
  return `<article class="proj proj--card reveal" data-category="${esc(p.category)}">
  <a class="proj__media" href="${esc(p.href)}" target="_blank" rel="noopener"><img src="${esc(p.img)}" alt="${esc(p.alt)}" loading="lazy" /><span class="proj__title-hover">${esc(p.title)}</span><span class="proj__arrow" aria-hidden="true">${ARROW_SVG}</span></a>
  <div class="proj__body">
    <div class="proj__meta"><h3>${esc(p.title)}</h3><span class="label">${esc(p.label)}</span></div>
    <p class="proj__desc">${esc(p.desc)}</p>
    <ul class="proj__stack" aria-label="Tags">${tags}</ul>
  </div>
</article>`;
}

/* data-projects="featured" | "all" on the grid decides which list to render */
(function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  const list =
    grid.dataset.projects === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.featured).slice(0, FEATURED_MAX);
  grid.innerHTML = list.map(projectCard).join("\n");
})();
