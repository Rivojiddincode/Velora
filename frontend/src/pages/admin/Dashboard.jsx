import React from "react";

const metrics = [
  { label: "Total Sales", value: "$12,480", change: "+14%", color: "#10b981" },
  { label: "Total Orders", value: "248", change: "+9%", color: "#2563eb" },
  { label: "Products", value: "72", change: "+4%", color: "#f59e0b" },
  { label: "Active Users", value: "1,320", change: "+12%", color: "#ec4899" },
];

const recentOrders = [
  { id: "ORD-1001", customer: "Sara Patel", total: "$248", status: "Delivered", date: "Jun 28" },
  { id: "ORD-1002", customer: "James Fox", total: "$149", status: "Processing", date: "Jun 28" },
  { id: "ORD-1003", customer: "Mia Khan", total: "$92", status: "Pending", date: "Jun 27" },
  { id: "ORD-1004", customer: "Ethan Bell", total: "$324", status: "Delivered", date: "Jun 26" },
];

const Dashboard = () => {
  return (
    <div className="admin-page dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of sales, orders, and product performance.</p>
      </div>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <span className="metric-label">{metric.label}</span>
            <h2>{metric.value}</h2>
            <span className="metric-change" style={{ color: metric.color }}>
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <p>Latest orders coming through the store.</p>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
