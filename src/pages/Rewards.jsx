import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { REWARDS, computeLoyaltyBalance } from '../lib/loyalty';

function CoinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="#D9B4B2" stroke="#B98D8A" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="#B98D8A" strokeWidth="1" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontFamily="Playfair Display, serif" fill="#7A5C58">O</text>
    </svg>
  );
}

export default function Rewards() {
  const { user, loading: authLoading, fetchMyOrders } = useAuth();
  const { cart, redeemReward, showToast } = useCart();

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) { setOrders(null); return; }
    fetchMyOrders().then(setOrders);
  }, [user]);

  const balance = orders ? computeLoyaltyBalance(orders) : 0;

  if (authLoading) return null;

  const handleRedeem = (reward) => {
    if (balance < reward.pointsCost) return;
    redeemReward(reward.id);
    showToast(`${reward.name} added to cart — add another product to check out.`);
  };

  return (
    <main className="container" style={{ paddingTop: 20, paddingBottom: 60 }}>
      <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Loyalty Rewards</span></div>

      <section className="section-head" style={{ textAlign: 'left', margin: '20px 0 8px' }}>
        <p className="eyebrow">Harmony Circle</p>
        <h1 className="serif" style={{ fontSize: 32 }}>Loyalty Rewards</h1>
        <p className="section-sub" style={{ margin: '8px 0 0' }}>
          Every ORD you spend earns 1 point. Redeem them for the Ophelia Mini charm collection —
          each reward ships free with any other product in your order.
        </p>
      </section>

      {!user ? (
        <div className="loyalty-balance-card" style={{ maxWidth: 480 }}>
          <p style={{ margin: 0, color: 'var(--midtext)', fontSize: 14 }}>
            Sign in to see your points balance and redeem rewards.
          </p>
          <Link to="/account" className="btn btn-primary" style={{ marginTop: 14 }}>Sign In</Link>
        </div>
      ) : (
        <div className="loyalty-balance-card">
          <CoinIcon size={30} />
          <div>
            <p className="loyalty-balance-label">Your Balance</p>
            <p className="loyalty-balance-value">
              {orders === null ? '…' : balance.toLocaleString()} <span>points</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid" style={{ marginTop: 32 }}>
        {REWARDS.map((r) => {
          const inCart = cart.some((l) => l.id === r.id);
          const canAfford = user && orders !== null && balance >= r.pointsCost;
          return (
            <article className="card reward-card" key={r.id}>
              <div className="card-media">
                <img src={r.img} alt={r.name} className="card-photo" />
              </div>
              <div className="card-body">
                <h3 className="card-name">{r.name}</h3>
                <p className="card-sub">{r.sub}</p>
                <div className="price-row" style={{ gap: 6, display: 'flex', alignItems: 'center' }}>
                  <CoinIcon size={16} />
                  <span className="price-new">{r.pointsCost.toLocaleString()} points</span>
                </div>
              </div>
              <div className="card-cta">
                {inCart ? (
                  <button className="btn btn-outline btn-full" disabled>In Cart</button>
                ) : !user ? (
                  <Link to="/account" className="btn btn-primary btn-full">Sign In to Redeem</Link>
                ) : (
                  <button
                    className="btn btn-primary btn-full"
                    disabled={!canAfford}
                    onClick={() => handleRedeem(r)}
                  >
                    {orders === null ? 'Loading…' : canAfford ? 'Redeem' : 'Not Enough Points'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
