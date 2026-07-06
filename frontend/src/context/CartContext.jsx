import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(t("toast.addedToCart", { name: product.name }), "success");
  };

  const removeFromCart = (id) => {
    const item = items.find((i) => i._id === id);
    setItems((prev) => prev.filter((i) => i._id !== id));
    if (item) showToast(t("toast.removedFromCart", { name: item.name }), "error");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default CartContext;