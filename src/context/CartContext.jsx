import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProduct, discountedPrice } from '../lib/products';
import { getReward } from '../lib/loyalty';

const CART_KEY = 'ophelia_cart_v1';

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((productId, variant, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(l => l.id === productId && l.variant === variant);
      if (existing) {
        return prev.map(l => l === existing ? { ...l, qty: l.qty + qty } : l);
      }
      return [...prev, { id: productId, variant, qty }];
    });
  }, []);

  const updateCartLine = useCallback((productId, variant, qty) => {
    setCart(prev => {
      const next = prev.map(l => (l.id === productId && l.variant === variant) ? { ...l, qty } : l);
      return next.filter(l => l.qty > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId, variant) => {
    setCart(prev => prev.filter(l => !(l.id === productId && l.variant === variant)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const showToast = useCallback((message) => setToast(message), []);

  /* Redeem a loyalty reward — adds it to the cart at 0 ORD, qty fixed at 1.
     Balance eligibility is checked by the caller (Rewards page) before
     calling this; the database enforces it independently on checkout. */
  const redeemReward = useCallback((rewardId) => {
    const reward = getReward(rewardId);
    if (!reward) return;
    setCart(prev => {
      if (prev.some(l => l.id === rewardId)) return prev;
      return [...prev, { id: rewardId, variant: reward.name, qty: 1, isReward: true, pointsCost: reward.pointsCost }];
    });
  }, []);

  const cartLinesWithDetails = () => cart.map(l => {
    const p = getProduct(l.id) || getReward(l.id);
    if (!p) return null;
    const unitPrice = l.isReward ? 0 : discountedPrice(p.price);
    return { ...l, product: p, unitPrice, lineTotal: unitPrice * l.qty };
  }).filter(Boolean);

  const cartCount = () => cart.reduce((sum, l) => sum + l.qty, 0);
  const cartSubtotal = () => cartLinesWithDetails().reduce((sum, l) => sum + l.lineTotal, 0);

  const value = {
    cart, addToCart, updateCartLine, removeFromCart, clearCart, redeemReward,
    cartCount, cartSubtotal, cartLinesWithDetails,
    toast, showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
