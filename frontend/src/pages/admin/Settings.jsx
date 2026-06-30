import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: "Velora Store",
    email: "support@velora.com",
    currency: "USD",
    shipping: "Free shipping over $50",
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    console.log("Settings saved:", settings);
  };

  return (
    <div className="admin-page settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Update store preferences and default settings.</p>
      </div>

      <section className="table-card settings-form-card">
        <div className="section-header">
          <h2>Store Settings</h2>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <label>
            Store Name
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
            />
          </label>

          <label>
            Contact Email
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Default Currency
            <input
              type="text"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
            />
          </label>

          <label>
            Shipping Policy
            <input
              type="text"
              name="shipping"
              value={settings.shipping}
              onChange={handleChange}
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            Enable order notifications
          </label>

          <button type="submit" className="primary-button">
            Save Settings
          </button>
          {saved && <p className="success-message">Settings saved successfully.</p>}
        </form>
      </section>
    </div>
  );
};

export default Settings;
