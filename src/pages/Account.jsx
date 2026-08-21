import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function money(n) { return `ORD ${Number(n).toFixed(0)}`; }

function OrderCard({ o }) {
  return (
    <div className="order-summary-box">
      <div className="summary-row" style={{ fontWeight: 700, color: 'var(--umber)' }}>
        <span>{o.order_number}</span><span>{new Date(o.created_at).toLocaleDateString()}</span>
      </div>
      {(o.order_items || []).map((i) => (
        <div className="summary-row" key={i.id}>
          <span>{i.product_name} — {i.variant} × {i.qty}</span><span>{money(i.line_total)}</span>
        </div>
      ))}
      <div className="summary-row total"><span>Total</span><span>{money(o.total)}</span></div>
      <p style={{ fontSize: 12, color: 'var(--midtext)', marginTop: 8 }}>Transaction ID: {o.transaction_id || '—'}</p>
    </div>
  );
}

export default function Account() {
  const { user, loading, signIn, signUp, signOut, fetchMyOrders } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [si, setSi] = useState({ email: '', password: '' });
  const [su, setSu] = useState({ name: '', email: '', password: '' });
  const [siMsg, setSiMsg] = useState({ text: '', ok: false });
  const [suMsg, setSuMsg] = useState({ text: '', ok: false });
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) { setOrders(null); return; }
    fetchMyOrders().then(setOrders);
  }, [user]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiMsg({ text: 'Signing in…', ok: false });
    const { error } = await signIn(si.email, si.password);
    if (error) { setSiMsg({ text: error.message, ok: false, err: true }); return; }
    setSiMsg({ text: '', ok: false });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuMsg({ text: 'Creating account…', ok: false });
    const { error } = await signUp(su.email, su.password, su.name);
    if (error) { setSuMsg({ text: error.message, ok: false, err: true }); return; }
    setSuMsg({ text: 'Account created — check your email to confirm, then sign in.', ok: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return null;

  return (
    <main className="container" style={{ paddingTop: 20, paddingBottom: 60 }}>
      <div className="breadcrumb"><span>Home</span><span>/</span><span>Account</span></div>

      {!user ? (
        <section style={{ maxWidth: 420, margin: '20px auto 0' }}>
          <div className="chip-row" style={{ justifyContent: 'center', marginBottom: 26 }}>
            <button className={`chip${tab === 'signin' ? ' active' : ''}`} onClick={() => setTab('signin')}>Sign In</button>
            <button className={`chip${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
          </div>

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Email</label>
                <input type="email" required placeholder="you@email.com" value={si.email} onChange={(e) => setSi(s => ({ ...s, email: e.target.value }))} />
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Password</label>
                <input type="password" required placeholder="••••••••" value={si.password} onChange={(e) => setSi(s => ({ ...s, password: e.target.value }))} />
              </div>
              {siMsg.text && <p className={`promo-msg${siMsg.err ? ' err' : ''}`}>{siMsg.text}</p>}
              <button type="submit" className="btn btn-primary btn-full">Sign In</button>
            </form>
          ) : (
            <form onSubmit={handleSignUp}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Full Name</label>
                <input type="text" required placeholder="Isabel Aurenhall" value={su.name} onChange={(e) => setSu(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Email</label>
                <input type="email" required placeholder="you@email.com" value={su.email} onChange={(e) => setSu(s => ({ ...s, email: e.target.value }))} />
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Password</label>
                <input type="password" required minLength={6} placeholder="At least 6 characters" value={su.password} onChange={(e) => setSu(s => ({ ...s, password: e.target.value }))} />
              </div>
              {suMsg.text && <p className={`promo-msg${suMsg.ok ? ' ok' : suMsg.err ? ' err' : ''}`}>{suMsg.text}</p>}
              <button type="submit" className="btn btn-primary btn-full">Create Account</button>
            </form>
          )}
        </section>
      ) : (
        <section style={{ maxWidth: 640, margin: '20px auto 0' }}>
          <h1 className="serif" style={{ fontSize: 28, marginBottom: 4 }}>
            Welcome back, {user.user_metadata?.full_name || 'there'}
          </h1>
          <p style={{ color: 'var(--midtext)', fontSize: 14, marginBottom: 26 }}>{user.email}</p>

          <h2 className="serif" style={{ fontSize: 20, marginBottom: 14 }}>Your Orders</h2>
          {orders === null ? null : orders.length === 0 ? (
            <p style={{ color: 'var(--midtext)', fontSize: 14 }}>
              No orders yet — your Ophelia pieces will appear here once you check out.
            </p>
          ) : (
            orders.map((o) => <OrderCard key={o.id} o={o} />)
          )}

          <button className="btn btn-outline" style={{ marginTop: 30 }} onClick={handleSignOut}>Sign Out</button>
        </section>
      )}
    </main>
  );
}
