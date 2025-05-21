const express = require("express");
const router = express.Router();
const invoiceController =  require("../controllers/invoiceController")
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/invoices", authenticateToken, invoiceController.invoice);

module.exports = router;