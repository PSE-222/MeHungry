const express = require("express");
const table_controller = require("../controllers/table_controller");
const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/request-table/:id", table_controller.request_table);

router.post("/assign-table/:number/:name", table_controller.assign_table);

router.post("/request-checkout/:number", table_controller.checkout_table);

router.post("/change-status/:number", auth, table_controller.update_status);

// router.get("/table/:id", table_controller.view_info_table);

router.get("/tables", auth, table_controller.view_all_table);

module.exports = router;