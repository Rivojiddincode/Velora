import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RiPencilLine, RiDeleteBin6Line } from "react-icons/ri";
import "./Products.css";
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
      <div className="products-header">
        <h1 className="products-title">{t("admin.products")}</h1>
        <button className="add-product-btn" onClick={openCreate}>
          <span className="add-product-icon">+</span>
          {t("admin.add")}
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

      <section className="products-card">
        {loading ? (
          <div className="products-loading">...</div>
        ) : (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Age Group</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="products-empty">
                      {t("admin.noResultsFound")}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const stock = Number(product.stock) || 0;
                    const stockClass =
                      stock > 10 ? "stock-green" : stock >= 1 ? "stock-yellow" : "stock-red";
                    return (
                      <tr key={product._id} className="products-row">
                        <td data-label="Image" className="cell-image">
                          <img
                            src={resolveImageUrl(product.image)}
                            alt={product.name}
                            className="product-thumb"
                          />
                        </td>
                        <td data-label="Product" className="cell-product">
                          <span className="product-name">{product.name}</span>
                          <span className="product-sub">
                            {product.sku || (product.description ? product.description.slice(0, 48) : "—")}
                          </span>
                        </td>
                        <td data-label="Category" className="cell-category">
                          <span className="badge badge-category">{product.category}</span>
                        </td>
                        <td data-label="Age Group" className="cell-age">
                          {product.ageGroup === "kids" ? t("shop.kids") : t("shop.adults")}
                        </td>
                        <td data-label="Stock" className="cell-stock">
                          <span className={`badge ${stockClass}`}>{stock}</span>
                        </td>
                        <td data-label="Price" className="cell-price">
                          {product.price?.toLocaleString()}
                          <span className="price-cur">so'm</span>
                        </td>
                        <td data-label="Featured" className="cell-featured">
                          {product.featured ? (
                            <span className="featured-yes">⭐ Featured</span>
                          ) : (
                            <span className="featured-no">— Not Featured</span>
                          )}
                        </td>
                        <td data-label="Actions" className="cell-actions">
                          <div className="actions">
                            <button className="action-btn action-edit" onClick={() => openEdit(product)}>
                              <RiPencilLine /> {t("admin.edit")}
                            </button>
                            <button
                              className="action-btn action-delete"
                              onClick={() => handleDelete(product._id)}
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

export default Products;