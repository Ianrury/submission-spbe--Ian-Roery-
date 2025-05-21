const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authenticateToken = require("../middlewares/authMiddleware");


router.get("/books", authenticateToken, bookController.getAllBooks);
router.get("/books/:id", authenticateToken, bookController.getBookDetail);

module.exports = router;
