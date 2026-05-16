// src/cart.js — Kilbourn cart (localStorage, drawer, WA checkout)
import { products, formatPrice, WA_NUMBER } from "../data/products.js";

const STORAGE_KEY = "kilbourn-cart-v1";

const Cart = {
  items: [],

  load(){
    try {
      this.items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch(e){ this.items = []; }
  },
  save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  },

  add(productId, size, qty = 1){
    const p = products.find(x => x.id === productId);
    if(!p) return;
    const key = `${productId}::${size || ""}`;
    const existing = this.items.find(it => it.key === key);
    if(existing){
      existing.qty += qty;
    } else {
      this.items.push({
        key, id: p.id, slug: p.slug, name: p.name,
        price: p.price, image: p.image, size: size || null, qty
      });
    }
    this.save();
    this.render();
    toast(`✓ ${p.name} agregado a la bolsa`);
    bounce();
  },

  remove(key){
    this.items = this.items.filter(it => it.key !== key);
    this.save(); this.render();
  },

  setQty(key, qty){
    const it = this.items.find(it => it.key === key);
    if(!it) return;
    it.qty = Math.max(1, qty);
    this.save(); this.render();
  },

  clear(){ this.items = []; this.save(); this.render(); },

  total(){ return this.items.reduce((s, it) => s + it.price * it.qty, 0); },
  count(){ return this.items.reduce((s, it) => s + it.qty, 0); },

  toCheckoutPayload(){
    return this.items.map(it => ({
      id: it.id, name: it.name, size: it.size, qty: it.qty,
      price: it.price, subtotal: it.price * it.qty
    }));
  },

  buildWAMessage(){
    if(!this.items.length) return "Hola Kilbourn! 👋 Quiero consultar por una pieza.";
    const lines = [
      "Hola Kilbourn! 👋",
      "",
      "Quiero consultar por estos productos:",
      ""
    ];
    this.items.forEach(it => {
      const subtotal = formatPrice(it.price * it.qty);
      const sizeStr = it.size ? ` (Talle: ${it.size})` : "";
      lines.push(`• ${it.name}${sizeStr} x${it.qty} — ${subtotal}`);
    });
    lines.push("");
    lines.push(`Total estimado: ${formatPrice(this.total())}`);
    lines.push("");
    lines.push("¿Están disponibles?");
    return lines.join("\n");
  },

  waCheckout(){
    const msg = encodeURIComponent(this.buildWAMessage());
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  },

  open(){
    document.querySelector(".cart")?.classList.add("is-open");
    document.querySelector(".cart-overlay")?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  },
  shut(){
    document.querySelector(".cart")?.classList.remove("is-open");
    document.querySelector(".cart-overlay")?.classList.remove("is-open");
    document.body.style.overflow = "";
  },

  render(){
    // Counter
    const counter = document.querySelector(".nav__cart-count");
    if(counter){
      const c = this.count();
      counter.textContent = c;
      counter.classList.toggle("has-items", c > 0);
    }

    // Drawer body
    const body = document.querySelector(".cart__body");
    const foot = document.querySelector(".cart__foot");
    if(!body) return;

    if(!this.items.length){
      body.innerHTML = `
        <div class="cart__empty">
          <h3>Bolsa vacía.</h3>
          <p>Todavía no agregaste ninguna pieza. Empezá por el Drop 001.</p>
          <a href="tienda.html" class="btn btn--outline" data-cart-close>Ir a la tienda</a>
        </div>
      `;
      foot.style.display = "none";
    } else {
      body.innerHTML = this.items.map(it => `
        <div class="cart__item">
          <div class="cart__thumb"><img src="${it.image}" alt=""></div>
          <div class="cart__info">
            <h3>${it.name}</h3>
            <div class="meta">${it.size ? "Talle " + it.size : "Único"}</div>
            <div class="cart__qty">
              <button data-qty-down="${it.key}" aria-label="Restar">−</button>
              <span>${it.qty}</span>
              <button data-qty-up="${it.key}" aria-label="Sumar">+</button>
            </div>
          </div>
          <div class="cart__line-right">
            <div class="price">${formatPrice(it.price * it.qty)}</div>
            <button class="cart__remove" data-remove="${it.key}">Quitar</button>
          </div>
        </div>
      `).join("");
      foot.style.display = "";
      const totalEl = foot.querySelector(".cart__total .value");
      if(totalEl) totalEl.textContent = formatPrice(this.total());
    }
  }
};

function bounce(){
  const btn = document.querySelector("[data-cart-trigger]");
  if(!btn) return;
  btn.classList.remove("cart-bounce");
  void btn.offsetWidth;
  btn.classList.add("cart-bounce");
}

function toast(msg){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="toast__check">✓</span><span>${msg}</span>`;
  el.classList.add("is-visible");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

window.__toast = toast;
window.Cart = Cart;

document.addEventListener("DOMContentLoaded", () => {
  Cart.load();
  Cart.render();

  const trigger = document.querySelector("[data-cart-trigger]");
  trigger?.addEventListener("click", () => Cart.open());
  document.querySelectorAll("[data-cart-open]").forEach(b => b.addEventListener("click", () => Cart.open()));

  document.querySelector(".cart__close")?.addEventListener("click", () => Cart.shut());
  document.querySelector(".cart-overlay")?.addEventListener("click", () => Cart.shut());

  // Cart body delegated events
  document.querySelector(".cart__body")?.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-cart-close]");
    if(closeBtn) Cart.shut();
    const up = e.target.closest("[data-qty-up]");
    if(up){ const it = Cart.items.find(it => it.key === up.dataset.qtyUp); if(it) Cart.setQty(it.key, it.qty + 1); }
    const down = e.target.closest("[data-qty-down]");
    if(down){ const it = Cart.items.find(it => it.key === down.dataset.qtyDown); if(it) Cart.setQty(it.key, it.qty - 1); }
    const rm = e.target.closest("[data-remove]");
    if(rm){ Cart.remove(rm.dataset.remove); }
  });

  // Checkout WhatsApp
  document.querySelector("[data-cart-checkout]")?.addEventListener("click", () => Cart.waCheckout());
});
