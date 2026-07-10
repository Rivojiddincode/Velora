import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";

// Client Pages
import Home from "../pages/client/Home";
import Shop from "../pages/client/Shop";
import ProductDetails from "../pages/client/ProductDetails";
import Cart from "../pages/client/Cart";
import Contact from "../pages/client/Contact";
import MyOrders from "../pages/client/MyOrders";
import Wishlist from "../pages/client/Wishlist";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Orders from "../pages/admin/Orders";
import Settings from "../pages/admin/Settings";
import Users from "../pages/admin/Users";

import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Client — public browsing + protected personal pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;