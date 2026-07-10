const nodemailer = require("nodemailer");
const Settings = require("../models/Settings");

// SMTP orqali email yuboruvchi transport.
// ESLATMA: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS va CONTACT_EMAIL
// backend/.env fayliga qo'yilgandan so'ng bu to'liq ishlaydi.
const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// POST /api/contact — foydalanuvchi Contact formasini yuboradi
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return res.status(503).json({
        message:
          "Email tizimi sozlanmagan. Admin backend/.env fayliga SMTP sozlamalarini qo'shishi kerak.",
      });
    }

    const settings = await Settings.findOne();
    const recipient = settings?.contactEmail || process.env.CONTACT_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"Velora sayt" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: `Yangi xabar — Velora Contact formasi (${name})`,
      text: `Ism: ${name}\nEmail: ${email}\n\nXabar:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height:1.6;">
          <h2>Yangi xabar — Velora sayt orqali</h2>
          <p><strong>Ism:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Xabar:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    res.json({ ok: true, message: "Xabar yuborildi" });
  } catch (error) {
    console.error("Email yuborishda xato:", error.message);
    res.status(500).json({ message: "Xabarni yuborib bo'lmadi. Keyinroq qayta urinib ko'ring." });
  }
};

module.exports = { sendContactMessage };