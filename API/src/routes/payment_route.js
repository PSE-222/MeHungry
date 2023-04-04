const express = require("express");
const payment_controller = require("../controllers/payment_controller");
const { auth } = require("../helper/auth");

const router = express.Router();

// router.post("/request-payment/:id", payment_controller.request_payment);

// router.post("/finish-payment/:id", auth, payment_controller.finish_payment);

router.get("/view-payment/:id", auth, payment_controller.view_payment);

router.get("/payments", auth, payment_controller.view_all_payments);

module.exports = router;