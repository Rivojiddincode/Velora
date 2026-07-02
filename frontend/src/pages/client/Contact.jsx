import { useState } from "react";
import "./Contact.css";

const Contact = () => {
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
          <h1>Contact Us</h1>
          <p>Have questions? We’re happy to help. Send us a message and we’ll get back to you shortly.</p>
          <div className="contact-details">
            <div>
              <strong>Email</strong>
              <p>support@velora.com</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <strong>Address</strong>
              <p>123 Market Street, Suite 400, New York, NY</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            Send Message
          </button>

          {submitted && <p className="success-message">Your message has been sent.</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
