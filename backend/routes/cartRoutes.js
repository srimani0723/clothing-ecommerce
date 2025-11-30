const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  mergeCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeFromCart);
router.post("/merge", protect, mergeCart); // called after login

module.exports = router;
