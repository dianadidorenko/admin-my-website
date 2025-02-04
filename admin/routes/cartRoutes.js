const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  increaseCartItem,
  decreaseCartItem,
} = require("../controllers/cartController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Добавление товара в корзину
router.post("/add", verifyToken, async (req, res) => {
  const { product, quantity } = req.body;

  try {
    const cart = await addToCart(req.user.id, product, quantity);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Удаление товара из корзины
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await removeFromCart(req.user.id, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение корзины
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Увеличение количества товара в корзине
router.put("/increase/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await increaseCartItem(req.user.id, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Уменьшение количества товара в корзине
router.put("/decrease/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await decreaseCartItem(req.user.id, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
