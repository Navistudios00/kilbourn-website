// src/loader.js — Kilbourn page loader
(function(){
  const html = document.documentElement;
  html.classList.add("is-loading");

  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `
    <div class="loader__inner">
      <img class="loader__logo" src="assets/logos/kilbourn-logo.svg" alt="Kilbourn" />
      <div class="loader__bar"><div class="loader__bar-fill"></div></div>
    </div>
  `;
  document.body.appendChild(loader);

  // Hide on full load — minimum display time so the logo can be appreciated
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("is-hidden");
      html.classList.remove("is-loading");
      setTimeout(() => loader.remove(), 700);
    }, 600);
  });

  // Soft exit transition when navigating between same-origin pages
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if(!a) return;
    const href = a.getAttribute("href");
    if(!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || a.target === "_blank") return;
    if(!/\.html?$/.test(href) && href !== "/" && !href.includes(".html")) return;
    e.preventDefault();
    const exit = document.createElement("div");
    exit.className = "page-exit";
    document.body.appendChild(exit);
    requestAnimationFrame(() => exit.classList.add("is-active"));
    setTimeout(() => { window.location.href = href; }, 450);
  });
})();
