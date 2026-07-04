import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RiHeartLine,
  RiHeartFill,
  RiShareLine,
  RiStarFill,
  RiSubtractLine,
  RiAddLine,
  RiShoppingBag3Line,
  RiShieldCheckLine,
  RiRefreshLine,
  RiMapPinLine,
  RiHeadphoneLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import { getProductById, resolveImages } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setActiveImage(0);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="pd-page">
        <h2>Product not found</h2>
        <Link to="/shop" className="button-link">
          {t("product.back")}
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const images = resolveImages(product);

  const handleAddToCart = () => {
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: images[0],
        size: selectedSize,
        color: selectedColor,
        brand: product.brand,
        category: product.category,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pd-page">
      <div className="pd-card">
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                className={idx === activeImage ? "pd-thumb active" : "pd-thumb"}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} />
              </button>
            ))}
          </div>
          <div className="pd-main-image">
            <img src={images[activeImage]} alt={product.name} />
            <button
              type="button"
              className="pd-wishlist-btn"
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
              aria-label="wishlist"
            >
              {isWishlisted(product._id) ? <RiHeartFill className="filled" /> : <RiHeartLine />}
            </button>
          </div>
        </div>

        <div className="pd-info">
          <div className="pd-top-row">
            {product.brand && <span className="pd-badge">★ {product.brand}</span>}
            <div className="pd-top-actions">
              <button type="button" className="pd-link-btn">
                <RiShareLine /> Share
              </button>
              <button
                type="button"
                className="pd-link-btn"
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
                {isWishlisted(product._id) ? <RiHeartFill /> : <RiHeartLine />} Wishlist
              </button>
            </div>
          </div>

          <h1>{product.name}</h1>
          {product.description && <p className="pd-subtitle">{product.description}</p>}

          <div className="pd-meta-row">
            {product.brand && (
              <div>
                <span className="text-muted">Brand</span>
                <p>{product.brand}</p>
              </div>
            )}
            {product.category && (
              <div>
                <span className="text-muted">{t("product.category")}</span>
                <p>{product.category}</p>
              </div>
            )}
            <div className="pd-price-block">
              <span className="pd-price">{product.price?.toLocaleString()} so'm</span>
            </div>
          </div>

          {product.reviewsCount > 0 && (
            <div className="pd-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <RiStarFill key={i} className={i < Math.round(product.rating) ? "filled" : ""} />
              ))}
              <span>{product.rating?.toFixed(1)}</span>
              <span className="text-muted">({product.reviewsCount} reviews)</span>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="pd-option-group">
              <span className="pd-option-label">Size</span>
              <div className="pd-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={selectedSize === size ? "pd-size-chip active" : "pd-size-chip"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="pd-option-group">
              <span className="pd-option-label">Color</span>
              <div className="pd-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={selectedColor === color ? "pd-color-swatch active" : "pd-color-swatch"}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pd-stock-row">
            <span className={product.stock > 0 ? "pd-stock in" : "pd-stock out"}>
              ● {product.stock > 0 ? `In Stock (${product.stock})` : "Out of stock"}
            </span>
            {product.sku && <span className="text-muted">SKU: {product.sku}</span>}
          </div>

          <div className="pd-buy-row">
            <div className="pd-qty">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <RiSubtractLine />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                <RiAddLine />
              </button>
            </div>

            <button
              type="button"
              className="pd-add-button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <RiShoppingBag3Line /> {added ? "✓ " + t("shop.addToCart") : t("shop.addToCart")}
            </button>
          </div>

          <div className="pd-trust-row">
            <div>
              <RiShieldCheckLine />
              <div>
                <strong>100% Original</strong>
                <span>Kafolatlangan sifat</span>
              </div>
            </div>
            <div>
              <RiRefreshLine />
              <div>
                <strong>14 kunlik qaytarish</strong>
                <span>Qulay qaytarish siyosati</span>
              </div>
            </div>
            <div>
              <RiMapPinLine />
              <div>
                <strong>Do'kondan olib ketish</strong>
                <span>Belgilangan manzildan</span>
              </div>
            </div>
            <div>
              <RiHeadphoneLine />
              <div>
                <strong>24/7 Qo'llab-quvvatlash</strong>
                <span>Har doim siz uchun</span>
              </div>
            </div>
          </div>

          <Link to="/shop" className="pd-back-link">
            <RiArrowLeftLine /> {t("product.back")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;