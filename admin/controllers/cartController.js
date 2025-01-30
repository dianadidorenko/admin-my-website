const User = require("../models/User");

// Добавление товара в корзину
const addToCart = async (userId, product, quantity = 1) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.cartData.items) {
      user.cartData.items = [];
    }

    // Проверить, существует ли товар уже в корзине
    const existingItem = user.cartData.items.find(
      (item) => item.product._id.toString() === product._id
    );

    if (existingItem) {
      // Если товар уже есть, увеличиваем его количество
      existingItem.quantity += quantity;
    } else {
      // Если товара нет, добавляем его с указанным количеством
      user.cartData.items.push({ product, quantity });
    }

    await user.save();
    return user.cartData.items;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Удаление товара из корзины
const removeFromCart = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.cartData.items = user.cartData.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    await user.save();
    return user.cartData.items;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Получение корзины
const getCart = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    return user.cartData.items || [];
  } catch (error) {
    throw new Error(error.message);
  }
};

// Увеличение количества товара в корзине
const increaseCartItem = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const cartItem = user.cartData.items.find(
      (item) => item.product._id.toString() === productId
    );

    if (!cartItem) throw new Error("Товар не найден в корзине");

    cartItem.quantity += 1;

    await user.save();
    return user.cartData.items;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Уменьшение количества товара в корзине
const decreaseCartItem = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const cartItem = user.cartData.items.find(
      (item) => item.product._id.toString() === productId
    );

    if (!cartItem) throw new Error("Товар не найден в корзине");

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      // Удаляем товар из корзины, если количество = 1
      user.cartData.items = user.cartData.items.filter(
        (item) => item.product._id.toString() !== productId
      );
    }

    await user.save();
    return user.cartData.items;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  increaseCartItem,
  decreaseCartItem,
};
