const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Birinchi ro'yxatdan o'tgan foydalanuvchi avtomatik admin bo'ladi (loyihani ishga tushirish uchun qulay)
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";

    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone, role });

    const token = generateToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/signin
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email va parolni kiriting" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, signin, me };
