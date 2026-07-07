import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiSend,
} from 'react-icons/fi';
import { getSettings } from '../../services/settingsService';

const Footer = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">{settings?.storeName || t('common.storeName')}</h3>
            <p className="footer-description">
              {t('footer.description', { storeName: settings?.storeName || t('common.storeName') })}
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="social-link" aria-label="Telegram">
                <FiSend />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">{t('home.categoriesTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/shop">{t('nav.shop')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/signin">{t('nav.signin')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">{t('cart.checkout')}</h4>
            <ul className="footer-links">
              <li><Link to="/cart">{t('nav.cart')}</Link></li>
              <li><Link to="/shop">{t('shop.allProducts')}</Link></li>
            </ul>
            <div className="payment-badge">inPAY {t('cart.payWithCard')}</div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">{t('cart.name')}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>{settings?.phone || '+998 90 000 00 00'}</span>
              </div>
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>info@velora.uz</span>
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>{settings?.pickupAddress || "Toshkent sh."}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 {settings?.storeName || 'Velora'} Store. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;