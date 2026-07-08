const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Bir xil telefon raqami faqat bir marta ro'yxatdan o'tishi uchun
// (bo'sh stringlar bundan chiqit qilinadi, shuning uchun partial index)
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $exists: true, $ne: "" } } }
);

module.exports = mongoose.model("User", userSchema);
