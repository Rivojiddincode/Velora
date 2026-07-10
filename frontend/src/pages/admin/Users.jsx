import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getUsers, deleteUser, updateUserRole } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) return;
    await deleteUser(id);
    load();
  };

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    load();
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((u) =>
      [u.name, u.email, u.phone, u.role]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [users, search]);

  return (
    <div className="admin-page users-page">
      <div className="page-header">
        <h1>{t("admin.users")}</h1>
      </div>

      <section className="table-card">
        <div className="section-header">
          <h2>{t("admin.users")}</h2>
        </div>

        {loading ? (
          <p>...</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Rol</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                      {t("admin.noResultsFound")}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?.id}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => handleDelete(u._id)}
                        disabled={u._id === currentUser?.id}
                      >
                        {t("admin.delete")}
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Users;
