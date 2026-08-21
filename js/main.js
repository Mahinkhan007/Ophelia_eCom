/* ==========================================================
   OPHELIA — Shared chrome: header/footer injection, nav toggle,
   3D tilt-on-hover for cards, mobile menu
   ========================================================== */

function renderHeader(activePage) {
  const nav = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "category.html?cat=all", label: "Shop All", key: "shop" },
    { href: "category.html?cat=complexion", label: "Complexion", key: "complexion" },
    { href: "category.html?cat=lip", label: "Lip", key: "lip" },
    { href: "category.html?cat=body", label: "Body Care", key: "body" },
    { href: "category.html?cat=fragrance", label: "Fragrance", key: "fragrance" },
  ];
  const navHtml = nav.map(n =>
    `<a href="${n.href}" class="${activePage === n.key ? "active" : ""}">${n.label}</a>`
  ).join("");

  return `
  <header class="site-header">
    <div class="nav-wrap">
      <a href="index.html" class="logo">
        <img src="assets/logo-icon.png" alt="" class="logo-icon">
        <img src="assets/logo-wordmark.png" alt="Ophelia" class="logo-word">
      </a>
      <nav class="main-nav" id="mainNav">${navHtml}</nav>
      <div class="nav-actions">
        <button class="menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button>
        <a href="account.html" id="accountLink" style="font-size:12px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; color:var(--darktext);">Sign In</a>
        <a href="checkout.html" class="cart-btn">
          Cart <span class="cart-count" id="cartCount">0</span>
        </a>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <img src="assets/logo-icon.png" alt="Ophelia" class="footer-mark">
          <p class="footer-logo">Precisely You.</p>
          <p>Ophelia Private Ltd &middot; The Jewel, Courtyard of Lily Glades, Level G, Trimontia, Oreiana. Every shade matched by hand, not guessed from a chart &mdash; then refilled, not replaced, season after season.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="category.html?cat=complexion">Complexion</a>
          <a href="category.html?cat=lip">Lip</a>
          <a href="category.html?cat=eye">Eye</a>
          <a href="category.html?cat=cheek">Cheek &amp; Contour</a>
          <a href="category.html?cat=body">Body Care</a>
          <a href="category.html?cat=fragrance">Home Fragrance</a>
        </div>
        <div>
          <h4>Customer Care</h4>
          <a href="#">Delivery &amp; Returns</a>
          <a href="#">Shade Matching Service</a>
          <a href="#">Track Your Order</a>
          <a href="#">Contact Us</a>
        </div>
        <div>
          <h4>The House</h4>
          <a href="#">Our Story</a>
          <a href="#">The Jewel, Lily Glades</a>
          <a href="#">Harmony Circle Loyalty</a>
          <a href="#">Sustainability &amp; Refills</a>
        </div>
      </div>
      <p class="footer-bottom">&copy; 2026 Ophelia Private Ltd. All prices in ORD. This is a Board-review commercial prototype.</p>
    </div>
  </footer>`;
}

function injectChrome(activePage) {
  const headerMount = document.getElementById("header-mount");
  const footerMount = document.getElementById("footer-mount");
  if (headerMount) headerMount.innerHTML = renderHeader(activePage);
  if (footerMount) footerMount.innerHTML = renderFooter();

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
  updateCartBadge();
  reflectAuthState();
}

async function reflectAuthState() {
  const link = document.getElementById("accountLink");
  if (!link || typeof ophCurrentUser !== "function") return;
  const user = await ophCurrentUser();
  if (user) {
    const name = user.user_metadata?.full_name?.split(" ")[0] || "Account";
    link.textContent = `Hi, ${name}`;
  } else {
    link.textContent = "Sign In";
  }
}

/* ---- 3D tilt-on-hover, applied to any element with class "tilt" ---- */
function enableTilt(selector = ".tilt", maxDeg = 8) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) translateZ(4px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = `perspective(700px) rotateY(0) rotateX(0) translateZ(0)`;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => enableTilt());
