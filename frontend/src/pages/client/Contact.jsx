import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSettings } from "../../services/settingsService";
import { sendContactMessage } from "../../services/contactService";
import "./Contact.css";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await sendContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Xabarni yuborib bo'lmadi");
    } finally {
      setSubmitting(false);
    }
  };

  const mapAddress = settings?.pickupAddress || "Toshkent, O'zbekiston";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`;

  return (
    <div className="contact-page">
      <div className="contact-grid">
        <div className="contact-info">
          <h1>{t("contact.title")}</h1>
          <p>{t("contact.description")}</p>

          <div className="contact-map">
            <iframe
              title="Do'kon manzili"
              src={mapSrc}
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: "16px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="contact-details">
            <div>
              <strong>{t("contact.email")}</strong>
              <p>{settings?.contactEmail || "info@velora.uz"}</p>
            </div>
            <div>
              <strong>{t("contact.phone")}</strong>
              <p>{settings?.phone || "+998 90 000 00 00"}</p>
            </div>
            <div>
              <strong>{t("contact.address")}</strong>
              <p>{mapAddress}</p>
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

          {error && <p className="text-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "..." : t("contact.submit")}
          </button>

          {submitted && <p className="success-message">{t("contact.success")}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;