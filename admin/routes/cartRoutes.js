const express = require("express");
const jwt = require("jsonwebtoken");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  increaseCartItem,
  decreaseCartItem,
} = require("../controllers/cartController");

const router = express.Router();

// Middleware для проверки токена
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Добавление товара в корзину
router.post("/add", authenticate, async (req, res) => {
  const { product, quantity } = req.body;

  try {
    const cart = await addToCart(req.userId, product, quantity);
    // console.log("Сохранённая корзина:", cart);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Удаление товара из корзины
router.delete("/remove/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await removeFromCart(req.userId, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение корзины
router.get("/", authenticate, async (req, res) => {
  try {
    const cart = await getCart(req.userId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Увеличение количества товара в корзине
router.put("/increase/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await increaseCartItem(req.userId, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Уменьшение количества товара в корзине
router.put("/decrease/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await decreaseCartItem(req.userId, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
