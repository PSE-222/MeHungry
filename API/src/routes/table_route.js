const express = require("express");
const table_controller = require("../controllers/table_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.post("/assign-table/:number/:name", table_controller.assign_table);

router.post("/change-status/:number", table_controller.change_status_table);

router.get("/table/:id", table_controller.view_info_table);

router.get("/tables", table_controller.view_all_table);

module.exports = router;