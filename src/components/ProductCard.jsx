import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORY_INFO } from '../lib/products';

function useTilt(maxDeg = 8) {
  const onMouseMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) translateZ(4px)`;
  };
  const onMouseLeave = (e) => {
    e.currentTarget.style.transform = `perspective(700px) rotateY(0) rotateX(0) translateZ(0)`;
  };
  return { onMouseMove, onMouseLeave };
}

export default function ProductCard({ product, subtitle }) {
  const { addToCart, showToast } = useCart();
  const tilt = useTilt();

  return (
    <article className="card tilt" {...tilt}>
      {product.badge && <span className="card-badge">{product.badge}</span>}
      <Link to={`/product/${product.id}`}>
        <div className="card-media">
          <img src="/assets/lipstick.jpg" alt={product.name} className="card-photo" />
        </div>
        <div className="card-body">
          <p className="card-cat">{CATEGORY_INFO[product.cat].label}</p>
          <h3 className="card-name">{product.name}</h3>
          <p className="card-sub">{subtitle ?? product.sub}</p>
          <div className="price-row">
            <span className="price-new">ORD {product.price}</span>
          </div>
        </div>
      </Link>
      <div className="card-cta">
        <button
          className="btn btn-outline btn-full"
          onClick={() => {
            addToCart(product.id, product.variants[0], 1);
            showToast(`Added ${product.name} to cart`);
          }}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
