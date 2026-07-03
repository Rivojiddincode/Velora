import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getSettings } from "../../services/settingsService";
import { createOrder, createPayment } from "../../services/orderService";
import "./Cart.css";

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const [pickupAddress, setPickupAddress] = useState("");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSettings()
      .then((s) => setPickupAddress(s.pickupAddress))
      .catch(() => setPickupAddress(""));
  }, []);

  const handleCheckout = async () => {
    setError("");
    if (!customerName || !customerPhone) {
      setError(t("cart.name") + " / " + t("cart.phone"));
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total,
        pickupAddress,
        customerName,
        customerPhone,
        paymentMethod: "card",
      });

      const payment = await createPayment(order._id);
      clearCart();

      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        navigate("/", { state: { orderPlaced: true } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-page">
      <h1>{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>{t("cart.empty")}</p>
          <Link to="/shop" className="button-link">
            {t("shop.title")}
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item-card" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h3>{item.name}</h3>
                    <span className="item-price">{item.price?.toLocaleString()} so'm</span>
                  </div>
                  <label className="quantity-label">
                    {t("cart.quantity") || "Soni"}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                    />
                  </label>
                  <div className="cart-item-footer">
                    <span className="item-total">{(item.price * item.quantity).toLocaleString()} so'm</span>
                    <button onClick={() => removeFromCart(item._id)} className="text-button">
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>{t("cart.checkout")}</h2>

            <div className="summary-row">
              <span>{t("cart.total")}</span>
              <strong>{total.toLocaleString()} so'm</strong>
            </div>

            <div className="pickup-box">
              <span className="text-muted">{t("cart.pickup")}</span>
              <p>{pickupAddress || "..."}</p>
            </div>

            <label className="checkout-field">
              {t("cart.name")}
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </label>

            <label className="checkout-field">
              {t("cart.phone")}
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+998 90 000 00 00" />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="primary-button" onClick={handleCheckout} disabled={submitting}>
              {submitting ? "..." : t("cart.payWithCard")}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
