const mongoose = require("mongoose");

// Подсхема для элементов корзины
const cartItemSchema = new mongoose.Schema({
  product: {
    type: Object, // Сохраняем объект продукта полностью
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Количество по умолчанию — 1
  },
});

// Основная схема пользователя
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    birthday: { type: String },
    city: { type: String },
    street: { type: String },
    house: { type: String },
    appartment: { type: String },
    index: { type: String },
    currentPassword: { type: String },
    newPassword: { type: String },
    confirmNewPassword: { type: String },
    cartData: {
      items: [cartItemSchema], // Массив с товарами
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { minimize: false }
);

module.exports = mongoose.model("User", userSchema);
