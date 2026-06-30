import React from "react";

const users = [
  { id: "U-3001", name: "Amelia Ross", email: "amelia.ross@example.com", role: "Admin", status: "Active" },
  { id: "U-3002", name: "Oliver James", email: "oliver.james@example.com", role: "Editor", status: "Active" },
  { id: "U-3003", name: "Chloe Grant", email: "chloe.grant@example.com", role: "Customer", status: "Blocked" },
  { id: "U-3004", name: "Leo Kim", email: "leo.kim@example.com", role: "Customer", status: "Active" },
];

const Users = () => {
  return (
    <div className="admin-page users-page">
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage store users, roles, and account statuses.</p>
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>Account List</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Users;
