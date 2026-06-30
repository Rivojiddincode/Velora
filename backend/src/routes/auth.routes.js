const express = require("express");
const router = express.Router();

// ✅ FIX: fayl bo'sh edi — routelar ulandi
const { signup, signin } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;
