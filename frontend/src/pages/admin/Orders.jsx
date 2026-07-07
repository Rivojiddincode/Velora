import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from "../../services/orderService";

const STATUSES = ["pending", "processing", "ready", "completed", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    await updatePaymentStatus(id, paymentStatus);
    load();
  };

  return (
    <div className="admin-page orders-page">
      <div className="page-header">
        <h1>{t("admin.orders")}</h1>
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>{t("admin.orders")}</h2>
        </div>

        {loading ? (
          <p>...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Jami</th>
                <th>To'lov usuli</th>
                <th>To'lov holati</th>
                <th>Buyurtma holati</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.customerName || order.user?.name}</td>
                  <td>{order.customerPhone || order.user?.phone}</td>
                  <td>{order.totalAmount?.toLocaleString()} so'm</td>
                  <td>{order.paymentMethod === "cash" ? "Punktda" : "Karta (inPAY)"}</td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Orders;