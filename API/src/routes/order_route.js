const express = require("express");
const order_controller = require("../controllers/order_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.get("/view-order/:id", order_controller.view_order);

router.post("/add-items/:id", order_controller.add_item_to_order);

router.get("/orders", order_controller.view_orders)

router.post("/finish-order/:id", order_controller.finish_order);

module.exports = router;