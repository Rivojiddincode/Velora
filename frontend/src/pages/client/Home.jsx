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

const CATEGORY_IMAGES = {
  women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
  men: "https://images.unsplash.com/photo-1519457851160-59d51e4b0e50?w=500&q=80",
  car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
  default: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=500&q=80",
};

const CATEGORY_FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#f5f5f5"/>
    <rect x="60" y="70" width="680" height="360" rx="24" fill="#ffffff" stroke="#d9d9d9" stroke-width="3"/>
    <rect x="120" y="150" width="220" height="140" rx="18" fill="#e8e8e8"/>
    <rect x="380" y="150" width="280" height="24" rx="12" fill="#d9d9d9"/>
    <rect x="380" y="195" width="220" height="18" rx="9" fill="#ececec"/>
    <rect x="380" y="230" width="180" height="18" rx="9" fill="#ececec"/>
    <circle cx="400" cy="360" r="54" fill="#f0f0f0" stroke="#cccccc" stroke-width="3"/>
    <path d="M360 360c16-32 64-32 80 0" stroke="#999" stroke-width="10" fill="none" stroke-linecap="round"/>
    <text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#666">Velora</text>
  </svg>
`)}`;

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

  const getDisplayLabel = (name) => {
    const normalized = String(name || "").trim().toLowerCase();
    const map = {
      women: t("home.categoryWomen"),
      ayollar: t("home.categoryWomen"),
      men: t("home.categoryMen"),
      erkek: t("home.categoryMen"),
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

  const getCategoryImage = (name) => {
    const normalized = String(name || "").trim().toLowerCase();
    if (normalized.includes("women") || normalized.includes("ayollar") || normalized.includes("girl")) return CATEGORY_IMAGES.women;
    if (normalized.includes("men") || normalized.includes("mujskoy") || normalized.includes("erkak") || normalized.includes("male") || normalized.includes("boy")) return CATEGORY_IMAGES.men;
    if (normalized.includes("car") || normalized.includes("avto") || normalized.includes("auto")) return CATEGORY_IMAGES.car;
    return CATEGORY_IMAGES.default;
  };

  const handleCategoryImageError = (event) => {
    event.currentTarget.src = CATEGORY_FALLBACK_IMAGE;
  };

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
          label: getDisplayLabel(a.name),
          count: a.count,
          type: "ageGroup",
        }));
        const categoryCards = (meta.categories || [])
          .sort((a, b) => b.count - a.count)
          .map((c) => ({ key: c.name, label: getDisplayLabel(c.name), count: c.count, type: "category" }));

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
              alt={t("home.heroImageAlt")}
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
                <img src={getCategoryImage(cat.key)} alt={cat.label} onError={handleCategoryImageError} />
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
                  <p className="product-category">{product.brand || t("common.storeName")}</p>
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