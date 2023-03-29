const express = require("express");
const menu_controller = require("../controllers/menu_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.get("/view-order/:id/", order_controller.view_order);

router.get("/add-items/:id", order_controller.add_item_to_order);

// router.get("/tables", table_controller.view_all_tables);

module.exports = router;