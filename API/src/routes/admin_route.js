const express = require("express");
const admin_controller = require("../controllers/admin_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/login", admin_controller.login);
module.exports = router;