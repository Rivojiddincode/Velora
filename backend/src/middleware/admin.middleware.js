// Faqat role === "admin" bo'lgan foydalanuvchilarga ruxsat beradi.
// auth.middleware'dan keyin ishlatiladi (req.user allaqachon bor bo'lishi kerak).
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Ruxsat yo'q. Faqat admin uchun." });
  }
  next();
};

module.exports = adminMiddleware;
