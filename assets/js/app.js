/* UEI Lab website — rendering + language switching.
   Content lives in /data/*.js; interface text in assets/js/i18n.js.
   You normally don't need to edit this file. */
(function () {
  "use strict";

  const U = window.UEI || {};
  const S = U.site || {};
  const STR = U.strings || { en: {} };
  const LANGS = ["ko", "en"];
  const STORE_KEY = "uei-language-ko-default";

  /* ------------------------------------------------------------------
     Language
     ------------------------------------------------------------------ */
  function detectLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    try {
      const s = localStorage.getItem(STORE_KEY);
      if (LANGS.includes(s)) return s;
    } catch (e) { /* storage unavailable */ }
    return S.defaultLanguage || "ko";
  }
  let lang = detectLang();

  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* ignore */ }
    const url = new URL(location.href);
    url.searchParams.set("lang", next);
    try { history.replaceState(null, "", url); } catch (e) { /* file preview */ }
    renderAll();
    const active = document.querySelector(`[data-lang="${next}"]`);
    if (active) active.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // bilingual value → text for the current language
  const tx = (v) => {
    if (v == null) return "";
    if (typeof v === "string" || typeof v === "number") return String(v);
    return v[lang] != null ? v[lang] : (v.en != null ? v.en : "");
  };
  const other = (v) => (v && typeof v === "object") ? (lang === "en" ? v.ko : v.en) || "" : "";
  const ui = (k) => (STR[lang] && STR[lang][k] != null ? STR[lang][k] : (STR.en[k] != null ? STR.en[k] : k));

  // internal link that keeps the current language
  function href(target) {
    const [path, hash] = target.split("#");
    const q = "?lang=" + lang;
    return path + q + (hash ? "#" + hash : "");
  }

  function initials(name) {
    const en = (name && typeof name === "object") ? (name.en || "") : String(name || "");
    return en.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  function formatDate(iso) {
    const parts = String(iso).split("-");
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    const options = { year: "numeric" };
    if (parts.length > 1) options.month = "short";
    if (parts.length > 2) options.day = "numeric";
    return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US",
      options).format(date);
  }

  function groupByYear(items, getYear) {
    const map = new Map();
    items.forEach((it) => {
      const y = getYear(it);
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(it);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }

  function photoHTML(person, cls) {
    if (person.photo) {
      return `<img class="${cls}" src="${esc(person.photo)}" alt="${esc(tx(person.name))}" loading="lazy">`;
    }
    return `<div class="${cls} is-initials" aria-hidden="true"><span>${esc(person.placeholderLabel || initials(person.name))}</span></div>`;
  }

  /* ------------------------------------------------------------------
     Header & footer
     ------------------------------------------------------------------ */
  const NAV = ["research", "people", "publications", "news", "contact"];

  function renderHeader() {
    const page = document.body.dataset.page;
    $("#site-header").innerHTML = `
      <a class="skip-link" href="#main">${ui("skip")}</a>
      <header class="site-header">
        <div class="wrap header-inner">
          <a class="brand" href="${href("index.html")}">
            ${S.logo ? `<svg class="brand-mark" viewBox="176 177 672 931" aria-hidden="true" focusable="false"><image href="${esc(S.logo)}" width="1024" height="1536" /></svg>` : ""}
            <span class="brand-text">
              <span class="brand-short" lang="en">${esc(S.brandName || S.shortName || "")}</span>
              <span class="brand-long">${esc(tx(S.brandSubtitle || S.name))}</span>
            </span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span class="sr-only">${ui("menu")}</span><span class="nav-toggle-bars" aria-hidden="true"></span>
          </button>
          <nav id="site-nav" class="site-nav" aria-label="${esc(ui("menu"))}">
            <ul class="nav-list">
              ${NAV.map((k) => `<li><a href="${href(k + ".html")}"${page === k ? ' aria-current="page"' : ""}>${ui("nav_" + k)}</a></li>`).join("")}
            </ul>
          </nav>
          <div class="lang-switch" role="group" aria-label="${esc(ui("language"))}">
            <button type="button" data-lang="ko" lang="ko" aria-pressed="${lang === "ko"}">한국어</button>
            <button type="button" data-lang="en" lang="en" aria-label="English" aria-pressed="${lang === "en"}"><span class="lang-full">English</span><span class="lang-short" aria-hidden="true">ENG</span></button>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    const c = S.contact || {};
    const L = S.links || {};
    const links = [
      L.scholar ? `<li><a href="${esc(L.scholar)}" target="_blank" rel="noopener">Google Scholar</a></li>` : "",
      L.github ? `<li><a href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a></li>` : ""
    ].join("");
    $("#site-footer").innerHTML = `
      <footer class="site-footer">
        <div class="wrap footer-grid">
          <div class="footer-id">
            <strong>${esc(tx(S.name))}</strong>
            <span>${esc(tx(S.affiliation))}</span>
          </div>
          <address class="footer-contact">
            ${esc(tx(c.address))}<br>
            ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ""}
            ${c.phone ? `<br>${esc(c.phone)}` : ""}
          </address>
          ${links ? `<ul class="footer-links">${links}</ul>` : ""}
        </div>
        <div class="wrap footer-base">© ${new Date().getFullYear()} ${esc(S.shortName || "")}. ${ui("rights")}</div>
      </footer>`;
  }

  function pageHead(key, lead) {
    return `<header class="page-head wrap">
      <h1>${ui("nav_" + key)}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
    </header>`;
  }

  /* ------------------------------------------------------------------
     Publications helpers (shared by Home and Publications)
     ------------------------------------------------------------------ */
  const labNames = (() => {
    const set = new Set((S.highlightAuthors || []).map((s) => s.trim()));
    const add = (n) => { if (n && typeof n === "object") { if (n.en) set.add(n.en); if (n.ko) set.add(n.ko); } };
    const P = U.people || {};
    if (P.pi) add(P.pi.name);
    (P.groups || []).forEach((g) => (g.members || []).forEach((m) => add(m.name)));
    (P.alumni || []).forEach((a) => add(a.name));
    return set;
  })();

  function authorsHTML(authors) {
    if (!Array.isArray(authors)) {
      const names = [...labNames].filter(Boolean).sort((a,b) => b.length - a.length);
      const escapePattern = (value) => esc(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = names.map(escapePattern).join("|");
      return pattern ? esc(authors || "").replace(new RegExp(pattern, "g"), "<strong>$&</strong>") : esc(authors || "");
    }
    const list = authors;
    return list.map((a) => {
      const corr = /\*$/.test(a);
      const name = a.replace(/\*$/, "").trim();
      const inner = esc(name) + (corr ? "<sup>*</sup>" : "");
      return labNames.has(name) ? `<strong>${inner}</strong>` : inner;
    }).join(", ");
  }

  function pubLink(p) {
    return p.url || (p.doi ? "https://doi.org/" + p.doi : "") || p.pdf || "";
  }

  function citationHTML(p) {
    let s = p.venue ? `<em>${esc(p.venue)}</em>` : "";
    if (p.volume) s += `, ${esc(p.volume)}`;
    if (p.pages) s += `, ${esc(p.pages)}`;
    return s + (s ? ", " : "") + esc(p.year);
  }

  function linksHTML(p) {
    const out = [];
    if (p.doi) out.push(`<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
    if (p.url && !p.doi) out.push(`<a href="${esc(p.url)}" target="_blank" rel="noopener">Link</a>`);
    if (p.pdf) out.push(`<a href="${esc(p.pdf)}" target="_blank" rel="noopener">PDF</a>`);
    if (p.code) out.push(`<a href="${esc(p.code)}" target="_blank" rel="noopener">Code</a>`);
    return out.length ? `<p class="pub-links">${out.join("")}</p>` : "";
  }

  function authorRoleHTML(p) {
    const role = {
      "co-first": "role_co_first",
      "corresponding": "role_corresponding"
    }[p.labAuthorRole];
    if (!role) return "";
    return `<span class="badge badge-author-role">${lang === "ko" ? "유철희" : "Cheolhee Yoo"} · ${esc(ui(role))}</span>`;
  }

  function badgesHTML(p) {
    const b = [`<span class="badge badge-type">${ui("type_" + (p.type || "other"))}</span>`];
    if (p.index) b.push(`<span class="badge badge-index">${esc(p.index)}</span>`);
    if (p.award) b.push(`<span class="badge badge-award">${esc(tx(p.award))}</span>`);
    if (p.labAuthorRole) b.push(authorRoleHTML(p));
    return `<p class="pub-badges">${b.join("")}</p>`;
  }

  function sortedPubs() {
    return (U.publications || []).map((p, i) => ({ p, i }))
      .sort((a, b) => (b.p.year - a.p.year) || (a.i - b.i))
      .map((x) => x.p);
  }

  /* ------------------------------------------------------------------
     HOME
     ------------------------------------------------------------------ */
  let sliderTimer = null;

  function renderHome(main) {
    const heroes = S.heroImages || [];
    const areas = (U.research && U.research.areas) || [];
    const news = (U.news || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
    const pubs = sortedPubs().slice(0, 5);

    main.innerHTML = `
      <section class="hero">
        <div class="hero-media" aria-hidden="true">
          ${heroes.map((src, i) => `<img src="${esc(src)}" alt="" class="${i === 0 ? "is-active" : ""}"${i ? ' loading="lazy"' : ""}>`).join("")}
        </div>
        <div class="wrap hero-text">
          ${S.universityLogo ? `<img class="hero-university-logo" src="${esc(S.universityLogo.image)}" alt="${esc(tx(S.universityLogo.alt))}" width="1350" height="340">` : ""}
          ${lang === "ko" ? `<p class="hero-eyebrow" lang="en">${esc(S.brandName)}</p>` : ""}
          <h1 class="hero-title">${esc(tx(S.name))}</h1>
          <p class="hero-tagline">${esc(tx(S.tagline))}</p>
          <p class="hero-affil">${esc(tx(S.heroAffiliation || S.affiliation))}</p>
        </div>
        ${heroes.length > 1 ? `<div class="wrap hero-dots">${heroes.map((_, i) =>
          `<button type="button" aria-label="${esc(ui("slide"))} ${i + 1}" aria-pressed="${i === 0}"></button>`).join("")}</div>` : ""}
      </section>

      ${S.imageryPanel?.panels?.length ? `<section class="home-imagery" id="busan-imagery" aria-label="${esc(tx(S.imageryPanel.title))}">
        ${S.imageryPanel.panels.map((p) => `<button type="button" class="imagery-tile" aria-expanded="false"
          aria-label="${esc(tx(p.title))} · ${esc(tx(p.subtitle))}" aria-controls="imagery-overlay-${esc(p.id)}"
          aria-describedby="imagery-description-${esc(p.id)}">
          <img src="${esc(p.image)}" alt="${esc(tx(p.alt))}" width="${p.width}" height="${p.height}" loading="lazy">
          <span class="imagery-overlay" id="imagery-overlay-${esc(p.id)}">
            <span class="imagery-title">${esc(tx(p.title))}</span>
            <span class="imagery-subtitle">${esc(tx(p.subtitle))}</span>
            <span class="imagery-description" id="imagery-description-${esc(p.id)}">${esc(tx(p.description))}</span>
          </span>
        </button>`).join("")}
      </section>` : ""}

      <section class="section wrap split">
        <h2 class="split-title">${ui("about")}</h2>
        <div class="prose prose-lg">${tx(S.intro)}</div>
      </section>

      <section class="section wrap">
        <div class="section-head">
          <h2>${ui("research_areas")}</h2>
          <a class="more" href="${href("research.html")}">${ui("see_research")}</a>
        </div>
        <ul class="area-grid">
          ${areas.map((a) => `<li><a class="area" href="${href("research.html#" + a.id)}">
            <h3>${esc(tx(a.title))}</h3>
            <p>${esc(tx(a.summary))}</p>
          </a></li>`).join("")}
        </ul>
      </section>

      <section class="section wrap feeds">
        <div>
          <div class="section-head">
            <h2>${ui("latest_news")}</h2>
            <a class="more" href="${href("news.html")}">${ui("all_news")}</a>
          </div>
          <ul class="mini-list">
            ${news.map((n) => `<li>
              <time datetime="${esc(n.date)}">${formatDate(n.date)}</time>
              <a href="${href("news.html#n-" + n.date)}">${esc(tx(n.title))}</a>
            </li>`).join("")}
          </ul>
        </div>
        <div>
          <div class="section-head">
            <h2>${ui("recent_pubs")}</h2>
            <a class="more" href="${href("publications.html")}">${ui("all_pubs")}</a>
          </div>
          <ul class="mini-list mini-list--pubs">
            ${pubs.map((p) => `<li>
              <span class="mini-meta">${esc(p.year)}</span>
              <a href="${href("publications.html#" + p.year)}">${esc(p.title)}</a>
              <span class="mini-venue">${esc(p.venue || "")}</span>
            </li>`).join("")}
          </ul>
        </div>
      </section>`;

    startSlider(main.querySelector(".hero"));
    setupImagery(main.querySelector(".home-imagery"));
  }

  function setupImagery(section) {
    if (!section) return;
    const tiles = [...section.querySelectorAll(".imagery-tile")];
    const reveal = (tile, open) => {
      if (open) tiles.forEach((other) => other.setAttribute("aria-expanded", "false"));
      tile.setAttribute("aria-expanded", String(open));
    };
    tiles.forEach((tile) => {
      tile.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") reveal(tile, true);
      });
      tile.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "mouse" && !tile.matches(":focus-visible")) reveal(tile, false);
      });
      tile.addEventListener("focus", () => {
        if (tile.matches(":focus-visible")) reveal(tile, true);
      });
      tile.addEventListener("blur", () => reveal(tile, false));
      tile.addEventListener("click", () => reveal(tile, tile.getAttribute("aria-expanded") !== "true"));
      tile.addEventListener("keydown", (event) => {
        if (event.key === "Escape") reveal(tile, false);
      });
    });
  }

  function startSlider(hero) {
    clearInterval(sliderTimer);
    if (!hero) return;
    const imgs = hero.querySelectorAll(".hero-media img");
    const dots = hero.querySelectorAll(".hero-dots button");
    if (imgs.length < 2) return;
    let i = 0;
    const go = (n) => {
      imgs[i].classList.remove("is-active");
      dots[i].setAttribute("aria-pressed", "false");
      i = (n + imgs.length) % imgs.length;
      imgs[i].classList.add("is-active");
      dots[i].setAttribute("aria-pressed", "true");
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => { clearInterval(sliderTimer); if (!reduce) sliderTimer = setInterval(() => go(i + 1), 7000); };
    dots.forEach((d, k) => d.addEventListener("click", () => { go(k); run(); }));
    run();
  }

  /* ------------------------------------------------------------------
     RESEARCH
     ------------------------------------------------------------------ */
  function renderResearch(main) {
    const R = U.research || {};
    const projects = R.projects || [];
    main.innerHTML = `
      ${pageHead("research", esc(tx(R.intro)))}
      <div class="wrap">
        ${(R.areas || []).map((a) => `
          <article class="research-item" id="${esc(a.id)}">
            <div class="research-heading">
              ${a.image ? `<img class="research-illustration" src="${esc(a.image)}" alt="" width="240" height="160" loading="lazy">` : ""}
              <h2 class="research-title">${esc(tx(a.title))}</h2>
            </div>
            <div class="research-body">
              <div class="prose">${tx(a.body) || `<p>${esc(tx(a.summary))}</p>`}</div>
              ${(a.keywords || []).length ? `<ul class="tags">${a.keywords.map((k) => `<li>${esc(tx(k))}</li>`).join("")}</ul>` : ""}
            </div>
          </article>`).join("")}
      </div>
      ${projects.length ? `
      <section class="section wrap">
        <h2 class="section-title">${ui("projects")}</h2>
        <div class="table-scroll">
          <table class="projects">
            <thead><tr><th scope="col">${ui("period")}</th><th scope="col">${ui("project")}</th><th scope="col">${ui("funder")}</th></tr></thead>
            <tbody>
              ${projects.map((p) => `<tr>
                <td class="nowrap">${esc(tx(p.period))}</td>
                <td>${esc(tx(p.title))}</td>
                <td>${esc(tx(p.funder))}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>` : ""}`;
  }

  /* ------------------------------------------------------------------
     PEOPLE
     ------------------------------------------------------------------ */
  function renderPeople(main) {
    const P = U.people || {};
    const pi = P.pi;
    const L = S.links || {};
    const cvList = (items) => `<ul class="cv-list">${(items || []).map((e) =>
      `<li><span class="cv-year">${esc(tx(e.year))}</span><span>${esc(tx(e.text))}</span></li>`).join("")}</ul>`;

    const piHTML = pi ? `
      <section class="wrap pi" aria-labelledby="pi-name">
        ${photoHTML(pi, "pi-photo")}
        <div class="pi-info">
          <p class="pi-role">${ui("pi")}</p>
          <h2 id="pi-name" class="pi-name">${esc(tx(pi.name))}${other(pi.name) ? ` <span class="alt-name">${esc(other(pi.name))}</span>` : ""}</h2>
          <p class="pi-position">${esc(tx(pi.position))} · ${esc(tx(pi.affiliation || S.affiliation))}</p>
          <ul class="pi-contact">
            ${pi.email ? `<li><a href="mailto:${esc(pi.email)}">${esc(pi.email)}</a></li>` : ""}
            ${pi.office ? `<li>${ui("office")}: ${esc(tx(pi.office))}</li>` : ""}
            ${pi.cv ? `<li><a href="${esc(pi.cv)}" target="_blank" rel="noopener">${ui("cv")}</a></li>` : ""}
            ${L.scholar ? `<li><a href="${esc(L.scholar)}" target="_blank" rel="noopener">${ui("scholar")}</a></li>` : ""}
          </ul>
          ${tx(pi.bio) ? `<div class="prose">${tx(pi.bio)}</div>` : ""}
          <div class="pi-cv">
            <div><h3>${ui("education")}</h3>${cvList(pi.education)}</div>
            <div><h3>${ui("experience")}</h3>${cvList(pi.experience)}</div>
            ${(pi.editorial || []).length ? `<div><h3>${ui("editorial")}</h3>${cvList(pi.editorial)}</div>` : ""}
          </div>
        </div>
      </section>` : "";

    const groupsHTML = (P.groups || []).filter((g) => (g.members || []).length).map((g) => `
      <section class="wrap member-group">
        <h2 class="section-title">${esc(tx(g.title))} <span class="count">${g.members.length}</span></h2>
        <ul class="member-grid">
          ${g.members.map((m) => `<li class="member">
            ${photoHTML(m, "member-photo")}
            <p class="member-name">${esc(tx(m.name))}${!m.placeholder && other(m.name) ? ` <span class="alt-name">${esc(other(m.name))}</span>` : ""}</p>
            <p class="member-role">${esc(tx(m.role))}</p>
            ${m.interests ? `<p class="member-interests">${esc(tx(m.interests))}</p>` : ""}
            ${m.email ? `<p class="member-email"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>` : ""}
          </li>`).join("")}
        </ul>
      </section>`).join("");

    const alumni = P.alumni || [];
    const alumniHTML = alumni.length ? `
      <section class="wrap member-group">
        <h2 class="section-title">${ui("alumni")} <span class="count">${alumni.length}</span></h2>
        <div class="table-scroll">
          <table class="alumni">
            <tbody>
              ${alumni.map((a) => `<tr>
                <th scope="row">${esc(tx(a.name))}${other(a.name) ? ` <span class="alt-name">${esc(other(a.name))}</span>` : ""}</th>
                <td>${esc(tx(a.degree))} ${esc(a.year || "")}</td>
                <td>${esc(tx(a.now))}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>` : "";

    main.innerHTML = pageHead("people", esc(ui("people_lead"))) + piHTML + groupsHTML + alumniHTML;
  }

  /* ------------------------------------------------------------------
     PUBLICATIONS — year filter + catalog of first pages + list
     ------------------------------------------------------------------ */
  const pubState = { year: "all", type: "all" };

  // Keep 2020 separate; combine publications up to 2019 in one section.
  const pubYearGroup = (year) => Number(year) < 2020 ? "before-2020" : Number(year);
  const parsePubYear = (value) => ["all", "before-2020"].includes(value) ? value : pubYearGroup(value);
  const pubYearLabel = (year) => year === "before-2020" ? ui("before_2020") : String(year);

  function readYearFromHash() {
    if (location.hash === "#before-2020") return "before-2020";
    const m = location.hash.match(/^#y?(\d{4})$/);
    return m ? pubYearGroup(m[1]) : "all";
  }

  function coverFallback(p) {
    const firstAuthors = (Array.isArray(p.authors) ? p.authors : [p.authors])
      .slice(0, 3).map((a) => String(a).replace(/\*$/, "")).join(", ");
    return `<span class="cover-fallback" aria-hidden="true">
      <span class="cf-venue">${ui("preview_unavailable")}</span>
      <span class="cf-title">${esc(p.title)}</span>
      <span class="cf-authors">${esc(firstAuthors)}</span>
      <span class="cf-lines"></span>
    </span>`;
  }

  function coverHTML(p) {
    const img = p.thumb
      ? `<img src="${esc(p.thumb)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('is-missing');this.remove()">`
      : "";
    return `<li class="cover">
      <button type="button" class="cover-btn" data-pub="${esc(p.id)}">
        <span class="cover-page${p.thumb ? "" : " is-missing"}">${img}${coverFallback(p)}</span>
        <span class="cover-venue">${esc(p.venueShort || p.venue || "")}</span>
        <span class="cover-title">${esc(p.title)}</span>
      </button>
    </li>`;
  }

  function pubItemHTML(p) {
    const link = pubLink(p);
    const title = link
      ? `<a href="${esc(link)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
      : esc(p.title);
    return `<li class="pub" id="${esc(p.id || "")}">
      ${badgesHTML(p)}
      <p class="pub-title">${title}</p>
      <p class="pub-authors">${authorsHTML(p.authors)}</p>
      <p class="pub-venue">${citationHTML(p)}</p>
      ${linksHTML(p)}
    </li>`;
  }

  function renderPublications(main) {
    const all = sortedPubs();
    // Publisher exclusion applies only to the selected-paper catalog.
    const selected = all.filter((p) => p.featured &&
      !/mdpi/i.test(p.publisher || "") && !/^10\.3390\//i.test(p.doi || "") &&
      !/(^|\/)mdpi\.com(?:\/|$)/i.test(p.url || ""));
    const years = [...new Set(all.map((p) => pubYearGroup(p.year)))].sort((a, b) =>
      (b === "before-2020" ? 2019 : b) - (a === "before-2020" ? 2019 : a));
    const types = ["journal", "conference", "book", "other"].filter((t) => all.some((p) => (p.type || "other") === t));
    if (pubState.year !== "all" && !years.includes(pubState.year)) pubState.year = "all";

    main.innerHTML = `
      ${pageHead("publications", esc(ui("pubs_lead")))}
      ${selected.length ? `<section class="wrap featured-catalog" aria-labelledby="selected-papers-title">
        <h2 class="section-title" id="selected-papers-title">${ui("featured_papers")}</h2>
        <div class="shelf">
          <ul class="shelf-row">${selected.map(coverHTML).join("")}</ul>
        </div>
      </section>` : ""}
      <div class="wrap pub-controls">
        <div class="year-tabs" role="group" aria-label="${esc(ui("year"))}">
          <button type="button" data-year="all" aria-pressed="${pubState.year === "all"}">${ui("all_years")}</button>
          ${years.map((y) => `<button type="button" data-year="${y}" aria-pressed="${pubState.year === y}">${pubYearLabel(y)}</button>`).join("")}
        </div>
        <label class="type-filter">
          <span>${ui("type")}</span>
          <select id="pub-type">
            <option value="all">${ui("all_types")}</option>
            ${types.map((t) => `<option value="${t}"${pubState.type === t ? " selected" : ""}>${ui("type_" + t)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="wrap" id="pub-results" aria-live="polite"></div>
      ${all.some(p => /\*/.test(String(p.authors))) ? `<p class="wrap pub-note">${ui("corresponding")}</p>` : ""}`;

    const results = $("#pub-results", main);

    function draw() {
      const list = all.filter((p) =>
        (pubState.type === "all" || (p.type || "other") === pubState.type) &&
        (pubState.year === "all" || pubYearGroup(p.year) === pubState.year));
      if (!list.length) {
        results.innerHTML = `<p class="empty">${ui("no_pubs")}</p>`;
        return;
      }
      results.innerHTML = years.map((y) => [y, list.filter((p) => pubYearGroup(p.year) === y)])
        .filter(([, items]) => items.length).map(([y, items]) => {
        return `<section class="yr-block" aria-labelledby="yh-${y}">
          <div class="yr-side">
            <h2 class="yr-num${y === "before-2020" ? " yr-num--archive" : ""}" id="yh-${y}">${pubYearLabel(y)}</h2>
          </div>
          <div class="yr-main">
            <ol class="pub-list">${items.map(pubItemHTML).join("")}</ol>
          </div>
        </section>`;
      }).join("");
    }

    function syncTabs() {
      main.querySelectorAll(".year-tabs button").forEach((b) => {
        const v = parsePubYear(b.dataset.year);
        b.setAttribute("aria-pressed", String(v === pubState.year));
      });
    }

    main.querySelector(".year-tabs").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-year]");
      if (!b) return;
      pubState.year = parsePubYear(b.dataset.year);
      const url = new URL(location.href);
      url.hash = pubState.year === "all" ? "" : String(pubState.year);
      history.replaceState(null, "", url);
      syncTabs();
      draw();
    });

    $("#pub-type", main).addEventListener("change", (e) => {
      pubState.type = e.target.value;
      draw();
    });

    main.querySelector(".featured-catalog")?.addEventListener("click", (e) => {
      const b = e.target.closest(".cover-btn");
      if (!b) return;
      const block = b.closest(".shelf-row");
      const ids = [...block.querySelectorAll(".cover-btn")].map((x) => x.dataset.pub);
      openLightbox(ids, ids.indexOf(b.dataset.pub), b);
    });

    draw();
  }

  /* Lightbox for the catalog */
  let lb = null;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("dialog");
    lb.className = "lightbox";
    lb.setAttribute("aria-labelledby", "paper-preview-title");
    document.body.appendChild(lb);
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", () => { if (lb._return) lb._return.focus(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); lb._step && lb._step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); lb._step && lb._step(-1); }
    });
    return lb;
  }

  function openLightbox(ids, index, returnFocus) {
    const dlg = ensureLightbox();
    const byId = new Map((U.publications || []).map((p) => [p.id, p]));
    let i = index;

    const paint = () => {
      const p = byId.get(ids[i]);
      if (!p) return;
      const link = pubLink(p);
      const img = p.thumb
        ? `<img src="${esc(p.thumb)}" alt="${esc(ui("first_page_of"))} ${esc(p.title)}" onerror="this.parentNode.classList.add('is-missing');this.remove()">`
        : "";
      dlg.innerHTML = `
        <div class="lb-inner">
          <div class="lb-media"><span class="cover-page${p.thumb ? "" : " is-missing"}">${img}${coverFallback(p)}</span></div>
          <div class="lb-info">
            <button type="button" class="lb-close" aria-label="${esc(ui("close"))}"><span aria-hidden="true">×</span></button>
            ${badgesHTML(p)}
            <h2 class="lb-title" id="paper-preview-title">${esc(p.title)}</h2>
            <p class="pub-authors">${authorsHTML(p.authors)}</p>
            <p class="pub-venue">${citationHTML(p)}</p>
            ${linksHTML(p)}
            ${p.license ? `<p class="preview-credit">${p.licenseUrl ? `<a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license)} · ${ui("preview_source")}</p>` : ""}
            ${link ? `<p><a class="btn" href="${esc(link)}" target="_blank" rel="noopener">${ui("open_paper")}</a></p>` : ""}
            ${ids.length > 1 ? `<div class="lb-nav">
              <button type="button" data-step="-1">${ui("prev")}</button>
              <span class="lb-pos">${i + 1} / ${ids.length}</span>
              <button type="button" data-step="1">${ui("next")}</button>
            </div>` : ""}
          </div>
        </div>`;
      dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
      dlg.querySelectorAll(".lb-nav button").forEach((b) =>
        b.addEventListener("click", () => step(Number(b.dataset.step))));
    };
    const step = (d) => { i = (i + d + ids.length) % ids.length; paint(); const f = dlg.querySelector(`.lb-nav [data-step="${d}"]`); if (f) f.focus(); };

    dlg._step = step;
    dlg._return = returnFocus;
    paint();
    if (!dlg.open) dlg.showModal();
    dlg.querySelector(".lb-close").focus();
  }

  /* ------------------------------------------------------------------
     NEWS
     ------------------------------------------------------------------ */
  function renderNews(main) {
    const items = (U.news || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    main.innerHTML = `
      ${pageHead("news", "")}
      <div class="wrap">
        ${groupByYear(items, (n) => Number(String(n.date).slice(0, 4))).map(([y, list]) => `
          <section class="yr-block" aria-labelledby="nh-${y}">
            <div class="yr-side"><h2 class="yr-num" id="nh-${y}">${y}</h2></div>
            <ol class="yr-main news-list">
              ${list.map((n) => `<li class="news-item" id="n-${esc(n.date)}">
                <time datetime="${esc(n.date)}">${formatDate(n.date)}</time>
                <div>
                  ${n.category ? `<p class="news-cat">${ui("cat_" + n.category)}</p>` : ""}
                  <h3 class="news-title">${esc(tx(n.title))}</h3>
                  ${n.body ? `<div class="prose">${tx(n.body)}</div>` : ""}
                  ${n.image ? `<img class="news-img" src="${esc(n.image)}" alt="" loading="lazy">` : ""}
                </div>
              </li>`).join("")}
            </ol>
          </section>`).join("")}
      </div>`;
  }

  /* ------------------------------------------------------------------
     CONTACT
     ------------------------------------------------------------------ */
  function renderContact(main) {
    const c = S.contact || {};
    const q = encodeURIComponent(c.mapQuery || tx(c.address));
    main.innerHTML = `
      ${pageHead("contact", "")}
      <section class="wrap contact-grid">
        <div class="contact-details">
          ${c.logo ? `<img class="contact-logo" src="${esc(c.logo)}" alt="${esc(S.brandName)}" width="573" height="911">` : ""}
          <dl class="contact-info">
            <dt>${ui("address")}</dt><dd>${esc(tx(c.address))}</dd>
            ${c.email ? `<dt>${ui("email")}</dt><dd><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></dd>` : ""}
            ${c.phone ? `<dt>${ui("phone")}</dt><dd>${esc(c.phone)}</dd>` : ""}
          </dl>
        </div>
        <div class="map">
          <iframe title="${esc(ui("map"))}" src="https://maps.google.com/maps?q=${q}&z=16&t=h&hl=${lang}&output=embed"
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
      <section class="section wrap split">
        <h2 class="split-title">${ui("join_title")}</h2>
        <div class="prose prose-lg">${ui("join_body")}</div>
      </section>`;
  }

  /* ------------------------------------------------------------------
     404
     ------------------------------------------------------------------ */
  function renderNotFound(main) {
    main.innerHTML = `<header class="page-head wrap">
      <h1>${ui("notfound_title")}</h1>
      <p class="lead">${ui("notfound_body")}</p>
      <p><a class="btn" href="${href("index.html")}">${ui("go_home")}</a></p>
    </header>`;
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  const PAGES = {
    home: renderHome, research: renderResearch, people: renderPeople,
    publications: renderPublications, news: renderNews, contact: renderContact, "404": renderNotFound
  };

  function renderAll() {
    const page = document.body.dataset.page || "home";
    document.documentElement.lang = lang;
    document.title = page === "home"
      ? tx(S.name)
      : (page === "404" ? ui("notfound_title") : ui("nav_" + page)) + " | " + (S.shortName || "");
    renderHeader();
    (PAGES[page] || renderHome)($("#main"));
    renderFooter();
  }

  function bindChrome() {
    const header = $("#site-header");
    header.addEventListener("click", (e) => {
      const langBtn = e.target.closest("[data-lang]");
      if (langBtn) { setLang(langBtn.dataset.lang); return; }
      const toggle = e.target.closest(".nav-toggle");
      if (toggle) {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        header.querySelector(".site-header").classList.toggle("nav-open", open);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const t = header.querySelector(".nav-toggle[aria-expanded='true']");
      if (t) { t.click(); t.focus(); }
    });
    window.addEventListener("hashchange", () => {
      if (document.body.dataset.page === "publications") {
        pubState.year = readYearFromHash();
        renderPublications($("#main"));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "publications") pubState.year = readYearFromHash();
    bindChrome();
    renderAll();
    // jump to anchors (e.g. research.html#climate) after content renders
    if (location.hash && !/^#y?\d{4}$/.test(location.hash)) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  });
})();
