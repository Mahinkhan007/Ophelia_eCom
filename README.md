# Ophelia — The Jewel of Lily Glades (E-Commerce Prototype)

A fully connected, multi-page e-commerce website built in **plain vanilla JavaScript** (no framework, no build step) with a **Three.js 3D signature visual** — a procedurally modelled gold locket that reappears, retinted, on every product page.

This replaces the previous version of this site and is ready for Board review as a launch-ready prototype.

## Live customer journey

```
Homepage → Category → Product → Add to Cart → Checkout → Payment (QR) → Order Confirmation
```

Every page shares the same header, footer, cart state (via `localStorage`), and brand system — this is one connected site, not disconnected mockups.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero (3D locket), category tiles, bestsellers, new arrivals, promo banner |
| `category.html?cat=<key>` | Product category / shop-all page — filter chips, sort, grid |
| `product.html?id=<id>` | Product detail page — its own 3D locket tinted to that product's shade, variant/qty picker, related products |
| `checkout.html` | Cart, delivery details, promo code, order summary, QR payment step |
| `confirmation.html` | Order confirmation — order number, line items, delivery address |

## Tech notes

- **No frameworks.** Vanilla JS + native `<canvas>` throughout.
- **Three.js is vendored locally** at `js/vendor/three.module.js` — no CDN dependency, works offline, nothing to install.
- **Cart persists across pages** via `localStorage` (`js/cart.js`), so add-to-cart on any page carries through to checkout.
- **Product data** lives in one place — `js/products.js` — edit prices, shades, or descriptions there and every page updates automatically.
- **Payment is a labelled demo.** The QR (`assets/pay-qr.png`) is the real CrossCode/trimontiabank.com QR provided for this project. Scanning it will attempt the real banking flow — clicking "I've Completed Payment" on the site simply simulates order confirmation for demo purposes; there is no live payment gateway wired in yet (by design, pending the real API integration).

## Running locally

This is fully static — no build, no server-side code required. Because it uses ES module imports (`js/locket3d.js`), open it via a local server rather than double-clicking the file:

```bash
cd Ophelia_eCom
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Drop this whole folder into a static host (GitHub Pages, Netlify, Vercel, etc.) — `index.html` at the root is the entry point. No build step needed.
