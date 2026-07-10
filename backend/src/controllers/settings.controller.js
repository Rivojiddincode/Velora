const Settings = require("../models/Settings");

const getOrCreate = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// GET /api/settings (public — checkoutda pickup manzilini ko'rsatish uchun)
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/settings (admin)
const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    const { storeName, pickupAddress, phone, contactEmail } = req.body;
    if (storeName !== undefined) settings.storeName = storeName;
    if (pickupAddress !== undefined) settings.pickupAddress = pickupAddress;
    if (phone !== undefined) settings.phone = phone;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };