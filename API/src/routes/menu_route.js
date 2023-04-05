// View food item?
const express = require("express");
const menu_controller = require("../controllers/menu_controller");
const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/add-item", auth, menu_controller.add_item);

router.post("/update-item", auth, menu_controller.update_item);

router.post("/delete-item/:id", auth, menu_controller.delete_item);

router.get("/view-item/:id", auth, menu_controller.view_item);

router.get("/menu", menu_controller.view_menu);

module.exports = router;