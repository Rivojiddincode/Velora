import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RiAddLine, RiPencilLine, RiDeleteBin6Line, RiFolderOpenLine } from "react-icons/ri";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

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
  const [counts, setCounts] = useState({});

  const load = () => {
    setLoading(true);
    getCategories()
      .then((data) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    getProducts({ limit: 200 })
      .then((data) => {
        const map = {};
        (data.items || []).forEach((p) => {
          const key = String(p.category || "").trim().toLowerCase();
          if (key) map[key] = (map[key] || 0) + 1;
        });
        setCounts(map);
      })
      .catch(() => {});
  }, []);

  const getCount = (c) => counts[String(c.name || "").trim().toLowerCase()] || 0;

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
      <div className="categories-header">
        <h1 className="categories-title">{t("admin.categories")}</h1>
        <button className="add-category-btn" onClick={openCreate}>
          <RiAddLine className="add-category-icon" />
          {t("admin.add")}
        </button>
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

      <section className="categories-card">
        {loading ? (
          <div className="categories-loading">...</div>
        ) : list.length === 0 ? (
          <div className="categories-empty">
            <RiFolderOpenLine className="empty-icon" />
            <div className="empty-text">No categories found</div>
            <div className="empty-sub">{t("admin.noResultsFound")}</div>
            <button className="add-category-btn" onClick={openCreate}>
              <RiAddLine className="add-category-icon" />
              {t("admin.add")}
            </button>
          </div>
        ) : (
          <div className="categories-table-wrap">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Products Count</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="categories-empty" style={{ padding: "32px" }}>
                      {t("admin.noResultsFound")}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((c) => {
                    const count = getCount(c);
                    const isActive = count > 0;
                    return (
                      <tr key={c._id} className="categories-row">
                        <td data-label="Image" className="cell-image">
                          <img
                            src={getCategoryImage(c.name)}
                            alt={getDisplayLabel(c.name)}
                            className="category-thumb"
                          />
                        </td>
                        <td data-label="Category Name" className="cell-category">
                          <span className="category-name">{getDisplayLabel(c.name)}</span>
                          <span className="category-sub">{count} products</span>
                        </td>
                        <td data-label="Products Count">
                          <span className="count-badge">{count} Products</span>
                        </td>
                        <td data-label="Status">
                          {isActive ? (
                            <span className="status status-active">
                              <span className="status-dot" /> Active
                            </span>
                          ) : (
                            <span className="status status-empty">
                              <span className="status-dot" /> Empty
                            </span>
                          )}
                        </td>
                        <td data-label="Actions">
                          <div className="cat-actions">
                            <button className="cat-action-btn cat-edit" onClick={() => startEdit(c)}>
                              <RiPencilLine /> {t("admin.edit")}
                            </button>
                            <button
                              className="cat-action-btn cat-delete"
                              onClick={() => handleDelete(c._id)}
                            >
                              <RiDeleteBin6Line /> {t("admin.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
