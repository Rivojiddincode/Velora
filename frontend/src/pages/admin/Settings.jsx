import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSettings, updateSettings } from "../../services/settingsService";

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({ storeName: "", pickupAddress: "", phone: "", contactEmail: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <p>...</p>;

  return (
    <div className="admin-page settings-page">
      <div className="page-header">
        <h1>{t("admin.settings")}</h1>
      </div>

      <section className="table-card settings-form-card">
        <div className="section-header">
          <h2>{t("admin.settings")}</h2>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <label>
            Do'kon nomi
            <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} />
          </label>

          <label>
            Olib ketish manzili (pickup address)
            <input type="text" name="pickupAddress" value={settings.pickupAddress} onChange={handleChange} />
          </label>

          <label>
            Telefon
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} />
          </label>

          <label>
            Aloqa uchun email (Contact formasi shu manzilga yuboriladi)
            <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} placeholder="info@velora.uz" />
          </label>

          <button type="submit" className="primary-button">
            {t("admin.save")}
          </button>
          {saved && <p className="success-message">Saqlandi</p>}
        </form>
      </section>
    </div>
  );
};

export default Settings;