const express = require("express");
const cors = require("cors");

// ✅ FIX: routelar import qilinmagan va ulanmagan edi
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Velora API Running...");
});

// ✅ FIX: routelar ulandi
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
