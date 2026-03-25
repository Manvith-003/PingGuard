const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/website.controller");

router.post("/", ctrl.createWebsite);
router.get("/", ctrl.getWebsites);
router.delete("/:id", ctrl.deleteWebsite);

// 🔥 important
router.get("/ping-check", ctrl.pingWebsites);



module.exports = router;