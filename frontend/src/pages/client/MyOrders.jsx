import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { RiShoppingBag3Line, RiTimeLine } from "react-icons/ri";
import { getMyOrders } from "../../services/orderService";
import { resolveImageUrl } from "../../services/productService";
import "./MyOrders.css";

const STATUS_CLASS = {
  pending: "status-pending",
  processing: "status-processing",
  ready: "status-ready",
  completed: "status-completed",
  cancelled: "status-cancelled",
};

const MyOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <RiShoppingBag3Line className="orders-empty-icon" />
          <h2>{t("cart.orderEmpty")}</h2>
          <p>{t("cart.orderEmptyDesc")}</p>
          <Link to="/shop" className="primary-button">
            {t("shop.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>{t("nav.myOrders")}</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header">
              <div>
                <span className="text-muted">{t("cart.orderId")}</span>
                <p className="order-id">#{order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <span className="text-muted">
                  <RiTimeLine /> {t("cart.orderDate")}
                </span>
                <p>{new Date(order.createdAt).toLocaleDateString(i18n.language || undefined)}</p>
              </div>
              <span className={`order-status-badge ${STATUS_CLASS[order.status] || ""}`}>
                {t(`cart.status${order.status.charAt(0).toUpperCase()}${order.status.slice(1)}`)}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img src={resolveImageUrl(item.image)} alt={item.name} />
                  <div>
                    <p className="order-item-name">{item.name}</p>
                    <span className="text-muted">
                      {item.quantity} x {item.price?.toLocaleString()} {t("common.currency")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span className={`payment-badge ${order.paymentStatus === "paid" ? "paid" : "unpaid"}`}>
                {t("cart.orderPayment")}:{" "}
                {order.paymentStatus === "paid"
                  ? t("cart.paymentPaid")
                  : order.paymentStatus === "failed"
                  ? t("cart.paymentFailed")
                  : t("cart.paymentPending")}
              </span>
              <span className="order-total">
                {t("cart.orderTotal")}: <strong>{order.totalAmount?.toLocaleString()} {t("common.currency")}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;