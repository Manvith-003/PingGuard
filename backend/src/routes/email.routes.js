const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

// Route to get config
router.get("/get-config", emailController.getEmailConfig);

// Route to set or update config
router.post("/set-config", emailController.setEmailConfig);

module.exports = router;