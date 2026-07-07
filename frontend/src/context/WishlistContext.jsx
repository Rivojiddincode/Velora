import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const toastLockRef = useRef(false);

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const isWishlisted = (id) => items.some((i) => i._id === id);

  const safeShowToast = useCallback(
    (message, type) => {
      if (toastLockRef.current) return;
      toastLockRef.current = true;
      showToast(message, type);
      setTimeout(() => {
        toastLockRef.current = false;
      }, 600);
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (product) => {
      setItems((prev) => {
        const exists = prev.some((i) => i._id === product._id);
        if (exists) {
          safeShowToast(t("toast.removedFromWishlist", { name: product.name }), "wishlist");
          return prev.filter((i) => i._id !== product._id);
        }
        safeShowToast(t("toast.addedToWishlist", { name: product.name }), "wishlist");
        return [...prev, product];
      });
    },
    [safeShowToast, t]
  );

  const removeFromWishlist = useCallback(
    (id) => {
      const item = items.find((i) => i._id === id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (item) safeShowToast(t("toast.removedFromWishlist", { name: item.name }), "wishlist");
    },
    [items, safeShowToast, t]
  );

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleWishlist, removeFromWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

export default WishlistContext;
