import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiShoppingCart2Line, RiHeartLine, RiFileList3Line } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signout } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">{t('common.storeName')}</span>
        </Link>

        <div
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              {t('nav.home')}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/shop" className="navbar-link" onClick={() => setIsOpen(false)}>
              {t('nav.shop')}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={() => setIsOpen(false)}>
              {t('nav.contact')}
            </Link>
          </li>
          {user && (
            <li className="navbar-item">
              <Link to="/my-orders" className="navbar-link" onClick={() => setIsOpen(false)}>
                {t('nav.myOrders')}
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li className="navbar-item">
              <Link to="/admin" className="navbar-link" onClick={() => setIsOpen(false)}>
                {t('nav.admin')}
              </Link>
            </li>
          )}
          <li className="navbar-mobile-tools">
            <LanguageSwitcher />
            <ThemeToggle />
          </li>
        </ul>

        <div className="navbar-actions">
          <div className="navbar-desktop-tools">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link to="/cart" className="navbar-btn navbar-btn-secondary navbar-icon-btn" title={t('nav.cart')}>
            <RiShoppingCart2Line />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <Link to="/wishlist" className="navbar-btn navbar-btn-secondary navbar-icon-btn" title={t('nav.wishlist')}>
            <RiHeartLine />
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>
          {user && (
            <Link to="/my-orders" className="navbar-btn navbar-btn-secondary navbar-icon-btn" title={t('nav.myOrders')}>
              <RiFileList3Line />
            </Link>
          )}
          {user ? (
            <button type="button" className="navbar-btn navbar-btn-primary" onClick={handleSignout}>
              {t('nav.signout')}
            </button>
          ) : (
            <Link to="/signin" className="navbar-btn navbar-btn-primary">
              {t('nav.signin')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;