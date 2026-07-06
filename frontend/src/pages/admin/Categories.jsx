import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

const Categories = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getCategories()
      .then((data) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing._id, { name });
      } else {
        await createCategory({ name });
      }
      load();
      setName("");
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const startEdit = (c) => {
    setEditing(c);
    setName(c.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div className="admin-page categories-page">
      <div className="page-header">
        <h1>{t("admin.categories")}</h1>
        <button className="primary-button" onClick={openCreate}>+ {t("admin.add")}</button>
      </div>

      {showForm && (
        <section className="table-card settings-form-card">
          <div className="section-header">
            <h2>{editing ? t("admin.edit") : t("admin.add")}</h2>
          </div>
          <form className="settings-form" onSubmit={save}>
            <label>
              {t("category.name")}
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="primary-button" type="submit">{t("admin.save")}</button>
              <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setName(""); setShowForm(false); }}>{t("admin.cancel")}</button>
            </div>
          </form>
        </section>
      )}

      <section className="table-card">
        <div className="section-header"><h2>{t("admin.categories")}</h2></div>
        {loading ? <p>...</p> : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nomi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td className="flex" style={{ gap: 8 }}>
                      <button className="btn-ghost" onClick={() => startEdit(c)}>{t("admin.edit")}</button>
                      <button className="text-button" onClick={() => handleDelete(c._id)}>{t("admin.delete")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Categories;
