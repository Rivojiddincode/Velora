import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resolveImageUrl,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  ageGroup: "adults",
  stock: "",
  brand: "Velora",
  sku: "",
  sizes: "",
  colors: "",
  featured: false,
  images: [],
};

const Products = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const load = () => {
    setLoading(true);
    getProducts({ limit: 200 })
      .then((data) => setProducts(data.items))
      .catch(() => setError("Mahsulotlarni yuklab bo'lmadi"))
      .finally(() => setLoading(false));

    getCategories()
      .then(setCategoriesList)
      .catch(() => {});
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      ageGroup: p.ageGroup || "adults",
      stock: p.stock,
      brand: p.brand || "Velora",
      sku: p.sku || "",
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      featured: p.featured || false,
      images: [],
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? Array.from(files) : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => fd.append("images", file));
      } else if (key === "featured") {
        fd.append(key, value ? "true" : "false");
      } else if (value !== null && value !== "") {
        fd.append(key, value);
      }
    });
    try {
      if (editingId) {
        await updateProduct(editingId, fd);
      } else {
        await createProduct(fd);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    await deleteProduct(id);
    load();
  };

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      [p.name, p.category, p.brand, p.sku, p.ageGroup]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search))
    );
  }, [products, search]);

  return (
    <div className="admin-page products-page">
      <div className="page-header">
        <h1>{t("admin.products")}</h1>
        <button className="primary-button" onClick={openCreate}>
          + {t("admin.add")}
        </button>
      </div>

      {showForm && (
        <section className="table-card settings-form-card">
          <div className="section-header">
            <h2>{editingId ? t("admin.edit") : t("admin.add")}</h2>
          </div>
          {error && <p className="text-error">{error}</p>}
          <form className="settings-form" onSubmit={handleSubmit}>
            <label>
              Nomi
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Tavsif
              <input name="description" value={form.description} onChange={handleChange} />
            </label>
            <label>
              Narx (so'm)
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
            </label>
            <label>
              Brend
              <input name="brand" value={form.brand} onChange={handleChange} />
            </label>
            <label>
              Kategoriya
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Kategoriyani tanlang...</option>
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Yosh guruhi
              <select name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                <option value="adults">{t("shop.adults")}</option>
                <option value="kids">{t("shop.kids")}</option>
              </select>
            </label>
            <label>
              Ombordagi soni
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
            </label>
            <label>
              SKU (mahsulot kodi)
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="VLR-2024-NVY" />
            </label>
            <label>
              O'lchamlar (vergul bilan ajrating)
              <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL, XXL" />
            </label>
            <label>
              Ranglar (CSS rang nomi yoki hex, vergul bilan)
              <input name="colors" value={form.colors} onChange={handleChange} placeholder="#0b1c3d, black, gray" />
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Tanlangan mahsulotlarda ko'rsatish (Home sahifasida chiqadi)
            </label>

            <label>
              Rasmlar (bir nechtasini tanlash mumkin)
              <input type="file" name="images" accept="image/*" multiple onChange={handleChange} />
            </label>

            <div className="flex" style={{ gap: "0.75rem" }}>
              <button type="submit" className="primary-button">
                {t("admin.save")}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                {t("admin.cancel")}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="table-card">
        <div className="section-header">
          <h2>{t("admin.products")}</h2>
        </div>

        {loading ? (
          <p>...</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nomi</th>
                  <th>Kategoriya</th>
                  <th>Yosh</th>
                  <th>Ombor</th>
                  <th>Narx</th>
                  <th>Tanlangan</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "1rem" }}>
                      {t("admin.noResults") || "Natija topilmadi"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={resolveImageUrl(product.image)}
                        alt={product.name}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.ageGroup === "kids" ? t("shop.kids") : t("shop.adults")}</td>
                    <td>{product.stock}</td>
                    <td>{product.price?.toLocaleString()} so'm</td>
                    <td>{product.featured ? "⭐" : "—"}</td>
                    <td className="flex" style={{ gap: "0.5rem" }}>
                      <button className="btn-ghost" onClick={() => openEdit(product)}>
                        {t("admin.edit")}
                      </button>
                      <button className="text-button" onClick={() => handleDelete(product._id)}>
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

export default Products;