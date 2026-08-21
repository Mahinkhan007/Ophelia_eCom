/* ==========================================================
   OPHELIA — Auth (Supabase email/password) + order persistence
   ========================================================== */

async function ophSignUp(email, password, fullName) {
  return sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

async function ophSignIn(email, password) {
  return sb.auth.signInWithPassword({ email, password });
}

async function ophSignOut() {
  await sb.auth.signOut();
  location.href = "index.html";
}

async function ophCurrentUser() {
  const { data } = await sb.auth.getSession();
  return data?.session?.user || null;
}

/* Save a completed order (and its line items) to Supabase.
   Works for both guest and signed-in checkouts — user_id is
   attached automatically when a session exists. */
async function ophSaveOrder(order) {
  const user = await ophCurrentUser();

  const { data: savedOrder, error: orderError } = await sb
    .from("orders")
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
    console.error("Order save failed:", orderError.message);
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

  const { error: itemsError } = await sb.from("order_items").insert(items);
  if (itemsError) console.error("Order items save failed:", itemsError.message);

  return { data: savedOrder, error: itemsError || null };
}

async function ophFetchMyOrders() {
  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) console.error("Fetch orders failed:", error.message);
  return data || [];
}
