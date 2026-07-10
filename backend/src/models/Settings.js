const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Velora" },
    pickupAddress: { type: String, default: "Toshkent sh., Amir Temur ko'chasi, 1-uy" },
    phone: { type: String, default: "+998 90 000 00 00" },
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);