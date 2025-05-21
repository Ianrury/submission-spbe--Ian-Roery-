const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRouter = require("./routes/cartRoutes");
const checkoutRouter = require("./routes/checkoutRoutes");
const invoicesRouter = require("./routes/invoiceRoutes");

app.use("/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", cartRouter);
app.use("/api", checkoutRouter);
app.use("/api", invoicesRouter);

module.exports = app;
