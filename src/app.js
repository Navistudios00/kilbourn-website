// src/app.js — Kilbourn core app (nav, search, reveal, ripple, marquee, scroll progress)
import { products, formatPrice, STATUS_LABEL, WA_NUMBER } from "../data/products.js";

const isTouch = matchMedia("(hover: none)").matches;

// --------------------- LAB EXPERIMENTS ---------------------
function initLabExperiments(){
  if(document.body?.dataset?.screenLabel !== "Lab") return;
  import("./lab-nav-dropdowns.js").catch(() => {});
}

// --------------------- TOP BAR MARQUEE ---------------------
function buildTopbar(){
  const track = document.querySelector(".topbar__track");
  if(!track) return;
  const items = [
    "West Kilbourn Ave",
    "<strong>Drop 001</strong>",
    "Buenos Aires",
    "2026",
    "Premium Streetwear",
    "Drop Culture",
    "Archivo Visual",
    "Uniforme de Avenida",
    "<strong>Preview</strong>",
    "Built for the Avenue",
    "Edited like a Magazine"
  ];
  const html = items.map(it => `<span class="topbar__item">${it}</span>`).join("");
  // Two identical copies for seamless translateX(0 → -50%) loop
  track.innerHTML = html + html;
}

// --------------------- SCROLL PROGRESS ---------------------
function initScrollProgress(){
  const bar = document.querySelector(".scroll-progress");
  if(!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100) + "%";
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

// --------------------- REVEAL ON SCROLL ---------------------
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: "0px 0px -60px 0px" });
  els.forEach(el => io.observe(el));
}

// --------------------- RIPPLE ---------------------
function initRipple(){
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".btn");
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const r = document.createElement("span");
    r.className = "ripple";
    r.style.width = r.style.height = size + "px";
    r.style.left = (ev.clientX - rect.left - size/2) + "px";
    r.style.top  = (ev.clientY - rect.top  - size/2) + "px";
    btn.appendChild(r);
    setTimeout(() => r.remove(), 650);
  });
}

// --------------------- HAMBURGER MENU ---------------------
function initMenu(){
  const burger = document.querySelector(".nav__burger");
  const drawer = document.querySelector(".drawer-menu");
  if(!burger || !drawer) return;
  const toggle = (open) => {
    document.body.classList.toggle("menu-open", open);
    drawer.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", () => toggle(!drawer.classList.contains("is-open")));
  drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggle(false)));
}

// --------------------- SEARCH OVERLAY ---------------------
function initSearch(){
  const trigger = document.querySelector("[data-search-trigger]");
  const overlay = document.querySelector(".search");
  if(!trigger || !overlay) return;
  const input = overlay.querySelector(".search__input");
  const results = overlay.querySelector(".search__results");
  const close = overlay.querySelector(".search__close");

  const open = () => {
    overlay.classList.add("is-open");
    setTimeout(() => input?.focus(), 200);
  };
  const shut = () => {
    overlay.classList.remove("is-open");
    input.value = ""; renderResults("");
  };
  trigger.addEventListener("click", open);
  close.addEventListener("click", shut);
  overlay.addEventListener("click", (e) => { if(e.target === overlay) shut(); });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") shut();
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){ e.preventDefault(); open(); }
  });

  const renderResults = (q) => {
    q = (q || "").toLowerCase().trim();
    if(!q){
      results.innerHTML = "";
      return;
    }
    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 6);
    if(!matches.length){
      results.innerHTML = `<div class="search__result"><div style="color:rgba(245,237,216,.5);font-size:14px;">Ningún resultado para "${q}".</div></div>`;
      return;
    }
    results.innerHTML = matches.map(p => `
      <a class="search__result" href="producto.html?id=${p.slug}">
        <div class="thumb"><img src="${p.image}" alt=""></div>
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${p.label} · ${formatPrice(p.price)}</div>
        </div>
      </a>
    `).join("");
  };
  input?.addEventListener("input", e => renderResults(e.target.value));
}

// --------------------- SPLIT TEXT HERO ---------------------
function initSplitText(){
  const el = document.querySelector("[data-split]");
  if(!el) return;
  const rows = el.querySelectorAll(".row");
  let i = 0;
  rows.forEach(row => {
    const text = row.textContent;
    row.textContent = "";
    [...text].forEach(ch => {
      const span = document.createElement("span");
      span.className = "char" + (ch === " " ? " char--space" : "");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.animationDelay = (i * 28) + "ms";
      row.appendChild(span);
      i++;
    });
  });
}

// --------------------- ACCORDION ---------------------
function initAccordion(){
  document.querySelectorAll(".accordion__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion__item");
      item.classList.toggle("is-open");
    });
  });
}

// --------------------- NEWSLETTER ---------------------
function initNewsletter(){
  document.querySelectorAll("[data-news]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = form.querySelector("input");
      const email = input?.value.trim();
      if(!email) return;
      window.__toast?.("Listo. Te avisamos del próximo drop.");
      input.value = "";
    });
  });
}

// --------------------- BURGER -> close on resize ---------------------
window.addEventListener("resize", () => {
  if(window.innerWidth > 768){
    document.body.classList.remove("menu-open");
    document.querySelector(".drawer-menu")?.classList.remove("is-open");
  }
});

// --------------------- INIT ---------------------
document.addEventListener("DOMContentLoaded", () => {
  initLabExperiments();
  buildTopbar();
  initScrollProgress();
  initReveal();
  initRipple();
  initMenu();
  initSearch();
  initSplitText();
  initAccordion();
  initNewsletter();
});
