import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const initialCart = [
  {
    id: "1",
    name: "Classic Leather Bag",
    price: 120,
    quantity: 1,
  },
  {
    id: "2",
    name: "Sport Sneakers",
    price: 85,
    quantity: 2,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCart);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleQuantityChange = (id, value) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(value)) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="button-link">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => handleRemove(item.id)} className="text-button">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${total}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>${total}</strong>
            </div>
            <button className="primary-button">Proceed to Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
