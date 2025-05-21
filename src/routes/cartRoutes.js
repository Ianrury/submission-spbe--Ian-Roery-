const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/cart", authenticateToken, cartController.getCart);
router.post("/cart/items", authenticateToken, cartController.postCart);

module.exports = router;
