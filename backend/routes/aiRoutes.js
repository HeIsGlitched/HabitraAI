const express = require("express");

const auth = require("../middleware/auth");

const { getInsights } = require("../controllers/aiController");

const router = express.Router();

router.post("/insights", auth, getInsights);

module.exports = router;