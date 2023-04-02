const express = require("express");
const admin_controller = require("../controllers/admin_controller");
const router = express.Router();

router.post("/login", admin_controller.login);

router.delete("/logout", admin_controller.logout);

router.post("/generate-access-token", admin_controller.generate_new_access_token);

module.exports = router;