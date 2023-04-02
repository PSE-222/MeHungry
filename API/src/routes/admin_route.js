const express = require("express");
const admin_controller = require("../controllers/admin_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/login", admin_controller.login);

// logout
router.delete("/logout", admin_controller.logout);

// generate access token
router.post("/generate-access-token", admin_controller.generate_new_access_token);

module.exports = router;