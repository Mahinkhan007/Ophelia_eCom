/* ==========================================================
   OPHELIA — Loyalty Points
   1 ORD spent = 1 point (earned from order totals, which
   already exclude reward lines since those are 0 ORD).
   Redeemable for the Ophelia Mini charm collection.
   ========================================================== */

export const REWARDS = [
  {
    id: 'reward-blush', name: 'Blush Crush Mini', sub: 'Lip & Cheek Charm · Ophelia Mini',
    pointsCost: 1500, swatch: '#E0457A', img: '/assets/rewards/reward-blush.png',
  },
  {
    id: 'reward-highlighter', name: 'Rose Quartz Mini', sub: 'Coast Baby Highlighter Charm · Ophelia Mini',
    pointsCost: 2500, swatch: '#F0C9B8', img: '/assets/rewards/reward-highlighter.png',
  },
  {
    id: 'reward-lipstick', name: 'Scarlet Mini', sub: 'Rouge Ophélia Lipstick · Ophelia Mini',
    pointsCost: 3500, swatch: '#C41E3A', img: '/assets/rewards/reward-lipstick.jpg',
  },
];

export function getReward(id) {
  return REWARDS.find(r => r.id === id);
}

export function isRewardId(id) {
  return typeof id === 'string' && id.startsWith('reward-');
}

/* Net redeemable balance: points earned from past orders (order.total
   already excludes reward lines, since those are always 0 ORD) minus
   points already spent on reward lines. Mirrors the server-side check
   in supabase/migrations/0002_loyalty.sql — keep the two in sync. */
export function computeLoyaltyBalance(orders) {
  const earned = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const spent = orders.reduce((sum, o) => {
    const items = o.order_items || [];
    return sum + items.filter(i => i.is_reward).reduce((s, i) => s + Number(i.points_cost || 0), 0);
  }, 0);
  return earned - spent;
}
