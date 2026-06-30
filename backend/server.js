require("dotenv").config(); // ✅ FIX: .env o'qilmayotgan edi
const app = require("./src/app");
const connectDB = require("./src/config/db"); // ✅ FIX: DB ulanishi chaqirilmagan edi

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
