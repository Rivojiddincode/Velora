import { Link } from "react-router-dom";
import { products } from "../../services/productService";
import "./Home.css";

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p>Welcome to Velora</p>
          <h1>Modern fashion and accessories for every lifestyle.</h1>
          <p>
            Discover trending products crafted for comfort, quality, and everyday style.
          </p>
          <Link to="/shop" className="hero-button">
            Browse the Shop
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://via.placeholder.com/640x420?text=Fashion+Collection"
            alt="Featured collection"
          />
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked items for new arrivals and everyday essentials.</p>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-actions">
                  <span>${product.price}</span>
                  <Link to={`/product/${product.id}`} className="button-link">
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
