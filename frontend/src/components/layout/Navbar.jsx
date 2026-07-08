import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiShoppingCart2Line, RiHeartLine, RiFileList3Line, RiLogoutBoxRLine, RiLoginBoxLine } from 'react-icons/ri';
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

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 800) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSignout = () => {
    signout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">{t('common.storeName')}</span>
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              {t('nav.home')}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/shop" className="navbar-link" onClick={closeMenu}>
              {t('nav.shop')}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={closeMenu}>
              {t('nav.contact')}
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li className="navbar-item">
              <Link to="/admin" className="navbar-link" onClick={closeMenu}>
                {t('nav.admin')}
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-btn navbar-icon-btn" title={t('nav.cart')} onClick={closeMenu}>
            <RiShoppingCart2Line />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <Link to="/wishlist" className="navbar-btn navbar-icon-btn" title={t('nav.wishlist')} onClick={closeMenu}>
            <RiHeartLine />
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>

          <div className="navbar-desktop-only">
            {user && (
              <Link to="/my-orders" className="navbar-btn navbar-icon-btn" title={t('nav.myOrders')} onClick={closeMenu}>
                <RiFileList3Line />
              </Link>
            )}
            <div className="navbar-desktop-tools">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
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

        <button
          type="button"
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-mobile-panel ${isOpen ? 'open' : ''}`}>
          <Link to="/" className="navbar-mobile-link" onClick={closeMenu}>
            {t('nav.home')}
          </Link>
          <Link to="/shop" className="navbar-mobile-link" onClick={closeMenu}>
            {t('nav.shop')}
          </Link>
          <Link to="/contact" className="navbar-mobile-link" onClick={closeMenu}>
            {t('nav.contact')}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-mobile-link" onClick={closeMenu}>
              {t('nav.admin')}
            </Link>
          )}

          <div className="navbar-mobile-divider" />

          <Link to="/wishlist" className="navbar-mobile-row" onClick={closeMenu}>
            <RiHeartLine />
            <span>{t('nav.wishlist')}</span>
            {wishlistCount > 0 && <span className="row-badge">{wishlistCount}</span>}
          </Link>
          {user && (
            <Link to="/my-orders" className="navbar-mobile-row" onClick={closeMenu}>
              <RiFileList3Line />
              <span>{t('nav.myOrders')}</span>
            </Link>
          )}

          <div className="navbar-mobile-tools">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="navbar-mobile-divider" />

          {user ? (
            <button type="button" className="navbar-mobile-row navbar-mobile-signout" onClick={handleSignout}>
              <RiLogoutBoxRLine />
              <span>{t('nav.signout')}</span>
            </button>
          ) : (
            <Link to="/signin" className="navbar-mobile-row navbar-mobile-signout" onClick={closeMenu}>
              <RiLoginBoxLine />
              <span>{t('nav.signin')}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
