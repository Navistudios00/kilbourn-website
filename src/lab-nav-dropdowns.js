const menuData = {
  Tienda: {
    label: "Tienda",
    items: ["New arrivals", "Gift cards", "Drop 001", "Best sellers", "Sale", "Shop all"]
  },
  Remeras: {
    label: "Remeras",
    items: ["New arrivals", "Oversize", "Hombres", "Mujeres", "Sale", "Shop all"]
  },
  Hoodies: {
    label: "Hoodies",
    items: ["New arrivals", "Hoodies & jackets", "Zip hoodies", "Pullover", "Oversize", "Sale"]
  },
  Archivo: {
    label: "Archivo",
    items: ["Drop 001", "Lookbook", "Proceso", "Manual de marca", "Próximos drops", "Archivo visual"]
  },
  Soporte: {
    label: "Soporte",
    items: ["Talles", "Envíos", "Cambios", "WhatsApp", "Estado del pedido", "Contacto"]
  }
};

function makeMegaPanel(config){
  const menu = document.createElement("div");
  menu.className = "lab-mega-panel";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <span class="lab-mega__eyebrow">${config.label}</span>
    <div class="lab-mega__list">
      ${config.items.map(item => `<a href="tienda.html" role="menuitem">${item}</a>`).join("")}
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
