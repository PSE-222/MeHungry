const express = require("express");
const order_controller = require("../controllers/order_controller");
const { auth } = require("../helper/auth");

const router = express.Router();

router.get("/view-order/:id", order_controller.view_order);

router.get("/view-current-orders", auth, order_controller.view_current_orders);

router.get("/orders", auth, order_controller.view_orders)

router.post("/add-items/:id", order_controller.add_item_to_order);

router.post("/finish-order/:id", auth, order_controller.finish_order);

module.exports = router;