const menuData = {
  Tienda: {
    number: "01",
    label: "Tienda",
    note: "Comprar por drop, intención o disponibilidad.",
    visual: "Drop 001 / Store mode",
    items: ["New arrivals", "Gift cards", "Drop 001", "Best sellers", "Sale", "Shop all"]
  },
  Remeras: {
    number: "02",
    label: "Remeras",
    note: "Cortes amplios, gráfica limpia y uso diario.",
    visual: "Tees / Avenida",
    items: ["New arrivals", "Oversize", "Hombres", "Mujeres", "Sale", "Shop all"]
  },
  Hoodies: {
    number: "03",
    label: "Hoodies",
    note: "Capas pesadas para clima de avenida.",
    visual: "Heavy layers",
    items: ["New arrivals", "Hoodies & jackets", "Zip hoodies", "Pullover", "Oversize", "Sale"]
  },
  Archivo: {
    number: "04",
    label: "Archivo",
    note: "Lo que construye el mundo Kilbourn: proceso, drop y sistema visual.",
    visual: "Brand archive",
    items: ["Drop 001", "Lookbook", "Proceso", "Manual de marca", "Próximos drops", "Archivo visual"]
  },
  Soporte: {
    number: "05",
    label: "Soporte",
    note: "Talles, envíos y consulta directa antes de cerrar la compra.",
    visual: "Direct help",
    items: ["Talles", "Envíos", "Cambios", "WhatsApp", "Estado del pedido", "Contacto"]
  }
};

function makeMegaPanel(config){
  const menu = document.createElement("div");
  menu.className = "lab-mega-panel";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <div class="lab-mega__inner">
      <div class="lab-mega__main">
        <span class="lab-mega__eyebrow">${config.number} / ${config.label}</span>
        <div class="lab-mega__list">
          ${config.items.map(item => `<a href="tienda.html" role="menuitem"><span>${item}</span></a>`).join("")}
        </div>
      </div>
      <aside class="lab-mega__aside" aria-label="Nota editorial ${config.label}">
        <span class="lab-mega__stamp">West Kilbourn Ave</span>
        <strong>${config.visual}</strong>
        <p>${config.note}</p>
      </aside>
    </div>
    <div class="lab-mega__status" aria-hidden="true">
      <span>West Kilbourn Ave</span>
      <span>Drop 001</span>
      <span>Buenos Aires</span>
    </div>
  `;
  return menu;
}

function wrapTrigger(trigger, config){
  const item = document.createElement("div");
  item.className = "lab-mega-item";
  item.dataset.menu = config.label;
  trigger.parentNode.insertBefore(item, trigger);
  item.appendChild(trigger);
  item.appendChild(makeMegaPanel(config));
}

function initLabNavDropdowns(){
  const nav = document.querySelector('[data-lab-code="LAB-004C"] .lab-store-nav--roll');
  if(!nav || nav.dataset.dropdownsReady === "true") return;
  nav.dataset.dropdownsReady = "true";

  nav.querySelectorAll(".roll-link").forEach(link => {
    const label = link.textContent.trim();
    const config = menuData[label];
    if(config) wrapTrigger(link, config);
  });
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initLabNavDropdowns);
}else{
  initLabNavDropdowns();
}
