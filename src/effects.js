// src/effects.js — Kilbourn cursor, parallax, magnetic cards
const isTouch = matchMedia("(hover: none)").matches;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------- LAB EXPERIMENTS ---------------------
function initLabExperiments(){
  if(document.body?.dataset?.screenLabel !== "Lab") return;
  import("./lab-nav-dropdowns.js").catch(() => {});
}

// --------------------- CUSTOM CURSOR ---------------------
function initCursor(){
  if(isTouch || reducedMotion) return;
  const dot = document.createElement("div"); dot.className = "cursor-dot";
  const ring = document.createElement("div"); ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;
  let dx = mx, dy = my;

  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener("mousedown", () => dot.classList.add("is-down"));
  window.addEventListener("mouseup", () => dot.classList.remove("is-down"));
  window.addEventListener("mouseleave", () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  window.addEventListener("mouseenter", () => { dot.style.opacity = 1; ring.style.opacity = 1; });

  const hoverables = "a, button, .card, [data-magnetic], input, textarea";
  document.addEventListener("mouseover", e => {
    if(e.target.closest(hoverables)) ring.classList.add("is-hover");
  });
  document.addEventListener("mouseout", e => {
    if(e.target.closest(hoverables)) ring.classList.remove("is-hover");
  });

  function tick(){
    dx += (mx - dx) * 0.5;
    dy += (my - dy) * 0.5;
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.transform = `translate(${dx}px,${dy}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(tick);
  }
  tick();
}

// --------------------- PARALLAX HERO ---------------------
function initParallax(){
  if(isTouch || reducedMotion) return;
  const bg   = document.querySelector(".hero__bg");
  const grid = document.querySelector(".hero__grid");
  const logo = document.querySelector(".hero__logo");
  if(!bg && !grid && !logo) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if(bg)   bg.style.transform   = `translateY(${y * 0.25}px)`;
    if(grid) grid.style.transform = `translateY(${y * 0.15}px)`;
    if(logo) logo.style.transform = `translateY(${y * 0.12}px)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

// --------------------- MAGNETIC CARDS ---------------------
function initMagnetic(){
  if(isTouch || reducedMotion) return;
  document.querySelectorAll("[data-magnetic], .card").forEach(card => {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width;
      const cy = (e.clientY - r.top) / r.height;
      const rx = (cy - .5) * -6;
      const ry = (cx - .5) * 6;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// --------------------- INIT ---------------------
document.addEventListener("DOMContentLoaded", () => {
  initLabExperiments();
  initCursor();
  initParallax();
  // Magnetic cards: init after a tick so cards exist (some are JS-rendered)
  setTimeout(initMagnetic, 100);
  // Also when products render dynamically
  document.addEventListener("kilbourn:products-rendered", () => setTimeout(initMagnetic, 50));
});
