const express = require("express");
const app = express();
const body_parser = require("body-parser");
const cors = require("cors");
require("dotenv").config()

const table_router = require("./src/routes/table_route");
const order_router = require("./src/routes/order_route");
const menu_router = require("./src/routes/menu_route");
const payment_router = require("./src/routes/payment_route");
const admin_router = require("./src/routes/admin_route");

app.use(cors());
app.use(express.json());
app.use(body_parser.json());

app.use("/api", table_router);
app.use("/api", order_router);
app.use("/api", menu_router);
app.use("/api", payment_router);
app.use("/api", admin_router);

module.exports = app;