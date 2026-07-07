import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Contact.css";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-grid">
        <div className="contact-info">
          <h1>{t("contact.title")}</h1>
          <p>{t("contact.description")}</p>
          <div className="contact-details">
            <div>
              <strong>{t("contact.email")}</strong>
              <p>support@velora.com</p>
            </div>
            <div>
              <strong>{t("contact.phone")}</strong>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <strong>{t("contact.address")}</strong>
              <p>123 Market Street, Suite 400, New York, NY</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            {t("contact.name")}
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            {t("contact.email")}
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t("contact.message")}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            {t("contact.submit")}
          </button>

          {submitted && <p className="success-message">{t("contact.success")}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
