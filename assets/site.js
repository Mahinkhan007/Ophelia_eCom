/* Ophelia store scripts */

var STORE_KEY = "cart_ophelia";
var DELIVERY = 4.95;

function getCart() {
  var raw = localStorage.getItem(STORE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveCart(c) {
  localStorage.setItem(STORE_KEY, JSON.stringify(c));
}

function cartUnits() {
  var c = getCart(), n = 0;
  for (var i = 0; i < c.length; i++) n += c[i].qty;
  return n;
}

function cartSubtotal() {
  var c = getCart(), t = 0;
  for (var i = 0; i < c.length; i++) t += c[i].price * c[i].qty;
  return t;
}

function money(n) { return "ORD " + n.toFixed(2); }

function paintCount() {
  var el = document.getElementById("basketcount");
  if (el) el.innerHTML = "Basket (" + cartUnits() + ")";
}

function addToCart(id, name, price) {
  var optEl = document.getElementById("opt");
  var qtyEl = document.getElementById("qty");
  var c = getCart();
  c.push({
    id: id,
    name: name,
    price: price,
    option: optEl ? optEl.value : "",
    qty: parseInt(qtyEl.value, 10)
  });
  saveCart(c);
  window.location.href = "cart.html";
}

function drawCart() {
  var c = getCart();
  var box = document.getElementById("cartbox");
  if (!box) return;

  if (c.length === 0) {
    box.innerHTML = "<p>Your basket is empty.</p><p><a href='shop.html'>Shop all</a></p>";
    return;
  }

  var h = "<table class='t'><tr><th colspan='2'>Item</th><th>Option</th><th>Price</th><th>Qty</th><th class='right'>Total</th><th></th></tr>";
  for (var i = 0; i < c.length; i++) {
    h += "<tr><td><div class='tph'>" + c[i].name.substring(0, 2).toUpperCase() + "</div></td>";
    h += "<td><a href='product-" + c[i].id + ".html'>" + c[i].name + "</a></td>";
    h += "<td>" + (c[i].option ? c[i].option : "-") + "</td>";
    h += "<td>" + money(c[i].price) + "</td>";
    h += "<td><input type='text' value='" + c[i].qty + "' onchange='setQty(" + i + ", this.value)'></td>";
    h += "<td class='right'>" + money(c[i].price * c[i].qty) + "</td>";
    h += "<td><a href='#' onclick='removeLine(" + i + ");return false;'>Remove</a></td></tr>";
  }
  h += "</table>";

  h += "<div class='totals'>";
  h += "<div>Subtotal <span>" + money(cartSubtotal()) + "</span></div>";
  h += "<div>Delivery <span>" + money(DELIVERY) + "</span></div>";
  h += "<div>Tax <span>ORD 0.00</span></div>";
  h += "<div class='grand'>Total <span>" + money(cartSubtotal() + DELIVERY) + "</span></div>";
  h += "<p><a class='btn btn-wide' style='display:block;text-align:center;text-decoration:none' href='checkout.html'>Checkout</a></p>";
  h += "</div><div class='clear'></div>";

  box.innerHTML = h;
}

function setQty(i, v) {
  var c = getCart();
  c[i].qty = parseInt(v, 10);
  saveCart(c);
  drawCart();
  paintCount();
}

function removeLine(i) {
  var c = getCart();
  c.splice(i, 1);
  saveCart(c);
  drawCart();
  paintCount();
}

function drawCheckoutSummary() {
  var box = document.getElementById("summary");
  if (!box) return;
  var c = getCart();
  var h = "<h3>Order summary</h3>";
  for (var i = 0; i < c.length; i++) {
    h += "<div>" + c[i].qty + " x " + c[i].name + " <span>" + money(c[i].price * c[i].qty) + "</span></div>";
  }
  h += "<div>Delivery <span>" + money(DELIVERY) + "</span></div>";
  h += "<div class='grand'>Total <span>" + money(cartSubtotal() + DELIVERY) + "</span></div>";
  box.innerHTML = h;
}

function placeOrder() {
  var n = "OR-" + Math.floor(Math.random() * 900000 + 100000);
  localStorage.setItem("lastorder_ophelia", n);
  localStorage.removeItem(STORE_KEY);
  window.location.href = "order-confirmation.html";
}

function showOrderNumber() {
  var el = document.getElementById("ordernum");
  if (el) el.innerHTML = localStorage.getItem("lastorder_ophelia");
}

function sortList(v) {
  var grid = document.getElementById("grid");
  var cards = [];
  for (var i = 0; i < grid.children.length; i++) cards.push(grid.children[i]);

  if (v === "price-asc") {
    cards.sort(function (a, b) {
      return String(a.getAttribute("data-price")) > String(b.getAttribute("data-price")) ? 1 : -1;
    });
  } else if (v === "price-desc") {
    cards.sort(function (a, b) {
      return String(a.getAttribute("data-price")) < String(b.getAttribute("data-price")) ? 1 : -1;
    });
  } else if (v === "name") {
    cards.sort(function (a, b) {
      return a.getAttribute("data-name") > b.getAttribute("data-name") ? 1 : -1;
    });
  }

  grid.innerHTML = "";
  for (var j = 0; j < cards.length; j++) grid.appendChild(cards[j]);
}

function runSearch() {
  var q = document.getElementById("q").value;
  window.location.href = "search.html?q=" + q;
}

function drawSearch() {
  var box = document.getElementById("results");
  if (!box) return;
  var q = window.location.search.split("q=")[1];
  if (!q) { box.innerHTML = "<p>No results.</p>"; return; }
  q = decodeURIComponent(q).toLowerCase();
  document.getElementById("term").innerHTML = q;

  var hits = [];
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].name.toLowerCase().indexOf(q) > -1) hits.push(PRODUCTS[i]);
  }

  if (!hits.length) { box.innerHTML = "<p>No results.</p>"; return; }

  var h = "";
  for (var j = 0; j < hits.length; j++) {
    var p = hits[j];
    h += "<div class='card' onclick=\"location.href='product-" + p.id + ".html'\">";
    h += "<div class='ph'>" + p.init + "</div>";
    h += "<div class='cat'>" + p.category + "</div>";
    h += "<div class='nm'>" + p.name + "</div>";
    h += "<div class='pr'>" + p.priceLabel + "</div></div>";
  }
  box.innerHTML = h;
}

function signIn() { alert("Signed in."); window.location.href = "index.html"; }
function subscribe() { alert("Thanks for signing up."); }
function sendMessage() { alert("Message sent."); }

window.onload = function () {
  paintCount();
  drawCart();
  drawCheckoutSummary();
  showOrderNumber();
  drawSearch();
};
