const express = require("express");
const order_controller = require("../controllers/order_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.get("/view-order/:id", order_controller.view_order);

router.post("/add-items/:id", order_controller.add_item_to_order);

// router.get("/tables", table_controller.view_all_tables);

module.exports = router;