/* ==========================================================
   OPHELIA — Cart (localStorage-based, shared across all pages)
   ========================================================== */

const CART_KEY = "ophelia_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, variant, qty = 1) {
  const cart = getCart();
  const existing = cart.find(l => l.id === productId && l.variant === variant);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, variant, qty }); }
  saveCart(cart);
}

function updateCartLine(productId, variant, qty) {
  let cart = getCart();
  const line = cart.find(l => l.id === productId && l.variant === variant);
  if (!line) return;
  line.qty = qty;
  if (line.qty <= 0) cart = cart.filter(l => !(l.id === productId && l.variant === variant));
  saveCart(cart);
}

function removeFromCart(productId, variant) {
  const cart = getCart().filter(l => !(l.id === productId && l.variant === variant));
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartLinesWithDetails() {
  return getCart().map(l => {
    const p = getProduct(l.id);
    if (!p) return null;
    return { ...l, product: p, unitPrice: discountedPrice(p.price), lineTotal: discountedPrice(p.price) * l.qty };
  }).filter(Boolean);
}

function cartSubtotal() {
  return cartLinesWithDetails().reduce((sum, l) => sum + l.lineTotal, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
