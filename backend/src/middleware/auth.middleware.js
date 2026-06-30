const jwt = require("jsonwebtoken");

// ✅ FIX: fayl bo'sh edi — JWT middleware yozildi
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token topilmadi" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token noto'g'ri yoki muddati o'tgan" });
  }
};

module.exports = authMiddleware;
