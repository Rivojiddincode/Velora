import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../services/productService";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div className="shop-page">
      <header className="shop-header">
        <div>
          <h1>Shop</h1>
          <p>Search our latest collection and find the perfect item for your wardrobe.</p>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products or categories"
          className="search-input"
        />
      </header>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p>{product.description}</p>
                <div className="product-actions">
                  <span>${product.price}</span>
                  <Link to={`/product/${product.id}`} className="button-link">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">No products matched your search.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
