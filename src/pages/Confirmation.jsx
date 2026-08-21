import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Confirmation() {
  const order = useMemo(() => {
    const raw = sessionStorage.getItem('ophelia_last_order');
    return raw ? JSON.parse(raw) : null;
  }, []);

  if (!order) {
    return (
      <main className="container">
        <div className="confirm-wrap">
          <h1 className="serif" style={{ fontSize: 28 }}>No recent order found</h1>
          <p style={{ color: 'var(--midtext)', margin: '14px 0 24px' }}>Looks like there's nothing to confirm yet.</p>
          <Link to="/category?cat=all" className="btn btn-primary">Start Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="confirm-wrap">
        <div className="confirm-check">&#10003;</div>
        <h1 className="serif" style={{ fontSize: 30 }}>Payment Confirmed</h1>
        <p style={{ color: 'var(--midtext)', fontSize: 15, marginTop: 10 }}>
          Thank you — your order is on its way. A confirmation has been sent to your email.
        </p>

        <div className="order-summary-box">
          <p style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 14 }}>
            ORDER {order.orderNumber}
          </p>
          {order.lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
              <span>{l.name} <span style={{ color: 'var(--midtext)' }}>({l.variant}) &times;{l.qty}</span></span>
              <span style={{ fontWeight: 600 }}>ORD {l.lineTotal}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, color: 'var(--umber)', paddingTop: 14, marginTop: 6 }}>
            <span>Total Paid</span><span>ORD {order.total}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--midtext)', marginTop: 16 }}>
            Delivering to: {order.customer.name}, {order.customer.address}{order.customer.city ? `, ${order.customer.city}` : ''}
          </p>
          <p style={{ fontSize: 13, color: 'var(--midtext)', marginTop: 6 }}>
            Transaction ID: <span style={{ color: 'var(--darktext)', fontWeight: 600 }}>{order.transactionId || '—'}</span>
          </p>
        </div>

        <Link to="/category?cat=all" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </main>
  );
}
