/* ============================================================
   OPHELIA — Product Catalogue
   Single source of truth for every page (home, category, product, cart)
   ============================================================ */

export const CATEGORY_INFO = {
  "complexion":     { label: "Complexion",     desc: "Base makeup for a flawless, luminous canvas — foundation, powders and highlighters.", img: "/assets/cat-complexion.png" },
  "lip":            { label: "Lip",            desc: "Colour and care for the lips, from satin finishes to everyday wear.", img: "/assets/cat-lip.png" },
  "eye":            { label: "Eye",            desc: "Definition and dimension for every eye look, from everyday to statement.", img: "/assets/cat-eye.png" },
  "cheek":          { label: "Cheek",          desc: "Soft, buildable colour for a natural, healthy flush.", img: "/assets/cat-cheek.png" },
  "tools":          { label: "Tools",          desc: "Multi-use pieces designed to complete and simplify any makeup routine.", img: "/assets/cat-tools.png" },
  "body-care":      { label: "Body care",      desc: "Nourishing everyday essentials for softer, healthier skin.", img: "/assets/cat-body-care.jpg" },
  "face-care":      { label: "Face care",      desc: "Gentle, botanical formulas that cleanse and care for the skin.", img: "/assets/cat-face-care.jpg" },
  "home-fragrance": { label: "Home fragrance", desc: "Reed diffusers crafted to set a calm, inviting atmosphere at home.", img: "/assets/cat-home-fragrance.jpg" },
  "bath":           { label: "Bath",           desc: "Gentle cleansing essentials for a soft, everyday bath routine.", img: "/assets/cat-bath.jpg" },
};

/* Each product: id, name, sub, cat, price (pre-discount), variants, desc, features, sizeLabel */
export const PRODUCTS = [
  {
    id: "rouge-ophelia", name: "Rouge Ophélia", sub: "Satin Lip Colour", cat: "lip",
    price: 650, swatch: "#B5473E", badge: "Bestseller",
    desc: "A satin lip colour matched by hand to real skin, in a refillable case built to be renewed each season, not thrown away.",
    features: ["Hand-matched satin finish", "Refillable gold case", "8-hour wear", "6 shades, matched not guessed"],
    variants: ["Scarlet Rouge", "Coral Flame", "Pink Riot", "Raspberry Pop", "Crimson Reign", "Noir Cherry"],
    variantLabel: "Shade", size: "3.8g",
  },
  {
    id: "coast-baby", name: "Coast Baby", sub: "Silk Highlighting Powder", cat: "cheek",
    price: 700, swatch: "#D8B98A", badge: "New",
    desc: "A soft, undertone-matched glow — silk-milled powder that melts into skin instead of sitting on top of it.",
    features: ["Silk-milled micro-shimmer", "Undertone-matched glow", "Buildable, weightless finish", "4 shades"],
    variants: ["Sunlit Peach", "Rose Quartz", "Champagne Gold", "Moonlit Pearl"],
    variantLabel: "Shade", size: "9g",
  },
  {
    id: "second-skin", name: "Second Skin", sub: "Serum Foundation", cat: "complexion",
    price: 1000, swatch: "#D8B98A", badge: "Signature",
    desc: "Our most precisely matched foundation — the whole Ophelia philosophy in one bottle: a shade hand-matched to you, not chosen off a chart.",
    features: ["Hand shade-matching service, in-store or virtual", "Serum-infused, skin-first formula", "Buildable medium-to-full coverage", "6 shades spanning the full undertone range"],
    variants: ["Porcelain", "Ivory", "Natural", "Sand", "Honey", "Caramel"],
    variantLabel: "Shade", size: "30ml",
  },
  {
    id: "cloud-blur", name: "Cloud Blur", sub: "Perfecting Pressed Powder", cat: "complexion",
    price: 680, swatch: "#E8DAC0", badge: null,
    desc: "Blurs without masking — a finishing powder matched to your foundation shade so it disappears into skin.",
    features: ["Soft-focus micro-milled finish", "Oil-control without dulling", "Matched to Second Skin shades"],
    variants: ["Fair", "Beige"],
    variantLabel: "Shade", size: "11g",
  },
  {
    id: "volume-noir", name: "Volume Noir", sub: "Lengthening Mascara", cat: "eye",
    price: 580, swatch: "#2A2320", badge: null,
    desc: "Length and hold without weight — a precision brush built for a steady, deliberate application.",
    features: ["Lengthens without clumping", "8-hour hold", "Ophthalmologist tested"],
    variants: ["Noir Black"],
    variantLabel: "Shade", size: "10ml",
  },
  {
    id: "fine-line", name: "Fine Line", sub: "Precision Liquid Eyeliner", cat: "eye",
    price: 520, swatch: "#1E1A17", badge: null,
    desc: "A steady hand, in every sense — a fine, flexible tip built for a single confident line.",
    features: ["Ultra-fine 0.1mm tip", "Waterproof, smudge-resistant", "4 shades from classic to statement"],
    variants: ["Black", "Red", "Purple", "Blue"],
    variantLabel: "Shade", size: "1.1ml",
  },
  {
    id: "blush-crush", name: "Blush Crush", sub: "Lip & Cheek Tint", cat: "cheek",
    price: 560, swatch: "#C9707B", badge: "New",
    desc: "One tint, two places — a sheer, buildable wash of colour matched to read the same on lips and cheeks.",
    features: ["Dual lip-and-cheek use", "Sheer, buildable finish", "3 shades"],
    variants: ["Berry Kiss", "Fuchsia Pop", "Coral Crush"],
    variantLabel: "Shade", size: "4g",
  },
  {
    id: "petal-creme", name: "Petal Crème", sub: "Cream Blush", cat: "cheek",
    price: 540, swatch: "#E3A9AE", badge: null,
    desc: "A flush that reads as your own — a cream formula that melts into skin rather than sitting on it.",
    features: ["Cream-to-skin finish", "Dewy, natural flush", "2 shades"],
    variants: ["Coral Petal", "Peach Bloom"],
    variantLabel: "Shade", size: "6g",
  },
  {
    id: "bloom-palette", name: "Bloom Palette", sub: "All-in-One Face Palette", cat: "cheek",
    price: 780, swatch: "#C97B84", badge: "Bestseller",
    desc: "Cheek, eye and glow, matched as a set — built so every shade in the palette already works together.",
    features: ["Blush, contour and highlight in one", "Curated to work together, not just co-exist", "2 editions"],
    variants: ["Coral Bloom", "Berry Bloom"],
    variantLabel: "Edition", size: "15g",
  },
  {
    id: "sweetheart-eyes", name: "Sweetheart Eyes", sub: "Nine-Pan Eyeshadow Palette", cat: "eye",
    price: 750, swatch: "#8A6A4E", badge: null,
    desc: "Nine shades chosen to work together — from soft daytime wash to a defined evening edge.",
    features: ["9 blendable shades", "Matte and shimmer finishes", "2 curated editions"],
    variants: ["Bronzed Nude", "Rosé Mauve"],
    variantLabel: "Edition", size: "13.5g",
  },
  {
    id: "cloud-heart", name: "Cloud Heart", sub: "Oil-Control Loose Powder", cat: "complexion",
    price: 690, swatch: "#F0E6D2", badge: null,
    desc: "A quiet finish that holds all day — a loose setting powder that controls shine without flattening skin.",
    features: ["All-day oil control", "Featherlight, non-cakey finish", "2 shades"],
    variants: ["Translucent", "Banana"],
    variantLabel: "Shade", size: "7g",
  },
  {
    id: "flower-foam", name: "Flower Foam", sub: "Gentle Foaming Handwash", cat: "bath",
    price: 500, swatch: "#F2C6CE", badge: null,
    desc: "Strawberry — soft on hands, gentle on skin, for every day.",
    features: ["Gentle, sulfate-free foam", "Strawberry botanical scent", "Suitable for frequent use"],
    variants: ["Strawberry"],
    variantLabel: "Scent", size: "300ml",
  },
  {
    id: "sugar-melt", name: "Sugar Melt", sub: "Exfoliating Body Scrub", cat: "body-care",
    price: 620, swatch: "#C9A45C", badge: "New",
    desc: "Polished skin, matched to your favourite scent — a sugar-based scrub that melts as it exfoliates.",
    features: ["Fine-grain sugar exfoliant", "Melts into an oil finish", "2 scents"],
    variants: ["Japanese Cherry Blossom", "Sweet Vanilla"],
    variantLabel: "Scent", size: "350g",
  },
  {
    id: "silk-shower-oil", name: "Silk Shower Oil", sub: "Cleansing Shower Oil", cat: "bath",
    price: 600, swatch: "#E8C97A", badge: null,
    desc: "A cleanse that feels like care, not routine — an oil-to-milk formula that leaves skin soft, not stripped.",
    features: ["Oil-to-milk cleansing texture", "Leaves no greasy residue", "3 scents"],
    variants: ["Golden Vanilla", "Mango Orange", "Blossom Rose"],
    variantLabel: "Scent", size: "300ml",
  },
  {
    id: "botanic-shampoo", name: "Botanic Shampoo", sub: "Nourishing Botanical Shampoo", cat: "body-care",
    price: 560, swatch: "#A8B89A", badge: null,
    desc: "Nourishment, matched to your hair's needs — two botanical blends for two different hair stories.",
    features: ["Sulfate-gentle formula", "Botanical actives", "2 blends"],
    variants: ["Aloe Fresh", "Honey Oat"],
    variantLabel: "Blend", size: "250ml",
  },
  {
    id: "whipped-butter", name: "Whipped Butter", sub: "Rich Nourishing Body Butter", cat: "body-care",
    price: 650, swatch: "#E6D3A8", badge: null,
    desc: "Rich, quiet luxury for everyday skin — a whipped, fast-absorbing body butter in two signature scents.",
    features: ["Deeply nourishing, fast-absorbing", "Whipped, non-greasy texture", "2 scents"],
    variants: ["Lavender Calm", "Rose Nourish"],
    variantLabel: "Scent", size: "200g",
  },
  {
    id: "joay-lotion", name: "Joay Lotion", sub: "Softening Hand Cream", cat: "body-care",
    price: 520, swatch: "#F0E0D0", badge: null,
    desc: "Everyday hydration, precisely done — a fast-absorbing hand cream for repeated daily use.",
    features: ["Fast-absorbing, non-sticky", "Everyday hydration", "Travel-friendly size"],
    variants: ["Everyday Hydration"],
    variantLabel: "Variant", size: "200ml",
  },
  {
    id: "lavender-dream", name: "Lavender Dream", sub: "Reed Diffuser", cat: "home-fragrance",
    price: 700, swatch: "#B7A6D9", badge: null,
    desc: "Lavender, chamomile, white musk — a calming signature scent for the home.",
    features: ["6-8 week diffusion life", "Lavender · chamomile · white musk", "Reed-diffused, flame-free"],
    variants: ["Lavender / Chamomile / White Musk"],
    variantLabel: "Scent", size: "100ml",
  },
  {
    id: "rose-petal", name: "Rose Petal", sub: "Reed Diffuser", cat: "home-fragrance",
    price: 750, swatch: "#D98A9A", badge: "Bestseller",
    desc: "Rose, peony, soft musk — a nod to Oreiana's own national flower, brought home.",
    features: ["6-8 week diffusion life", "Rose · peony · soft musk", "Reed-diffused, flame-free"],
    variants: ["Rose / Peony / Soft Musk"],
    variantLabel: "Scent", size: "100ml",
  },
  {
    id: "golden-amber", name: "Golden Amber", sub: "Reed Diffuser", cat: "home-fragrance",
    price: 720, swatch: "#C9963C", badge: null,
    desc: "Amber, vanilla, sandalwood — warm and grounding, for evenings in.",
    features: ["6-8 week diffusion life", "Amber · vanilla · sandalwood", "Reed-diffused, flame-free"],
    variants: ["Amber / Vanilla / Sandalwood"],
    variantLabel: "Scent", size: "100ml",
  },
  {
    id: "amber-musk", name: "Amber Musk", sub: "Reed Diffuser", cat: "home-fragrance",
    price: 690, swatch: "#9C7A3C", badge: null,
    desc: "Amber, citrus, musk — a brighter, more everyday signature scent.",
    features: ["6-8 week diffusion life", "Amber · citrus · musk", "Reed-diffused, flame-free"],
    variants: ["Amber / Citrus / Musk"],
    variantLabel: "Scent", size: "100ml",
  },
];

/* ---- derived helpers, used across every page ---- */
export function discountedPrice(price) {
  return price;
}

export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(cat) {
  if (!cat || cat === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.cat === cat);
}

export function getRelated(product, count = 4) {
  const sameCat = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id);
  if (sameCat.length >= count) return sameCat.slice(0, count);
  // fall back to sitewide bestsellers/new arrivals so "Complete the Look" is never empty
  const fillers = PRODUCTS.filter(p => p.id !== product.id && !sameCat.includes(p) && (p.badge === "Bestseller" || p.badge === "New" || p.badge === "Signature"));
  return [...sameCat, ...fillers].slice(0, count);
}
