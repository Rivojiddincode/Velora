const jwt = require("jsonwebtoken");

// ✅ FIX: fayl bo'sh edi — signup va signin yozildi
// Eslatma: User modeli kerak bo'lsa — models/User.js yarating

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    // TODO: User modelini import qilib DB ga saqlang
    // const existing = await User.findOne({ email });
    // if (existing) return res.status(400).json({ message: "Email allaqachon ro'yxatdan o'tgan" });
    // const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz" });
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

    // TODO: User modelidan tekshiring
    // const user = await User.findOne({ email });
    // if (!user || !(await bcrypt.compare(password, user.password))) {
    //   return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    // }
    // const token = generateToken(user._id);

    res.status(200).json({ message: "Tizimga kirdingiz" /*, token */ });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, signin };
