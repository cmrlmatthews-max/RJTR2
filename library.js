/* ============================================================================
   LIBRARY TAB  —  ARE PcM + PjM + CE Study Aid
   Adds a "Library" tab (diagrams + audio) next to the existing tabs.
   Edit only the DIAGRAMS and AUDIO lists below; the engine needs no changes.
   ============================================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     CONTENT  —  edit these two lists. Seeded with placeholders so the
     structure is visible. Fill in `src` as you upload each file.
     Put files next to this HTML file:
       library/diagrams/your-file.png   (or .jpg / .webp / .pdf / .svg)
       library/audio/your-file.mp3      (or .m4a / .ogg)
     DIAGRAM fields: title (req) | src ("" = awaiting-upload placeholder)
       | division: "PcM" | "PjM" | "CE" (one or more) | topics: free tags
       | type: "image" | "pdf" (optional, auto-detected)
     AUDIO fields:   title (req) | src ("" = coming-soon row) | division | topics
     ---------------------------------------------------------------------- */
  const DIAGRAMS = [
    { title: "B101 Service Phases (SD → DD → CD → Bid → CA)", src: "", division: ["PcM","PjM","CE"], topics: ["Contracts"] },
    { title: "AIA Document Family Map (A/B/C/G series)",      src: "", division: ["PjM","CE"],        topics: ["Contracts"] },
    { title: "Project Delivery Methods (DBB / CMc / DB / IPD)", src: "", division: ["PcM","PjM","CE"], topics: ["Delivery"] },
    { title: "Change Instrument Decision Tree (Addendum / ASI / CO / CCD)", src: "", division: ["CE"], topics: ["CA Procedures"] },
    { title: "Pay Application Flow (G702 / G703)",            src: "", division: ["CE","PjM"],         topics: ["CA Procedures","Finance"] },
    { title: "CPM Schedule, Float & the Critical Path",       src: "", division: ["PjM"],              topics: ["Scheduling"] },
    { title: "Fee Types & Net Operating Revenue (NOR)",       src: "", division: ["PcM"],              topics: ["Finance"] },
    { title: "Risk & Insurance Matrix (GL / E&O / Bonds)",    src: "", division: ["PcM","CE"],         topics: ["Risk"] },
    { title: "Quality Control: Process vs. Inspection",       src: "", division: ["PjM","CE"],         topics: ["QC"] },
    { title: "Ethics & NCARB Rules Overview",                 src: "", division: ["PcM","PjM"],        topics: ["Ethics"] },
    { title: "SPI vs. CPI — Earned Value at a Glance",        src: "", division: ["PcM","PjM"],        topics: ["Finance","Scheduling"] },
    { title: "Substantial Completion & Closeout Timeline",    src: "", division: ["CE","PjM"],         topics: ["CA Procedures"] }
  ];

  const AUDIO = [
    { title: "Lecture 01 — Legal Foundation & Dispute Resolution", src: "library/audio/lecture-01-legal-foundation-dispute-resolution.mp3", division: ["PcM"], topics: ["Legal"] },
    { title: "Lecture 02 — Contract Law & Formation", src: "library/audio/lecture-02-contract-law-formation.mp3", division: ["PcM","PjM"], topics: ["Contracts","Legal"] },
    { title: "Lecture 03 — Contract Interpretation, Breach & Remedies", src: "library/audio/lecture-03-contract-interpretation-breach-remedies.mp3", division: ["PcM","PjM"], topics: ["Contracts","Legal"] },
    { title: "Lecture 04 — Tort Law & Insurance", src: "library/audio/lecture-04-tort-law-insurance.mp3", division: ["PcM"], topics: ["Risk","Legal"] },
    { title: "Lecture 05 — Licensing, Agency & Associations", src: "library/audio/lecture-05-licensing-agency-associations.mp3", division: ["PcM"], topics: ["Ethics","Legal"] },
    { title: "Lecture 06 — AIA B101 Owner-Architect Agreement (Part 1)", src: "library/audio/lecture-06-b101-owner-architect-part-1.mp3", division: ["PcM","PjM"], topics: ["Contracts"] },
    { title: "Lecture 07 — AIA B101 Owner-Architect Agreement (Part 2)", src: "library/audio/lecture-07-b101-owner-architect-part-2.mp3", division: ["PcM","PjM"], topics: ["Contracts"] },
    { title: "Lecture 08 — Contracting Methods & Alt Project Delivery", src: "library/audio/lecture-08-contracting-methods-alt-delivery.mp3", division: ["PcM","PjM","CE"], topics: ["Delivery"] },
    { title: "Lecture 09 — The Economics of Construction", src: "library/audio/lecture-09-economics-of-construction.mp3", division: ["PcM"], topics: ["Finance"] },
    { title: "Lecture 10 — A201 General Conditions (Part 1)", src: "library/audio/lecture-10-a201-general-conditions-part-1.mp3", division: ["CE","PjM"], topics: ["Contracts","CA Procedures"] },
    { title: "Lecture 11.1 — A201 General Conditions (Part 2)", src: "library/audio/lecture-11-1-a201-general-conditions-part-2.mp3", division: ["CE","PjM"], topics: ["Contracts","CA Procedures"] },
    { title: "Lecture 11.2 — A201 General Conditions (Part 3)", src: "library/audio/lecture-11-2-a201-general-conditions-part-3.mp3", division: ["CE","PjM"], topics: ["Contracts","CA Procedures"] },
    { title: "Lecture 12 — Office Management & Fee Calculation", src: "library/audio/lecture-12-office-management-fee-calculation.mp3", division: ["PcM"], topics: ["Finance"] },
    { title: "Lecture 13 — Copyrights, Ownership & Starting a Practice", src: "library/audio/lecture-13-copyrights-ownership-starting-practice.mp3", division: ["PcM"], topics: ["Legal"] }
  ];

  /* ----------------------------------------------------------------------
     Everything below is the engine — no need to edit.
     ---------------------------------------------------------------------- */
  const PANEL_ID = "library";
  const DIVISIONS = ["PcM", "PjM", "CE"];

  function ext(path) { return (path.split(".").pop() || "").toLowerCase(); }
  function isPdf(d) { return (d.type === "pdf") || ext(d.src) === "pdf"; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

  function injectStyles() {
    if (document.getElementById("library-styles")) return;
    const css = `
#${PANEL_ID} .lib-sec{font-size:13px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted,#9090b8);margin:26px 0 12px;font-weight:600}
#${PANEL_ID} .lib-search{width:100%;max-width:360px;background:var(--surface,#16162a);border:1px solid var(--border,#2d2d48);color:var(--text,#e8e4f0);border-radius:9px;padding:9px 13px;font-size:14px;font-family:inherit;margin-bottom:14px;display:block}
#${PANEL_ID} .lib-search::placeholder{color:var(--muted,#9090b8)}
#${PANEL_ID} .lib-filters{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
#${PANEL_ID} .lib-flabel{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,#9090b8);margin-right:4px}
#${PANEL_ID} .lib-chip{background:var(--surface,#16162a);color:var(--muted,#9090b8);border:1px solid var(--border,#2d2d48);border-radius:20px;padding:5px 13px;font-size:13px;cursor:pointer;transition:.15s;font-family:inherit}
#${PANEL_ID} .lib-chip:hover{color:var(--text,#e8e4f0);border-color:var(--gold,#d97706)}
#${PANEL_ID} .lib-chip.active{background:var(--gold,#d97706);color:#1a1208;border-color:var(--gold,#d97706);font-weight:600}
#${PANEL_ID} .lib-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;margin-top:6px}
#${PANEL_ID} .lib-card{background:var(--surface,#16162a);border:1px solid var(--border,#2d2d48);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:.15s}
#${PANEL_ID} .lib-card.clickable{cursor:pointer}
#${PANEL_ID} .lib-card.clickable:hover{border-color:var(--gold,#d97706);transform:translateY(-2px)}
#${PANEL_ID} .lib-thumb{aspect-ratio:4/3;background:var(--accent,#1e1e2e);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
#${PANEL_ID} .lib-thumb img{width:100%;height:100%;object-fit:cover}
#${PANEL_ID} .lib-thumb .ph{color:var(--muted,#9090b8);font-size:12px;text-align:center;padding:0 10px;line-height:1.5}
#${PANEL_ID} .lib-thumb .ph .big{display:block;font-size:24px;margin-bottom:6px;opacity:.7}
#${PANEL_ID} .lib-badge{position:absolute;top:8px;right:8px;background:var(--gold,#d97706);color:#1a1208;font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;letter-spacing:.04em}
#${PANEL_ID} .lib-body{padding:11px 13px}
#${PANEL_ID} .lib-title{font-size:13px;font-weight:600;margin:0 0 6px;line-height:1.35;color:var(--text,#e8e4f0)}
#${PANEL_ID} .lib-meta{display:flex;gap:5px;flex-wrap:wrap}
#${PANEL_ID} .lib-tag{font-size:10.5px;color:var(--muted,#9090b8);background:var(--accent,#1e1e2e);border:1px solid var(--border,#2d2d48);border-radius:5px;padding:1px 6px}
#${PANEL_ID} .lib-audio{display:flex;flex-direction:column;gap:10px;max-width:660px}
#${PANEL_ID} .lib-arow{background:var(--surface,#16162a);border:1px solid var(--border,#2d2d48);border-radius:11px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
#${PANEL_ID} .lib-atop{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
#${PANEL_ID} .lib-atitle{font-size:14px;font-weight:600;color:var(--text,#e8e4f0)}
#${PANEL_ID} .lib-soon{font-size:11px;color:var(--muted,#9090b8);font-style:italic}
#${PANEL_ID} audio{width:100%;height:34px}
#${PANEL_ID} .lib-empty{color:var(--muted,#9090b8);font-size:14px;padding:24px 0}
.lib-lightbox{position:fixed;inset:0;background:rgba(6,6,14,.92);display:none;align-items:center;justify-content:center;z-index:9999;padding:24px}
.lib-lightbox.open{display:flex}
.lib-lightbox .inner{max-width:92vw;max-height:92vh;background:var(--surface,#16162a);border:1px solid var(--border,#2d2d48);border-radius:14px;padding:14px;text-align:center}
.lib-lightbox img{max-width:86vw;max-height:78vh;display:block;border-radius:6px}
.lib-lightbox .cap{color:var(--text,#e8e4f0);font-size:14px;margin-top:10px}
.lib-lightbox .x{position:fixed;top:18px;right:24px;background:var(--surface,#16162a);border:1px solid var(--border,#2d2d48);color:var(--text,#e8e4f0);border-radius:8px;width:40px;height:40px;font-size:18px;cursor:pointer}
`;
    const st = document.createElement("style");
    st.id = "library-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  let activeDiv = "All";
  let activeTopic = "All";
  let searchText = "";

  function allTopics() {
    const set = new Set();
    DIAGRAMS.forEach(d => (d.topics || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }

  function matches(d) {
    const divOk = activeDiv === "All" || (d.division || []).includes(activeDiv);
    const topOk = activeTopic === "All" || (d.topics || []).includes(activeTopic);
    const txtOk = !searchText ||
      (d.title.toLowerCase().includes(searchText) ||
       (d.topics || []).join(" ").toLowerCase().includes(searchText) ||
       (d.division || []).join(" ").toLowerCase().includes(searchText));
    return divOk && topOk && txtOk;
  }

  function diagramCard(d) {
    const tags = [].concat(d.division || [], d.topics || [])
      .map(t => `<span class="lib-tag">${esc(t)}</span>`).join("");
    let thumb, clickable = "", onclick = "";
    if (!d.src) {
      thumb = `<div class="ph"><span class="big">＋</span>awaiting upload</div>`;
    } else if (isPdf(d)) {
      thumb = `<span class="lib-badge">PDF</span><div class="ph"><span class="big">📄</span>open PDF</div>`;
      clickable = "clickable";
      onclick = `window.open('${esc(d.src)}','_blank')`;
    } else {
      thumb = `<img src="${esc(d.src)}" alt="${esc(d.title)}" loading="lazy">`;
      clickable = "clickable";
      onclick = `LibraryTab.zoom('${esc(d.src)}','${esc(d.title)}')`;
    }
    return `<div class="lib-card ${clickable}" ${onclick ? `onclick="${onclick}"` : ""}>
      <div class="lib-thumb">${thumb}</div>
      <div class="lib-body"><p class="lib-title">${esc(d.title)}</p><div class="lib-meta">${tags}</div></div>
    </div>`;
  }

  function audioRow(a) {
    const tags = [].concat(a.division || [], a.topics || [])
      .map(t => `<span class="lib-tag">${esc(t)}</span>`).join("");
    const player = a.src
      ? `<audio controls preload="none"><source src="${esc(a.src)}"></audio>`
      : `<span class="lib-soon">audio coming soon</span>`;
    return `<div class="lib-arow">
      <div class="lib-atop"><span class="lib-atitle">${esc(a.title)}</span><div class="lib-meta">${tags}</div></div>
      ${player}
    </div>`;
  }

  function renderGrid() {
    const grid = document.getElementById("lib-grid");
    if (!grid) return;
    const items = DIAGRAMS.filter(matches);
    grid.innerHTML = items.length
      ? items.map(diagramCard).join("")
      : `<div class="lib-empty">No diagrams match this filter yet.</div>`;
  }

  function chip(label, group, value) {
    const isActive = (group === "div" ? activeDiv : activeTopic) === value;
    return `<button class="lib-chip ${isActive ? "active" : ""}" data-group="${group}" data-value="${esc(value)}">${esc(label)}</button>`;
  }

  function buildPanel() {
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.id = PANEL_ID;

    const divChips = ["All"].concat(DIVISIONS).map(v => chip(v === "CE" ? "CE / CA" : v, "div", v)).join("");
    const topicChips = ["All"].concat(allTopics()).map(v => chip(v, "topic", v)).join("");

    panel.innerHTML = `
      <h2 class="lib-sec">Diagrams</h2>
      <input class="lib-search" id="lib-search" type="search" placeholder="Search diagrams…" autocomplete="off">
      <div class="lib-filters"><span class="lib-flabel">Division</span>${divChips}</div>
      <div class="lib-filters"><span class="lib-flabel">Topic</span>${topicChips}</div>
      <div class="lib-grid" id="lib-grid"></div>
      <h2 class="lib-sec">Audio</h2>
      <div class="lib-audio" id="lib-audio"></div>
    `;

    const firstPanel = document.querySelector(".panel");
    const panelParent = firstPanel ? firstPanel.parentElement : document.body;
    panelParent.appendChild(panel);

    document.getElementById("lib-audio").innerHTML =
      AUDIO.length ? AUDIO.map(audioRow).join("") : `<div class="lib-empty">No audio yet.</div>`;

    renderGrid();

    panel.addEventListener("click", function (e) {
      const c = e.target.closest(".lib-chip");
      if (!c) return;
      const group = c.dataset.group, value = c.dataset.value;
      if (group === "div") activeDiv = value; else activeTopic = value;
      panel.querySelectorAll(`.lib-chip[data-group="${group}"]`).forEach(b => b.classList.remove("active"));
      c.classList.add("active");
      renderGrid();
    });

    const search = document.getElementById("lib-search");
    search.addEventListener("input", function () {
      searchText = this.value.trim().toLowerCase();
      renderGrid();
    });
  }

  function buildTab() {
    const firstTab = document.querySelector(".nav-tab");
    if (!firstTab) return false;
    if (document.getElementById("lib-nav-tab")) return true;
    const btn = document.createElement("button");
    btn.className = "nav-tab";
    btn.id = "lib-nav-tab";
    btn.textContent = "📐 Library";
    btn.addEventListener("click", function () {
      if (typeof window.switchPanel === "function") window.switchPanel(PANEL_ID, btn);
      else manualSwitch(btn);
    });
    firstTab.parentElement.appendChild(btn);
    return true;
  }

  function manualSwitch(btn) {
    document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const p = document.getElementById(PANEL_ID);
    if (p) p.classList.add("active");
  }

  function buildLightbox() {
    if (document.querySelector(".lib-lightbox")) return;
    const lb = document.createElement("div");
    lb.className = "lib-lightbox";
    lb.innerHTML = `<button class="x" aria-label="Close">✕</button><div class="inner"><img alt=""><div class="cap"></div></div>`;
    document.body.appendChild(lb);
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("x")) lb.classList.remove("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  window.LibraryTab = {
    zoom: function (src, cap) {
      const lb = document.querySelector(".lib-lightbox");
      if (!lb) return;
      lb.querySelector("img").src = src;
      lb.querySelector(".cap").textContent = cap || "";
      lb.classList.add("open");
    }
  };

  function init() {
    if (!buildTab()) { return setTimeout(init, 300); }
    injectStyles();
    buildLightbox();
    buildPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
