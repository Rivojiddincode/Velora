import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RiCloseLine,
  RiStarFill,
  RiSubtractLine,
  RiAddLine,
  RiDeleteBinLine,
  RiMapPinLine,
  RiUserLine,
  RiPhoneLine,
  RiLockLine,
  RiShieldCheckLine,
  RiRefreshLine,
  RiShieldKeyholeLine,
} from "react-icons/ri";
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
  const [paymentMethod, setPaymentMethod] = useState("card");
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
        paymentMethod,
      });

      if (paymentMethod === "card") {
        const payment = await createPayment(order._id);
        clearCart();
        if (payment.paymentUrl) {
          window.location.href = payment.paymentUrl;
          return;
        }
      } else {
        clearCart();
      }

      navigate("/my-orders", { state: { orderPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-breadcrumb">
        <Link to="/">{t("nav.home")}</Link>
        <span>/</span>
        <span className="current">{t("cart.title")}</span>
      </div>
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
          <div className="cart-left">
            <div className="cart-items-card">
              <h2>
                {t("cart.title")} <span className="count-badge">({items.length} {t("cart.itemsCount")})</span>
              </h2>

              <div className="cart-items">
                {items.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="cart-item-meta">
                            {item.brand || "Velora"}
                            {item.category ? ` • ${item.category}` : ""}
                          </p>
                          {item.reviewsCount > 0 && (
                            <div className="cart-item-rating">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <RiStarFill key={i} className={i < Math.round(item.rating) ? "filled" : ""} />
                              ))}
                              <span>
                                {item.rating?.toFixed(1)} ({item.reviewsCount})
                              </span>
                            </div>
                          )}
                          {(item.size || item.color) && (
                            <p className="cart-item-options">
                              {item.size && (
                                <span>
                                  {t("product.details")} {t("shop.size") || "Size"}: <strong>{item.size}</strong>
                                </span>
                              )}
                              {item.color && (
                                <span>
                                  {t("shop.color")}: <strong>{item.color}</strong>
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="cart-item-close"
                          onClick={() => removeFromCart(item._id)}
                          aria-label={t("cart.remove")}
                        >
                          <RiCloseLine />
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-item-qty">
                          <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                            <RiSubtractLine />
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                            <RiAddLine />
                          </button>
                        </div>

                        <div className="cart-item-price-block">
                          <span className="cart-item-price">
                            {(item.price * item.quantity).toLocaleString()} {t("cart.currency")}
                          </span>
                          <button
                            type="button"
                            className="cart-item-remove"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <RiDeleteBinLine /> {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-trust-row">
              <div>
                <RiShieldCheckLine />
                <div>
                  <strong>{t("cart.trustSafeTitle")}</strong>
                  <span>{t("cart.trustSafeDesc")}</span>
                </div>
              </div>
              <div className="trust-divider"></div>
              <div>
                <RiRefreshLine />
                <div>
                  <strong>{t("cart.trustEasyTitle")}</strong>
                  <span>{t("cart.trustEasyDesc")}</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="cart-summary">
            <h2>{t("cart.checkout")}</h2>

            <div className="summary-row">
              <span>{t("cart.subtotal")}</span>
              <span>{total.toLocaleString()} {t("cart.currency")}</span>
            </div>
            <div className="summary-row">
              <span>{t("cart.serviceType")}</span>
              <span className="highlight-green">{t("cart.pickupFromStore")}</span>
            </div>
            <div className="summary-row">
              <span>{t("cart.discount")}</span>
              <span className="text-muted">{t("cart.none")}</span>
            </div>
            <div className="summary-row">
              <span>{t("cart.tax")}</span>
              <span className="text-muted">{t("cart.included")}</span>
            </div>

            <div className="summary-total-row">
              <span>{t("cart.total")}</span>
              <strong>{total.toLocaleString()} {t("cart.currency")}</strong>
            </div>

            <label className="checkout-field">
              <RiMapPinLine /> {t("cart.pickup")}
            </label>
            <div className="checkout-static-value">
              <RiMapPinLine />
              <span>{pickupAddress || "..."}</span>
            </div>

            <label className="checkout-field">
              <RiUserLine /> {t("cart.name")}
            </label>
            <div className="checkout-input-icon">
              <RiUserLine />
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>

            <label className="checkout-field">
              <RiPhoneLine /> {t("cart.phone")}
            </label>
            <div className="checkout-input-icon">
              <RiPhoneLine />
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+998 90 000 00 00"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <label className="checkout-field">{t("cart.checkout")}</label>
            <div className="payment-method-options">
              <button
                type="button"
                className={paymentMethod === "card" ? "payment-option active" : "payment-option"}
                onClick={() => setPaymentMethod("card")}
              >
                <RiLockLine />
                <div>
                  <strong>{t("cart.paymentCardTitle")}</strong>
                  <span>{t("cart.paymentCardDesc")}</span>
                </div>
              </button>
              <button
                type="button"
                className={paymentMethod === "cash" ? "payment-option active" : "payment-option"}
                onClick={() => setPaymentMethod("cash")}
              >
                <RiMapPinLine />
                <div>
                  <strong>{t("cart.paymentCashTitle")}</strong>
                  <span>{t("cart.paymentCashDesc")}</span>
                </div>
              </button>
            </div>

            <button className="pay-button" onClick={handleCheckout} disabled={submitting}>
              {paymentMethod === "card" ? <RiLockLine /> : <RiMapPinLine />}
              {submitting
                ? "..."
                : paymentMethod === "card"
                ? t("cart.payWithCard")
                : t("cart.placeOrder")}
            </button>

            <p className="secure-note">
              <RiShieldKeyholeLine /> {t("cart.secureNote")}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;