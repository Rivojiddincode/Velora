import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RiShieldCheckLine,
  RiTimerFlashLine,
  RiRefreshLine,
  RiAwardLine,
  RiPriceTag3Line,
  RiHeadphoneLine,
  RiHeartLine,
  RiHeartFill,
  RiStarFill,
  RiShoppingCart2Line,
  RiArrowRightLine,
  RiMailLine,
} from "react-icons/ri";
import { getProducts, getProductFilters, resolveImageUrl } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Home.css";

const CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
  "https://images.unsplash.com/photo-1519457851160-59d51e4b0e50?w=500&q=80",
  "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=500&q=80",
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80",
  "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=900&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80",
  "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900&q=80",
];

const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getProducts({ featured: true, limit: 5 })
      .then((data) => setFeaturedProducts(data.items))
      .catch(() => setFeaturedProducts([]));

    getProductFilters()
      .then((meta) => {
        const ageCards = (meta.ageGroups || []).map((a) => ({
          key: a.name,
          label: a.name === "kids" ? t("shop.kids") : t("shop.adults"),
          count: a.count,
          type: "ageGroup",
        }));
        const categoryCards = (meta.categories || [])
          .sort((a, b) => b.count - a.count)
          .map((c) => ({ key: c.name, label: c.name, count: c.count, type: "category" }));

        setCategories([...ageCards, ...categoryCards].slice(0, 4));
      })
      .catch(() => setCategories([]));
  }, [t]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-badge">{t("home.badge")}</span>
          <h1>{t("home.heroTitle")}</h1>
          <p>{t("home.subtitle2")}</p>
          <div className="hero-buttons">
            <Link to="/shop" className="hero-button primary">
              {t("home.shopButton")} <RiArrowRightLine />
            </Link>
            <Link to="/shop" className="hero-button secondary">
              {t("home.collectionButton")}
            </Link>
          </div>

          <div className="hero-trust-row">
            <div>
              <RiShieldCheckLine />
              <div>
                <strong>{t("home.trust1Title")}</strong>
                <span>{t("home.trust1Desc")}</span>
              </div>
            </div>
            <div>
              <RiTimerFlashLine />
              <div>
                <strong>{t("home.trust2Title")}</strong>
                <span>{t("home.trust2Desc")}</span>
              </div>
            </div>
            <div>
              <RiRefreshLine />
              <div>
                <strong>{t("home.trust3Title")}</strong>
                <span>{t("home.trust3Desc")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          {HERO_IMAGES.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Velora collection"
              className={idx === heroSlide ? "hero-slide active" : "hero-slide"}
            />
          ))}
          <div className="hero-dots">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={idx === heroSlide ? "hero-dot active" : "hero-dot"}
                onClick={() => setHeroSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="section-header">
            <h2>{t("home.categoriesTitle")}</h2>
            <Link to="/shop" className="view-all-link">
              {t("home.viewAll")} <RiArrowRightLine />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <Link
                key={cat.key}
                to={cat.type === "ageGroup" ? `/shop?ageGroup=${cat.key}` : `/shop?category=${encodeURIComponent(cat.key)}`}
                className="category-card"
              >
                <img src={CATEGORY_IMAGES[idx % CATEGORY_IMAGES.length]} alt={cat.label} />
                <div className="category-overlay">
                  <span className="category-name">{cat.label}</span>
                  <span className="category-count">
                    {cat.count} {t("shop.products")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>{t("home.featuredTitle")}</h2>
            <Link to="/shop" className="view-all-link">
              {t("home.viewAll")} <RiArrowRightLine />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
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
                  <p className="product-category">{product.brand || "Velora"}</p>
                  {product.reviewsCount > 0 && (
                    <div className="card-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <RiStarFill key={i} className={i < Math.round(product.rating) ? "filled" : ""} />
                      ))}
                      <span>
                        {product.rating?.toFixed(1)} ({product.reviewsCount})
                      </span>
                    </div>
                  )}
                  <div className="product-actions">
                    <span className="price">{product.price?.toLocaleString()} so'm</span>
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
        </section>
      )}

      {/* PERKS */}
      <section className="perks-section">
        <div>
          <RiAwardLine />
          <div>
            <strong>{t("home.perk1Title")}</strong>
            <span>{t("home.perk1Desc")}</span>
          </div>
        </div>
        <div>
          <RiPriceTag3Line />
          <div>
            <strong>{t("home.perk2Title")}</strong>
            <span>{t("home.perk2Desc")}</span>
          </div>
        </div>
        <div>
          <RiRefreshLine />
          <div>
            <strong>{t("home.perk3Title")}</strong>
            <span>{t("home.perk3Desc")}</span>
          </div>
        </div>
        <div>
          <RiHeadphoneLine />
          <div>
            <strong>{t("home.perk4Title")}</strong>
            <span>{t("home.perk4Desc")}</span>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-icon">
          <RiMailLine />
        </div>
        <div className="newsletter-text">
          <strong>{t("home.newsletterTitle")}</strong>
          <span>{t("home.newsletterDesc")}</span>
        </div>

        {subscribed ? (
          <p className="newsletter-thanks">{t("home.newsletterThanks")}</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("home.newsletterPlaceholder")}
            />
            <button type="submit">{t("home.newsletterButton")}</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Home;