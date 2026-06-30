import React from "react";

const orders = [
  { id: "ORD-2001", customer: "Lina Hayes", total: "$235", status: "Delivered", date: "Jun 29" },
  { id: "ORD-2002", customer: "Noah Diaz", total: "$98", status: "Processing", date: "Jun 29" },
  { id: "ORD-2003", customer: "Kim Lee", total: "$179", status: "Cancelled", date: "Jun 28" },
  { id: "ORD-2004", customer: "Mason Reed", total: "$54", status: "Pending", date: "Jun 27" },
];

const Orders = () => {
  return (
    <div className="admin-page orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <p>View and manage incoming orders placed by clients.</p>
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>Recent Orders</h2>
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
            {orders.map((order) => (
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

export default Orders;
