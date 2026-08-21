import { Link } from 'react-router-dom';
import { CATEGORY_INFO } from '../lib/products';

const HOME_CATS = ['lip', 'cheek', 'home-fragrance', 'complexion'];
const CAT_TILES = HOME_CATS.map((cat) => ({
  cat, title: CATEGORY_INFO[cat].label, sub: CATEGORY_INFO[cat].desc, img: '/assets/lipstick.jpg',
}));

export default function Home() {
  return (
    <main>
      {/* PROMO RIBBON */}
      <div className="promo-ribbon">
        <p>Discover Rouge collection now with complimentary travel pouch at 8000 ORD, auto-added to member&rsquo;s cart till 23 August 2026.</p>
      </div>

      {/* HERO VIDEO */}
      <section className="hero-video-section">
        <video
          className="hero-video"
          src="/assets/hero-video.mp4"
          poster="/assets/lipstick.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-video-scrim" />
        <div className="hero-video-overlay">
          <img src="/assets/logo-full.png" alt="Ophelia" className="hero-video-logo" />
          <h1 className="hero-video-title">Beauty in Harmony</h1>
          <p className="hero-video-tagline">Complexion at our heart. Colour and care, in harmony with you.</p>
          <Link to="/category?cat=complexion" className="btn btn-primary">Match Your Shade</Link>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Shop by Category</p>
            <h2 className="section-title">Find what's already yours</h2>
            <p className="section-sub">Colour, care and fragrance — each shade matched, never guessed.</p>
          </div>
          <div className="cat-tiles">
            {CAT_TILES.map((t) => (
              <Link key={t.cat} to={`/category?cat=${t.cat}`} className="cat-tile">
                <div className="cat-tile-media">
                  <img src={t.img} alt={t.title} />
                </div>
                <h3>{t.title}</h3>
                <p>{t.sub}</p>
              </Link>
            ))}
            <Link to="/category?cat=all" className="cat-tile cat-tile-all">
              <h3>See All &rarr;</h3>
              <p>The full collection</p>
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLER */}
      <section className="container">
        <Link to="/category?cat=lip" className="best-seller-banner">
          <img src="/assets/best-seller-lip.jpg" alt="Best Seller — Rouge Ophélia Satin Lip Colour, shop the collection" />
        </Link>
      </section>
    </main>
  );
}
