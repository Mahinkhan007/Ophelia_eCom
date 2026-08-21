import { Link } from 'react-router-dom';
import { CATEGORY_INFO } from '../lib/products';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/assets/logo-icon.png" alt="Ophelia" className="footer-mark" />
            <p className="footer-logo">Precisely You.</p>
            <p>Ophelia Private Ltd &middot; The Jewel, Courtyard of Lily Glades, Level G, Trimontia, Oreiana. Every shade matched by hand, not guessed from a chart &mdash; then refilled, not replaced, season after season.</p>
          </div>
          <div>
            <h4>Shop</h4>
            {Object.entries(CATEGORY_INFO).map(([cat, info]) => (
              <Link key={cat} to={`/category?cat=${cat}`}>{info.label}</Link>
            ))}
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
        <div className="footer-consult">
          <a href="mailto:ophelia.oreiana@gmail.com" className="btn btn-primary">Book a Consultancy</a>
        </div>
        <p className="footer-bottom">&copy; 2026 Ophelia Private Ltd. All prices in ORD. This is a Board-review commercial prototype.</p>
      </div>
    </footer>
  );
}
