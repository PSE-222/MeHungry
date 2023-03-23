const express = require("express");
const app = express();
// const cors = require("cors");
const table_router = require("./src/routes/table_route");
const order_router = require("./src/routes/order_route");
const menu_router = require("./src/routes/menu_route");
const admin_router = require("./src/routes/admin_route");

app.use(express.json());
// app.use(cors());
app.use("/api", table_router);
app.use("/api", order_router);
app.use("/api", menu_router);
app.use("/api", admin_router);

module.exports = app;