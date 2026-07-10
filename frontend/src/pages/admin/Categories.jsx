import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

const CATEGORY_IMAGES = {
  women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
  men: "https://images.unsplash.com/photo-1519457851160-59d51e4b0e50?w=500&q=80",
  car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
  default: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=500&q=80",
};

const Categories = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
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

  const getDisplayLabel = (name) => {
    const normalized = String(name || "").trim().toLowerCase();
    const map = {
      women: t("home.categoryWomen"),
      ayollar: t("home.categoryWomen"),
      men: t("home.categoryMen"),
      erkak: t("home.categoryMen"),
      erkaklar: t("home.categoryMen"),
      mujskoy: t("home.categoryMen"),
      car: t("home.categoryCar"),
      avto: t("home.categoryCar"),
    };
    return map[normalized] || name;
  };

  const getCategoryImage = (name) => {
    const normalized = String(name || "").trim().toLowerCase();
    if (normalized.includes("women") || normalized.includes("ayollar") || normalized.includes("girl")) return CATEGORY_IMAGES.women;
    if (normalized.includes("men") || normalized.includes("mujskoy") || normalized.includes("erkak") || normalized.includes("male") || normalized.includes("boy")) return CATEGORY_IMAGES.men;
    if (normalized.includes("car") || normalized.includes("avto") || normalized.includes("auto")) return CATEGORY_IMAGES.car;
    return CATEGORY_IMAGES.default;
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

  const filteredList = useMemo(() => {
    if (!search) return list;
    return list.filter((c) =>
      String(c.name || "")
        .toLowerCase()
        .includes(search)
    );
  }, [list, search]);

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
                  <th>Rasm</th>
                  <th>Nomi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                      {t("admin.noResultsFound")}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <img src={getCategoryImage(c.name)} alt={getDisplayLabel(c.name)} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} />
                    </td>
                    <td>{getDisplayLabel(c.name)}</td>
                    <td className="flex" style={{ gap: 8 }}>
                      <button className="btn-ghost" onClick={() => startEdit(c)}>{t("admin.edit")}</button>
                      <button className="text-button" onClick={() => handleDelete(c._id)}>{t("admin.delete")}</button>
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

export default Categories;
