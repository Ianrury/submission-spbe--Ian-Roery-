const express = require("express");
const router = express.Router();
const checkoutController =  require('../controllers/checkoutContoller')
const authenticateToken = require("../middlewares/authMiddleware");


router.post("/checkout", authenticateToken, checkoutController.checkout);

module.exports = router;
