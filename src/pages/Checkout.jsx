import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MiniLocket from '../components/MiniLocket';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const DELIVERY_FEE = 45;
const FREE_DELIVERY_THRESHOLD = 800;

export default function Checkout() {
  const { cartLinesWithDetails, cartSubtotal, updateCartLine, removeFromCart, clearCart } = useCart();
  const { saveOrder } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('cart'); // 'cart' | 'payment'
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', postal: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [txnId, setTxnId] = useState('');
  const [txnError, setTxnError] = useState('');
  const [saving, setSaving] = useState(false);

  const lines = cartLinesWithDetails();
  const subtotal = cartSubtotal();
  const delivery = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = subtotal + delivery;

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const proceedToPayment = () => {
    if (lines.length === 0) return;
    if (!form.name || !form.address) {
      setFormError('Please fill in your name and delivery address before proceeding.');
      return;
    }
    setFormError('');
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmPayment = async () => {
    const trimmed = txnId.trim();
    if (!trimmed) {
      setTxnError('Please enter your transaction ID as proof of payment.');
      return;
    }
    setTxnError('');
    setSaving(true);

    const order = {
      orderNumber: 'OPH-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      lines: lines.map((l) => ({ id: l.id, name: l.product.name, variant: l.variant, qty: l.qty, lineTotal: l.lineTotal })),
      subtotal,
      total,
      transactionId: trimmed,
      customer: {
        name: form.name,
        email: form.email,
        address: form.address,
        city: form.city,
        phone: form.phone,
      },
    };

    // Persist to Supabase (orders + order_items). Checkout still completes
    // even if this fails — it's a secondary record of the demo payment.
    try { await saveOrder(order); }
    catch (err) { console.error('Order persistence failed:', err); }

    sessionStorage.setItem('ophelia_last_order', JSON.stringify(order));
    clearCart();
    navigate('/confirmation');
  };

  if (step === 'payment') {
    return (
      <main className="container">
        <section style={{ paddingTop: 20, maxWidth: 520, margin: '0 auto' }}>
          <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => setStep('cart')}>
            &larr; Back to Cart
          </button>
          <h1 className="serif" style={{ fontSize: 30, marginBottom: 8, textAlign: 'center' }}>Complete Your Payment</h1>
          <p style={{ textAlign: 'center', color: 'var(--midtext)', fontSize: 14, marginBottom: 10 }}>
            Total due: <strong style={{ color: 'var(--umber)' }}>ORD {total}</strong>
          </p>

          <div className="pay-qr-card">
            <img src="/assets/pay-qr.png" alt="Scan to pay via CrossCode" />
            <p style={{ fontSize: 13, color: 'var(--midtext)', lineHeight: 1.6 }}>
              Scan with <strong>CrossCode</strong> to pay directly via <strong>trimontiabank.com/portal</strong>.
              Nothing moves until you authenticate and confirm the amount on your banking app.
            </p>
          </div>

          <div className="field" style={{ marginTop: 22 }}>
            <label>Transaction ID</label>
            <input type="text" placeholder="e.g. CC-8231-9046-1170" value={txnId} onChange={(e) => setTxnId(e.target.value)} />
            <p style={{ fontSize: 12, color: 'var(--midtext)', marginTop: 6 }}>
              Enter the transaction ID from your banking app's payment confirmation as proof of payment.
            </p>
          </div>
          {txnError && <p className="promo-msg err">{txnError}</p>}

          <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={saving} onClick={confirmPayment}>
            {saving ? 'Saving order…' : "I've Completed Payment"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Checkout</span></div>

      <section style={{ paddingTop: 20 }}>
        <h1 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>Your Cart</h1>

        {lines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 16, color: 'var(--midtext)', marginBottom: 20 }}>Your cart is empty.</p>
            <Link to="/category?cat=all" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <div>
              <div>
                {lines.map((l) => (
                  <div className="cart-line" key={`${l.id}-${l.variant}`}>
                    <div className="cart-thumb"><MiniLocket color={l.product.swatch} /></div>
                    <div>
                      <div className="cart-line-name">{l.product.name}</div>
                      <div className="cart-line-variant">{l.variant}</div>
                      <span className="remove-link" onClick={() => removeFromCart(l.id, l.variant)}>Remove</span>
                    </div>
                    <div className="cart-qty-mini">
                      <button className="qty-btn-mini" onClick={() => updateCartLine(l.id, l.variant, l.qty - 1)}>&minus;</button>
                      <span>{l.qty}</span>
                      <button className="qty-btn-mini" onClick={() => updateCartLine(l.id, l.variant, l.qty + 1)}>+</button>
                    </div>
                    <div className="cart-line-price">ORD {l.lineTotal}</div>
                  </div>
                ))}
              </div>

              <h2 className="serif" style={{ fontSize: 22, margin: '36px 0 16px' }}>Delivery Details</h2>
              <div className="form-grid">
                <div className="field"><label>Full Name</label><input type="text" placeholder="Isabel Aurenhall" value={form.name} onChange={setField('name')} /></div>
                <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={setField('email')} /></div>
                <div className="field full"><label>Delivery Address</label><input type="text" placeholder="Street address" value={form.address} onChange={setField('address')} /></div>
                <div className="field"><label>City</label><input type="text" placeholder="Trimontia" value={form.city} onChange={setField('city')} /></div>
                <div className="field"><label>Postal Code</label><input type="text" placeholder="1000" value={form.postal} onChange={setField('postal')} /></div>
                <div className="field full"><label>Phone</label><input type="tel" placeholder="+000 000 0000" value={form.phone} onChange={setField('phone')} /></div>
              </div>
            </div>

            <div className="summary-card">
              <h3 className="serif" style={{ fontSize: 20, marginBottom: 16 }}>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>ORD {subtotal}</span></div>
              <div className="summary-row"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `ORD ${delivery}`}</span></div>
              <div className="summary-row total"><span>Total</span><span>ORD {total}</span></div>
              {formError && <p className="promo-msg err">{formError}</p>}
              <button className="btn btn-primary btn-full" style={{ marginTop: 18 }} onClick={proceedToPayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
