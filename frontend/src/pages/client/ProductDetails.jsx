import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="product-details-page">
        <h2>Product not found</h2>
        <p>Try returning to the shop to find another item.</p>
        <Link to="/shop" className="button-link">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log(`Add to cart: ${product.name}`);
  };

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <img src={product.image} alt={product.name} />

        <div className="details-body">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <div className="details-footer">
            <span className="price">${product.price}</span>
            <button onClick={handleAddToCart} className="primary-button">
              Add to Cart
            </button>
          </div>
          <Link to="/shop" className="button-link secondary-link">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
