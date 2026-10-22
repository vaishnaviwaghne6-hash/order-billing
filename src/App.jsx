
import { useEffect, useState } from "react";
import "./App.css";

const RATE_PER_LITRE = 5;
const DELIVERY_CHARGE = 30;

const canOptions = [
  { litres: 2, name: "2 Litre Can" },
  { litres: 5, name: "5 Litre Can" },
  { litres: 10, name: "10 Litre Can" },
];

function FillingStation({ litres, orderPlaced }) {
  const [progress, setProgress] = useState(0);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    if (!orderPlaced) {
      setProgress(0);
      setFilling(false);
      return;
    }

    setProgress(0);
    setFilling(true);

    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / duration) * 100)
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(timer);
        setFilling(false);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [orderPlaced, litres]);

  return (
    <section className="filling-station">
      <div className="station-heading">
        <span className="step-label">AQUAPURE WATER STATION</span>
        <h2>Watch your can fill!</h2>
        <p>Fresh, purified water just for you.</p>
      </div>

      <div className="tap-area">
        <div className="tap-handle">
          <span />
        </div>

        <div className="water-tap">
          <div className="tap-top" />
          <div className="tap-body" />
          <div className="tap-neck" />
          <div className="tap-spout" />
          <div className="tap-mouth" />
        </div>

        {filling && (
          <div className="water-stream">
            <span />
            <span />
            <span />
          </div>
        )}

        <div
          className={`filling-can ${
            progress === 100 ? "can-ready" : ""
          }`}
        >
          <div className="filling-cap" />

          <div
            className="filling-water"
            style={{
              height: `${progress * 0.76}%`,
              transition: "height 0.05s linear",
            }}
          >
            <div className="water-wave" />
            <span className="fill-bubble bubble-one" />
            <span className="fill-bubble bubble-two" />
            <span className="fill-bubble bubble-three" />
          </div>

          <div className="filling-can-shine" />

          <div className="filling-face">
            <span className="face-eyes">
              <i />
              <i />
            </span>
            <span className="face-smile" />
            <strong>{litres}L</strong>
          </div>
        </div>

        <div className="filling-status">
          <span className="status-drop">💧</span>
          <div>
            <strong>
              {!orderPlaced
                ? "Ready to fill!"
                : filling
                  ? "Filling your can..."
                  : "Can Ready! ✓"}
            </strong>
            <span>
              {!orderPlaced
                ? "Place your order to start"
                : `${progress}% complete`}
            </span>
          </div>
        </div>
      </div>

      <div className="filling-progress">
        <div
          className="filling-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="filling-caption">
        {!orderPlaced
          ? "💧 Your water filling animation will start after ordering."
          : filling
            ? "✨ Watch the water flow into your can!"
            : "💧 Your fresh water is ready!"}
      </p>
    </section>
  );
}

export default function App() {
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [customLitres, setCustomLitres] = useState("");
  const [orderMode, setOrderMode] = useState("can");
  const [delivery, setDelivery] = useState(true);
  const [payment, setPayment] = useState("UPI");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const enteredLitres = Number(customLitres);

  const totalLitres =
    orderMode === "custom"
      ? enteredLitres
      : selected * quantity;

  const waterTotal = totalLitres * RATE_PER_LITRE;
  const deliveryCharge = delivery ? DELIVERY_CHARGE : 0;
  const grandTotal = waterTotal + deliveryCharge;

  function placeOrder(event) {
    event.preventDefault();
    setError("");

    if (!customer.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all customer details.");
      return;
    }

    if (
      orderMode === "custom" &&
      (!Number.isFinite(enteredLitres) ||
        enteredLitres <= 0 ||
        enteredLitres > 9999)
    ) {
      setError(
        "Please enter a valid quantity between 1 and 9999 litres."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setOrder({
      id: `WTR${Date.now().toString().slice(-7)}`,
      customer: customer.trim(),
      phone: phone.trim(),
      address: address.trim(),
      litresPerCan: orderMode === "custom" ? null : selected,
      quantity: orderMode === "custom" ? 1 : quantity,
      orderMode,
      totalLitres,
      ratePerLitre: RATE_PER_LITRE,
      waterTotal,
      deliveryCharge,
      grandTotal,
      delivery,
      payment,
      paid: false,
      delivered: false,
      date: new Date().toLocaleString("en-IN"),
    });
  }

  function confirmPayment() {
    setOrder((current) => ({
      ...current,
      paid: true,
    }));
  }

  function markDelivered() {
    if (!order?.paid) return;

    setOrder((current) => ({
      ...current,
      delivered: true,
    }));
  }

  function createNewOrder() {
    setOrder(null);
    setCustomer("");
    setPhone("");
    setAddress("");
    setSelected(5);
    setQuantity(1);
    setCustomLitres("");
    setOrderMode("can");
    setDelivery(true);
    setPayment("UPI");
    setError("");
  }

  function printBill() {
    window.print();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-symbol">💧</span>
          <span>
            Aqua<span className="brand-light">Pure</span>
          </span>
        </a>

        <span className="header-tag">
          <span className="live-dot" />
          PURIFIED DRINKING WATER
        </span>
      </header>

      <div className="main-container" id="home">
        <section className="page-intro">
          <div>
            <span className="eyebrow">WATER ORDERING SYSTEM</span>
            <h1>Fresh water, delivered.</h1>
            <p>
              Choose your quantity. Place your order. Stay hydrated.
            </p>
          </div>

          <div className="quality-mark">
            <span>✳</span>
            <div>
              <strong>Pure &amp; Fresh</strong>
              <small>Every single drop</small>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <section className="order-card">
            <div className="card-title">
              <div>
                <span className="step-label">01 / YOUR ORDER</span>
                <h2>Choose your water</h2>
              </div>
              <span className="water-icon">≋</span>
            </div>

            <div className="product-grid">
              {canOptions.map((item) => (
                <button
                  type="button"
                  key={item.litres}
                  className={`product-option ${
                    orderMode === "can" &&
                    selected === item.litres
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelected(item.litres);
                    setOrderMode("can");
                    setCustomLitres("");
                  }}
                  disabled={Boolean(order)}
                >
                  <span className="product-check">
                    {orderMode === "can" &&
                    selected === item.litres
                      ? "✓"
                      : ""}
                  </span>

                  <div
                    className={`cartoon-can can-${item.litres} ${
                      orderMode === "can" &&
                      selected === item.litres
                        ? "can-selected"
                        : ""
                    }`}
                  >
                    <div className="can-cap" />

                    <div className="can-water-fill">
                      <span className="water-bubble bubble-a" />
                      <span className="water-bubble bubble-b" />
                      <span className="water-bubble bubble-c" />
                    </div>

                    <div className="can-shine" />

                    <div className="can-label">
                      <span className="can-drop">💧</span>
                      <span className="can-eyes">
                        <i />
                        <i />
                      </span>
                      <span className="can-smile" />
                      <span className="can-litres">
                        {item.litres}L
                      </span>
                    </div>

                    <span className="can-bubble bubble-one">✦</span>
                    <span className="can-bubble bubble-two">•</span>
                  </div>

                  <strong>{item.name}</strong>
                  <span className="product-price">
                    ₹{item.litres * RATE_PER_LITRE} / can
                  </span>
                </button>
              ))}
            </div>

            <div
              className={`custom-litres-box ${
                orderMode === "custom" ? "custom-litres-active" : ""
              }`}
            >
              <label htmlFor="customLitres">
                Or enter your exact water requirement (litres)
              </label>

              <div className="custom-litres-input-wrap">
                <input
                  id="customLitres"
                  type="number"
                  min="1"
                  max="9999"
                  step="1"
                  inputMode="numeric"
                  value={customLitres}
                  disabled={Boolean(order)}
                  placeholder="Example: 7"
                  onChange={(event) => {
                    const value = event.target.value;
                    setCustomLitres(value);
                    setOrderMode(value !== "" ? "custom" : "can");
                  }}
                />
                <span>litres</span>
              </div>

              <small>
                Enter a custom quantity, or select a water can above.
              </small>
            </div>

            <div className="quantity-row">
              <div>
                <strong>Number of cans</strong>
                <p>
                  {orderMode === "custom"
                    ? "Custom requirement entered directly"
                    : `Each can contains ${selected} litres`}
                </p>
              </div>

              <div className="quantity-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={
                    quantity <= 1 ||
                    Boolean(order) ||
                    orderMode === "custom"
                  }
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={
                    quantity >= 99 ||
                    Boolean(order) ||
                    orderMode === "custom"
                  }
                  onClick={() =>
                    setQuantity((value) => Math.min(99, value + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-water">
              <span>Total water quantity</span>
              <strong>{totalLitres || 0} litres</strong>
            </div>

            <form onSubmit={placeOrder}>
              <div className="form-heading">
                <span className="step-label">
                  02 / CUSTOMER DETAILS
                </span>
                <h2>Where should we deliver?</h2>
              </div>

              <div className="field">
                <label htmlFor="customer">Full name</label>
                <input
                  id="customer"
                  value={customer}
                  onChange={(event) =>
                    setCustomer(event.target.value)
                  }
                  placeholder="Enter customer name"
                  required
                  disabled={Boolean(order)}
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                  required
                  disabled={Boolean(order)}
                />
              </div>

              <div className="field">
                <label htmlFor="address">Delivery address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="House number, street, area..."
                  rows={3}
                  required
                  disabled={Boolean(order)}
                />
              </div>

              <div className="delivery-option">
                <div className="delivery-copy">
                  <span className="delivery-icon">⌂</span>
                  <div>
                    <strong>Home delivery</strong>
                    <p>
                      {delivery
                        ? `Delivery charge: ₹${DELIVERY_CHARGE}`
                        : "Pickup — no delivery charge"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`toggle ${
                    delivery ? "toggle-on" : ""
                  }`}
                  aria-label="Toggle home delivery"
                  aria-pressed={delivery}
                  disabled={Boolean(order)}
                  onClick={() =>
                    setDelivery((value) => !value)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="form-heading payment-heading">
                <span className="step-label">03 / PAYMENT</span>
                <h2>Choose payment method</h2>
              </div>

              <div className="payment-options">
                {[
                  { name: "UPI", detail: "UPI payment", icon: "↗" },
                  { name: "Cash", detail: "Cash payment", icon: "₹" },
                  {
                    name: "Card",
                    detail: "Debit / credit",
                    icon: "▤",
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    disabled={Boolean(order)}
                    onClick={() => setPayment(item.name)}
                    className={`payment-option ${
                      payment === item.name
                        ? "payment-selected"
                        : ""
                    }`}
                  >
                    <span className="payment-icon">
                      {item.icon}
                    </span>
                    <span>{item.detail}</span>
                    <span className="payment-radio">
                      {payment === item.name ? "●" : "○"}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <p className="error-message">{error}</p>
              )}

              {!order && (
                <button className="primary-button" type="submit">
                  Place order <span>→</span>
                </button>
              )}

              {order && !order.paid && (
                <div className="payment-confirm">
                  <p>
                    Order created successfully. Confirm the selected{" "}
                    {order.payment} payment to generate your paid bill.
                  </p>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={confirmPayment}
                  >
                    Confirm demo payment · ₹{order.grandTotal}
                  </button>

                  <small>
                    Demo only. This does not collect real money.
                  </small>
                </div>
              )}
            </form>
          </section>

          <div className="station-column">
            <FillingStation
              litres={order?.totalLitres || totalLitres || selected}
              orderPlaced={Boolean(order)}
            />

            <aside className="summary-column">
              <section className="summary-card">
                <span className="step-label">ORDER SUMMARY</span>
                <h2>Your bill</h2>

                <div className="summary-product">
                  <div className="summary-water-icon">💧</div>

                  <div>
                    <strong>
                      {order
                        ? order.orderMode === "custom"
                          ? "Custom Water Requirement"
                          : `${order.litresPerCan} Litre Water Can`
                        : orderMode === "custom"
                          ? "Custom Water Requirement"
                          : `${selected} Litre Water Can`}
                    </strong>

                    <span>
                      {order
                        ? `${order.totalLitres} litres requested`
                        : orderMode === "custom"
                          ? `${totalLitres} litres requested`
                          : `${quantity} can${
                              quantity > 1 ? "s" : ""
                            } · ${totalLitres} litres`}
                    </span>
                  </div>

                  <strong>
                    ₹{order ? order.waterTotal : waterTotal}
                  </strong>
                </div>

                <div className="price-line">
                  <span>Rate per litre</span>
                  <strong>₹{RATE_PER_LITRE}</strong>
                </div>

                <div className="price-line">
                  <span>
                    Water charges (
                    {order ? order.totalLitres : totalLitres} L)
                  </span>
                  <strong>
                    ₹{order ? order.waterTotal : waterTotal}
                  </strong>
                </div>

                <div className="price-line">
                  <span>Delivery charges</span>
                  <strong>
                    ₹{order ? order.deliveryCharge : deliveryCharge}
                  </strong>
                </div>

                <div className="bill-total">
                  <span>Total amount</span>
                  <strong>
                    ₹{order ? order.grandTotal : grandTotal}
                  </strong>
                </div>

                <p className="tax-note">
                  Sample rates. Update the rate per litre and delivery
                  charge according to your business.
                </p>

                {order && (
                  <div className="confirmed-total">
                    <span>Order total</span>
                    <strong>₹{order.grandTotal}</strong>
                  </div>
                )}
              </section>

              {order && (
                <section className="receipt-card" id="receipt">
                  <div className="receipt-heading">
                    <div>
                      <span className="step-label">ORDER RECEIPT</span>
                      <h2>
                        {order.paid ? "Payment bill" : "Order details"}
                      </h2>
                    </div>

                    <span
                      className={`receipt-status ${
                        order.delivered
                          ? "delivered"
                          : order.paid
                            ? "paid"
                            : ""
                      }`}
                    >
                      {order.delivered
                        ? "Delivered"
                        : order.paid
                          ? "Paid"
                          : "Awaiting payment"}
                    </span>
                  </div>

                  <div className="receipt-details">
                    <div>
                      <span>Order ID</span>
                      <strong>{order.id}</strong>
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{order.customer}</strong>
                    </div>
                    <div>
                      <span>Mobile</span>
                      <strong>{order.phone}</strong>
                    </div>
                    <div>
                      <span>Water quantity</span>
                      <strong>{order.totalLitres} litres</strong>
                    </div>
                    <div>
                      <span>Rate per litre</span>
                      <strong>₹{order.ratePerLitre}</strong>
                    </div>
                    <div>
                      <span>Water charges</span>
                      <strong>₹{order.waterTotal}</strong>
                    </div>
                    <div>
                      <span>Delivery charges</span>
                      <strong>₹{order.deliveryCharge}</strong>
                    </div>
                    <div>
                      <span>Payment method</span>
                      <strong>{order.payment}</strong>
                    </div>
                    <div>
                      <span>Order date</span>
                      <strong>{order.date}</strong>
                    </div>
                  </div>

                  <div className="receipt-address">
                    <span>Delivery address</span>
                    <p>{order.address}</p>
                  </div>

                  <div className="receipt-total">
                    <span>Total bill</span>
                    <strong>₹{order.grandTotal}</strong>
                  </div>

                  {order.paid && (
                    <p className="success-message">
                      ✓ Demo payment confirmed.
                    </p>
                  )}

                  {order.paid && !order.delivered && (
                    <button
                      className="primary-button delivery-button"
                      type="button"
                      onClick={markDelivered}
                    >
                      Mark water as delivered ✓
                    </button>
                  )}

                  {order.delivered && (
                    <p className="success-message">
                      ✓ Order delivered successfully.
                    </p>
                  )}

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={printBill}
                  >
                    Print / Save bill
                  </button>

                  <button
                    className="new-order-button"
                    type="button"
                    onClick={createNewOrder}
                  >
                    + Create new order
                  </button>
                </section>
              )}

              <section className="service-note">
                <span className="service-symbol">✳</span>
                <div>
                  <strong>Pure water. Simple ordering.</strong>
                  <p>
                    Order the quantity you need, with transparent pricing.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer className="page-footer">
          <span>AQUAPURE · WATER ORDERING</span>
          <span>Every drop matters.</span>
        </footer>
      </div>
    </main>
  );
}