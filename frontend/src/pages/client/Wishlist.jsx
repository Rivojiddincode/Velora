import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RiHeartLine, RiShoppingCart2Line, RiDeleteBinLine } from "react-icons/ri";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { resolveImageUrl } from "../../services/productService";
import "./Wishlist.css";

const Wishlist = () => {
  const { t } = useTranslation();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <RiHeartLine className="wishlist-empty-icon" />
          <h2>{t("wishlist.empty")}</h2>
          <p>{t("wishlist.emptyDesc")}</p>
          <Link to="/shop" className="primary-button">
            {t("shop.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>{t("wishlist.title")}</h1>

      <div className="product-grid">
        {items.map((product) => (
          <article className="product-card" key={product._id}>
            <div className="product-card-image">
              <Link to={`/product/${product._id}`}>
                <img src={resolveImageUrl(product.image)} alt={product.name} />
              </Link>
              <button
                type="button"
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(product._id)}
                aria-label={t("wishlist.remove")}
              >
                <RiDeleteBinLine />
              </button>
            </div>
            <div className="product-card-body">
              <h3>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </h3>
              <p className="product-category">
                {product.category} {product.brand ? `• ${product.brand}` : ""}
              </p>
              <div className="product-actions">
                <span className="price">{product.price?.toLocaleString()} so'm</span>
                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  <RiShoppingCart2Line /> {t("wishlist.moveToCart")}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;