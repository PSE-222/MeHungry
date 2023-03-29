const express = require("express");
const table_controller = require("../controllers/table_controller");
// const { auth } = require("../helper/auth");

const router = express.Router();

router.get("/assign-table/:id/:name", table_controller.assign_table);

router.get("/change-status/:id", table_controller.change_status_table);

router.get("/table/:id", table_controller.view_info_table);

router.get("/tables", table_controller.view_all_tables);

module.exports = router;