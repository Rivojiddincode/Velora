import api from "../api/axios";

// filters: { category, ageGroup, minPrice, maxPrice, colors, sizes, search, sort, page, limit }
// javob: { items, total, page, totalPages }
export const getProducts = async (filters = {}) => {
  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v != null));
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProductFilters = async () => {
  const { data } = await api.get("/products/filters");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const resolveImageUrl = (image) => {
  if (!image) return "https://placehold.co/520x380?text=Velora";
  if (image.startsWith("http")) return image;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
  return `${base}${image}`;
};

export const resolveImages = (product) => {
  const list = product?.images?.length ? product.images : [product?.image];
  return list.filter(Boolean).map(resolveImageUrl);
};