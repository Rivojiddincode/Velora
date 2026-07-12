import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RiSearchLine,
  RiHeartLine,
  RiHeartFill,
  RiStarFill,
  RiShoppingCart2Line,
  RiRefreshLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { getProducts, getProductFilters, resolveImageUrl } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Shop.css";

const Shop = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [searchParams] = useSearchParams();
  const [meta, setMeta] = useState({ categories: [], ageGroups: [], colors: [], sizes: [], priceMin: 0, priceMax: 0, total: 0 });
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [ageGroup, setAgeGroup] = useState(searchParams.get("ageGroup") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

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
      kids: t("shop.kids"),
      adults: t("shop.adults"),
    };
    return map[normalized] || name;
  };

  useEffect(() => {
    getProductFilters()
      .then((data) => {
        setMeta(data);
        setMinPrice(data.priceMin ? String(data.priceMin) : "");
        setMaxPrice(data.priceMax ? String(data.priceMax) : "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => setPage(1), [searchTerm, category, ageGroup, minPrice, maxPrice, selectedColors, selectedSizes, sort]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      getProducts({
        search: searchTerm,
        category,
        ageGroup,
        minPrice,
        maxPrice,
        colors: selectedColors.join(","),
        sizes: selectedSizes.join(","),
        sort,
        page,
        limit: 8,
      })
        .then((data) => {
          setProducts(data.items);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        })
        .catch(() => {
          setProducts([]);
          setTotal(0);
          setTotalPages(1);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, category, ageGroup, minPrice, maxPrice, selectedColors, selectedSizes, sort, page]);

  const toggleColor = (color) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("");
    setAgeGroup("");
    setMinPrice(meta.priceMin ? String(meta.priceMin) : "");
    setMaxPrice(meta.priceMax ? String(meta.priceMax) : "");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSort("popular");
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className="shop-page">
      <header className="shop-header">
        <div>
          <h1>{t("shop.title")}</h1>
          <p className="shop-subtitle">{t("home.heroSubtitle")}</p>
        </div>
        <div className="shop-search-box">
          <RiSearchLine />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("shop.search")}
          />
        </div>
      </header>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <h3>{t("shop.categories")}</h3>
            <button
              type="button"
              className={category === "" && ageGroup === "" ? "sidebar-cat active" : "sidebar-cat"}
              onClick={() => {
                setCategory("");
                setAgeGroup("");
              }}
            >
              <span>{t("shop.allProducts")}</span>
              <span className="count">{meta.total}</span>
            </button>
            {meta.categories.map((c) => (
              <button
                key={c.name}
                type="button"
                className={category === c.name ? "sidebar-cat active" : "sidebar-cat"}
                onClick={() => setCategory(c.name)}
              >
                <span>{getDisplayLabel(c.name)}</span>
                <span className="count">{c.count}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <h3>{t("shop.price")}</h3>
            <div className="price-inputs">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={t("shop.min")}
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={t("shop.max")}
              />
              <span className="text-muted">{t("common.currency")}</span>
            </div>
            {meta.priceMax > 0 && (
              <input
                type="range"
                min={meta.priceMin}
                max={meta.priceMax}
                value={maxPrice || meta.priceMax}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-slider"
              />
            )}
          </div>

          {meta.colors.length > 0 && (
            <div className="sidebar-section">
              <h3>{t("shop.color")}</h3>
              <div className="color-swatches">
                {meta.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={selectedColors.includes(color) ? "swatch active" : "swatch"}
                    style={{ background: color }}
                    onClick={() => toggleColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {meta.sizes.length > 0 && (
            <div className="sidebar-section">
              <h3>{t("shop.size")}</h3>
              <div className="size-chips">
                {meta.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={selectedSizes.includes(size) ? "size-chip active" : "size-chip"}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="button" className="reset-filters-btn" onClick={resetFilters}>
            <RiRefreshLine /> {t("shop.resetFilters")}
          </button>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t("shop.allProducts")}</option>
              {meta.categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {getDisplayLabel(c.name)}
                </option>
              ))}
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">{t("shop.sortPopular")}</option>
              <option value="newest">{t("shop.sortNew")}</option>
              <option value="price_asc">{t("shop.sortPriceAsc")}</option>
              <option value="price_desc">{t("shop.sortPriceDesc")}</option>
              <option value="rating">{t("shop.sortRating")}</option>
            </select>

            <span className="results-count">
              {t("shop.found")}: {total} {t("shop.products")}
            </span>
          </div>

          <div className="product-grid">
            {!loading && products.length === 0 && <p className="empty-state">{t("shop.noProducts")}</p>}
            {products.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-card-image">
                  <Link to={`/product/${product._id}`}>
                    <img src={resolveImageUrl(product.image)} alt={product.name} />
                  </Link>
                  <button
                    type="button"
                    className="wishlist-heart"
                    onClick={() =>
                      toggleWishlist({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        brand: product.brand,
                      })
                    }
                  >
                    {isWishlisted(product._id) ? <RiHeartFill className="filled" /> : <RiHeartLine />}
                  </button>
                </div>
                <div className="product-card-body">
                  <h3>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-category">
                    {product.category} {product.brand ? `• ${product.brand}` : ""}
                  </p>
                  {product.reviewsCount > 0 ? (
                    <div className="card-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <RiStarFill key={i} className={i < Math.round(product.rating) ? "filled" : ""} />
                      ))}
                      <span>
                        {product.rating?.toFixed(1)} ({product.reviewsCount})
                      </span>
                    </div>
                  ) : (
                    <span className="new-badge">{t("shop.newBadge")}</span>
                  )}
                  <div className="product-actions">
                    <span className="price">{product.price?.toLocaleString()} {t("common.currency")}</span>
                    <button
                      type="button"
                      className="add-cart-btn"
                      onClick={() =>
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          image: resolveImageUrl(product.image),
                          brand: product.brand,
                          category: product.category,
                          rating: product.rating,
                          reviewsCount: product.reviewsCount,
                        })
                      }
                      disabled={product.stock === 0}
                    >
                      <RiShoppingCart2Line />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <RiArrowLeftSLine />
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === page ? "active" : ""}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <RiArrowRightSLine />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;