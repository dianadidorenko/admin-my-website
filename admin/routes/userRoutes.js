const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const express = require("express");
require("dotenv").config();

const router = express.Router();

const creaToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}; 

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Проверяем, является ли пользователь администратором
    const isAdmin = email === process.env.IS_ADMIN;

    // Генерация токена с учётом роли администратора
    const token = creaToken(user._id, isAdmin);

    res.status(200).json({ success: true, token, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

router.post("/register", async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = creaToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error register" });
  }
});

// Получить всех юзеров
router.get("/all", async ( areq, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching users" });
  }
});

// Получить определенного юзера
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Расшифровка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone || "",
        birthday: user.birthday || "",
        city: user.city || "",
        street: user.street || "",
        house: user.house || "",
        appartment: user.appartment || "",
        index: user.index || "",
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});

// Удалить определенного юзера
router.delete("/delete", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Расшифровка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Удаление пользователя
    await User.findByIdAndDelete(decoded.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// Обновление информации о юзере
router.put("/update/:id", async (req, res) => {
  const { id } = req.params; // Получение ID пользователя из URL
  const updatedData = req.body; // Получение данных из тела запроса

  try {
    // Находим пользователя по ID и обновляем его
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Возвращает обновлённый документ
      runValidators: true, // Проверяет валидаторы, указанные в схеме
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
});

router.post("/wishlist/add", async (req, res) => {
  const { productId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  console.log(productId);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error adding to wishlist" });
  }
});

router.delete("/wishlist/remove/:productId", async (req, res) => {
  const { productId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error removing from wishlist" });
  }
});

router.get("/wishlist", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("wishlist");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching wishlist" });
  }
});

module.exports = router;
