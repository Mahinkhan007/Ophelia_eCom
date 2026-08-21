import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { CATEGORY_INFO, PRODUCTS, getProduct, getProductImage, getRelated } from '../lib/products';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();

  const product = getProduct(id) || PRODUCTS[0];
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);

  // reset local selection whenever the product changes (navigating between PDPs)
  useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setQty(1);
  }, [product.id]);

  useEffect(() => {
    document.title = `${product.name} — Ophelia`;
  }, [product.name]);

  const related = getRelated(product, 4);

  return (
    <main className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to={`/category?cat=${product.cat}`}>{CATEGORY_INFO[product.cat].label}</Link><span>/</span>
        <span>{product.name}</span>
      </div>

      <section style={{ paddingTop: 20 }}>
        <div className="pdp-grid">
          <div className="pdp-media">
            <img
              className="pdp-photo"
              src={getProductImage(product, selectedVariant)}
              alt={`${product.name} — ${selectedVariant}`}
            />
            {product.badge && <span className="card-badge pdp-badge">{product.badge}</span>}
          </div>
          <div>
            <p className="pdp-cat">{CATEGORY_INFO[product.cat].label}</p>
            <h1 className="pdp-name">{product.name}</h1>
            <p className="pdp-sub">{product.sub} · {product.size}</p>
            <div className="pdp-price-row">
              <span className="pdp-price-new">ORD {product.price}</span>
            </div>
            <p className="pdp-desc">{product.desc}</p>

            <ul className="pdp-features">
              {product.features.map((f) => <li key={f}>{f}</li>)}
            </ul>

            <div className="option-block">
              <p className="option-label">{product.variantLabel}</p>
              <div className="variant-row">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    className={`variant-btn${v === selectedVariant ? ' active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-block">
              <p className="option-label">Quantity</p>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>&minus;</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <p className="stock-note">&#10003; In stock &mdash; ready to ship</p>

            <div className="pdp-actions">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(product.id, selectedVariant, qty);
                  showToast(`Added ${qty} × ${product.name} (${selectedVariant}) to cart`);
                }}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-gold"
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(product.id, selectedVariant, qty);
                  navigate('/checkout');
                }}
              >
                Buy Now
              </button>
            </div>

            <div className="info-strip">
              <div>&#128666; Free delivery over ORD 800</div>
              <div>&#8635; 30-day returns</div>
              <div>&#9878; Shade-match guarantee</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head" style={{ textAlign: 'left', marginBottom: 24 }}>
          <p className="eyebrow">You May Also Like</p>
          <h2 className="section-title" style={{ fontSize: 26 }}>Complete the look</h2>
        </div>
        <div className="grid">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
