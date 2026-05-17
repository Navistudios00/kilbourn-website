const menuData = {
  Tienda: {
    label: "Tienda",
    title: "Comprar por intención",
    items: ["Todo el drop", "New arrivals", "Lo último", "Best sellers", "Sale"]
  },
  Remeras: {
    label: "Remeras",
    title: "Remeras Kilbourn",
    items: ["New arrivals", "Oversize", "Hombres", "Mujeres", "Sale"]
  },
  Hoodies: {
    label: "Hoodies",
    title: "Capas & abrigo",
    items: ["New arrivals", "Oversize", "Zip hoodies", "Pullover", "Sale"]
  },
  Archivo: {
    label: "Archivo",
    title: "Universo de marca",
    items: ["Drop 001", "Lookbook", "Proceso", "Manual", "Próximos drops"]
  },
  Soporte: {
    label: "Soporte",
    title: "Ayuda rápida",
    items: ["Talles", "Envíos", "Cambios", "WhatsApp", "Estado del pedido"]
  },
  Buscar: {
    label: "Buscar",
    title: "Encontrar rápido",
    items: ["Remeras", "Hoodies", "New arrivals", "Sale", "Drop 001"]
  },
  Bolsa: {
    label: "Bolsa",
    title: "Compra directa",
    items: ["Ver bolsa", "Finalizar por WhatsApp", "Guardar piezas", "Consultar talle", "Métodos de pago"]
  }
};

function makeDropdown(config){
  const menu = document.createElement("div");
  menu.className = "lab-nav-dropdown";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <span class="lab-nav-dropdown__eyebrow">${config.label}</span>
    <strong>${config.title}</strong>
    <div class="lab-nav-dropdown__grid">
      ${config.items.map(item => `<a href="tienda.html" role="menuitem">${item}</a>`).join("")}
    </div>
  `;
  return menu;
}

function wrapTrigger(trigger, config){
  const item = document.createElement("div");
  item.className = "lab-nav-item";
  item.dataset.menu = config.label;
  trigger.parentNode.insertBefore(item, trigger);
  item.appendChild(trigger);
  item.appendChild(makeDropdown(config));
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

  nav.querySelectorAll(".roll-icon").forEach(button => {
    const label = button.getAttribute("aria-label");
    const config = menuData[label];
    if(config) wrapTrigger(button, config);
  });
}

document.addEventListener("DOMContentLoaded", initLabNavDropdowns);
