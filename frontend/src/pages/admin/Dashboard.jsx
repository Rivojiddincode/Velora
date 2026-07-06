import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllOrders } from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { getUsers } from "../../services/userService";

const Dashboard = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    getAllOrders().then(setOrders).catch(() => {});
    getProducts({ limit: 1 }).then((data) => setProductsCount(data.total)).catch(() => {});
    getUsers().then((u) => setUsersCount(u.length)).catch(() => {});
  }, []);

  const totalSales = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const metrics = [
    { label: "Sotuv (paid)", value: `${totalSales.toLocaleString()} so'm`, color: "var(--success)" },
    { label: t("admin.orders"), value: orders.length, color: "#2563eb" },
    { label: t("admin.products"), value: productsCount, color: "var(--primary-gold)" },
    { label: t("admin.users"), value: usersCount, color: "#ec4899" },
  ];

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="admin-page dashboard-page">
      <div className="page-header">
        <h1>{t("admin.dashboard")}</h1>
      </div>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <span className="metric-label">{metric.label}</span>
            <h2>{metric.value}</h2>
          </div>
        ))}
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>{t("admin.orders")}</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Jami</th>
                <th>Status</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.customerName || order.user?.name}</td>
                  <td>{order.totalAmount?.toLocaleString()} so'm</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;