// src/effects.js — Kilbourn cursor, parallax, magnetic cards
const isTouch = matchMedia("(hover: none)").matches;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------- BRAND MOTION PANELS ---------------------
function initBrandMotionPanels(){
  const isHome = /(^|\/)index\.html$/.test(location.pathname) || location.pathname === "/";
  const isManual = /manual\.html$/.test(location.pathname);
  if(!isHome && !isManual) return;
  if(document.querySelector(".brand-motion")) return;

  const style = document.createElement("style");
  style.textContent = `
    .brand-motion{position:relative;isolation:isolate;min-height:clamp(520px,82svh,820px);display:grid;place-items:center;overflow:hidden;background:var(--ink);color:var(--cream)}
    .brand-motion::before,.brand-motion::after{content:"";position:absolute;inset:0;pointer-events:none}
    .brand-motion::before{z-index:0;background:linear-gradient(90deg,transparent 0 34%,var(--orange) 34% 66%,transparent 66%),linear-gradient(180deg,var(--ink) 0 50%,var(--paper) 50% 100%);transform:translateX(-101%);animation:brandMotionWipe 1.15s cubic-bezier(.78,0,.18,1) .15s forwards}
    .brand-motion::after{z-index:1;background:linear-gradient(rgba(245,237,216,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(245,237,216,.055) 1px,transparent 1px),radial-gradient(circle at 76% 22%,rgba(212,82,10,.22),transparent 28%);background-size:56px 56px,56px 56px,auto;mix-blend-mode:screen;opacity:.72}
    .brand-motion__inner{position:relative;z-index:2;width:min(1180px,calc(100% - 32px));display:grid;gap:clamp(22px,4vw,42px);align-items:center}
    .brand-motion__logo{width:min(480px,82vw);justify-self:center;filter:brightness(0) invert(1);mix-blend-mode:difference;animation:brandMotionLogo .82s cubic-bezier(.22,.8,.22,1) .2s both}
    .brand-motion__statement{margin:0;color:var(--cream);font-family:var(--display);font-size:clamp(58px,14vw,180px);font-weight:400;line-height:.78;letter-spacing:-.015em;text-transform:uppercase;mix-blend-mode:difference;animation:brandMotionType .9s cubic-bezier(.22,.8,.22,1) .38s both}
    .brand-motion__copy{max-width:500px;justify-self:end;padding:clamp(18px,3vw,28px);border:1px solid rgba(245,237,216,.2);border-radius:var(--r-lg);background:rgba(26,25,23,.56);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 30px 100px rgba(0,0,0,.28);animation:brandMotionCopy .75s cubic-bezier(.22,.8,.22,1) .55s both}
    .brand-motion__copy p:last-child{margin:0;color:rgba(245,237,216,.76);font-size:clamp(15px,1.7vw,19px);line-height:1.5;font-weight:300}
    .brand-motion .eyebrow{color:var(--orange);margin-bottom:14px}
    .brand-motion--home{min-height:clamp(500px,76svh,780px)}
    .brand-motion--manual{margin-top:calc(-1 * (var(--topbar-h) + var(--nav-h)));padding-top:calc(var(--topbar-h) + var(--nav-h));min-height:clamp(650px,96svh,900px)}
    .brand-motion--manual::before{background:linear-gradient(90deg,var(--orange) 0 42%,transparent 42%),linear-gradient(180deg,var(--ink) 0 44%,var(--paper) 44% 100%)}
    .brand-motion--manual .brand-motion__statement{max-width:980px}
    @keyframes brandMotionWipe{0%{transform:translateX(-101%)}56%{transform:translateX(0)}100%{transform:translateX(101%)}}
    @keyframes brandMotionLogo{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes brandMotionType{from{opacity:0;transform:translateY(24px);clip-path:inset(0 0 100% 0)}to{opacity:1;transform:translateY(0);clip-path:inset(0)}}
    @keyframes brandMotionCopy{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @media (min-width:900px){.brand-motion__inner{grid-template-columns:.92fr 1.08fr}.brand-motion__logo{justify-self:start}.brand-motion__copy{grid-column:2}}
    @media (max-width:699px){.brand-motion{min-height:620px}.brand-motion::before{background:linear-gradient(180deg,transparent 0 22%,var(--orange) 22% 62%,transparent 62%),linear-gradient(180deg,var(--ink) 0 54%,var(--paper) 54% 100%)}.brand-motion__inner{padding-block:64px 36px}.brand-motion__logo{justify-self:start;width:min(300px,78vw)}.brand-motion__copy{justify-self:stretch}}
    @media (prefers-reduced-motion:reduce){.brand-motion::before,.brand-motion__logo,.brand-motion__statement,.brand-motion__copy{animation:none}.brand-motion::before{transform:none;opacity:.35}}
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.className = `brand-motion ${isManual ? "brand-motion--manual" : "brand-motion--home"}`;
  section.setAttribute("aria-label", isManual ? "Introducción visual de marca Kilbourn" : "Movimiento de marca Kilbourn");
  section.innerHTML = `
    <div class="brand-motion__inner">
      <img class="brand-motion__logo" src="assets/logos/kilbourn-logo.svg" alt="West Kilbourn Ave" width="520" height="148" />
      <h2 class="brand-motion__statement">${isManual ? "Sistema visual Kilbourn." : "No basic goods"}</h2>
      <div class="brand-motion__copy">
        <p class="eyebrow">${isManual ? "Brand archive" : "Brand motion"}</p>
        <p>${isManual ? "Una entrada de marca con fondo plano, corte naranja y tipografía gigante. El manual empieza como pieza editorial, no como documento frío." : "Color plano, logo protagonista y corte editorial. Un golpe visual corto antes de entrar al universo Kilbourn."}</p>
      </div>
    </div>
  `;

  if(isHome){
    document.querySelector(".hero")?.insertAdjacentElement("afterend", section);
  } else {
    document.querySelector(".manual-hero")?.insertAdjacentElement("beforebegin", section);
  }
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
  initBrandMotionPanels();
  initCursor();
  initParallax();
  // Magnetic cards: init after a tick so cards exist (some are JS-rendered)
  setTimeout(initMagnetic, 100);
  // Also when products render dynamically
  document.addEventListener("kilbourn:products-rendered", () => setTimeout(initMagnetic, 50));
});
