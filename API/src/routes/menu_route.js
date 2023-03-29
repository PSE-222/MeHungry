const express = require("express");
const menu_controller = require("../controllers/menu_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/add-item", menu_controller.add_item);

router.post("/update-item", menu_controller.update_item);

router.get("/delete-item/:id", menu_controller.delete_item);

router.get("/menu", menu_controller.view_menu);

module.exports = router;