import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CATEGORY_INFO } from '../lib/products';

const matchCat = (cat) => (loc) =>
  loc.pathname === '/category' && new URLSearchParams(loc.search).get('cat') === cat;

const NAV = [
  { to: '/', label: 'Home', match: (loc) => loc.pathname === '/' },
  { to: '/category?cat=all', label: 'Shop All', match: (loc) => loc.pathname === '/category' && (new URLSearchParams(loc.search).get('cat') ?? 'all') === 'all' },
  ...['complexion', 'lip', 'body-care', 'home-fragrance'].map((cat) => ({
    to: `/category?cat=${cat}`, label: CATEGORY_INFO[cat].label, match: matchCat(cat),
  })),
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const accountLabel = user
    ? `Hi, ${user.user_metadata?.full_name?.split(' ')[0] || 'Account'}`
    : 'Sign In';

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="logo">
          <img src="/assets/logo-icon.png" alt="" className="logo-icon" />
          <img src="/assets/logo-wordmark.png" alt="Ophelia" className="logo-word" />
        </Link>
        <nav className={`main-nav${menuOpen ? ' open' : ''}`}>
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className={n.match(location) ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="menu-toggle" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
            &#9776;
          </button>
          <Link
            to="/account"
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--darktext)' }}
          >
            {accountLabel}
          </Link>
          <Link to="/checkout" className="cart-btn">
            Cart <span className="cart-count" style={{ display: cartCount() > 0 ? 'flex' : 'none' }}>{cartCount()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
