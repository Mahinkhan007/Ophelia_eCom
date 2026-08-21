import { createContext, useContext, useEffect, useState } from 'react';
import { sb } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = (email, password, fullName) =>
    sb.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

  const signIn = (email, password) =>
    sb.auth.signInWithPassword({ email, password });

  const signOut = () => sb.auth.signOut();

  /* Save a completed order (and its line items) to Supabase.
     Works for both guest and signed-in checkouts — user_id is
     attached automatically when a session exists. */
  const saveOrder = async (order) => {
    const { data: savedOrder, error: orderError } = await sb
      .from('orders')
      .insert({
        user_id: user ? user.id : null,
        order_number: order.orderNumber,
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_address: order.customer.address,
        customer_city: order.customer.city,
        customer_phone: order.customer.phone || null,
        subtotal: order.subtotal,
        total: order.total,
        promo_code: order.promoCode || null,
        transaction_id: order.transactionId,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order save failed:', orderError.message);
      return { error: orderError };
    }

    const items = order.lines.map((l) => ({
      order_id: savedOrder.id,
      product_id: l.id,
      product_name: l.name,
      variant: l.variant,
      qty: l.qty,
      unit_price: l.lineTotal / l.qty,
      line_total: l.lineTotal,
    }));

    const { error: itemsError } = await sb.from('order_items').insert(items);
    if (itemsError) console.error('Order items save failed:', itemsError.message);

    return { data: savedOrder, error: itemsError || null };
  };

  const fetchMyOrders = async () => {
    const { data, error } = await sb
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) console.error('Fetch orders failed:', error.message);
    return data || [];
  };

  const value = { user, loading, signUp, signIn, signOut, saveOrder, fetchMyOrders };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
