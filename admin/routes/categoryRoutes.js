const express = require("express");
const Category = require("../models/Category");
const path = require("path");
const fs = require("fs/promises");
const multer = require("multer");

const router = express.Router();

// Проверяем, существует ли папка uploads, если нет, создаем её
const UPLOAD_DIR = path.join(__dirname, "../uploads");
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Путь для сохранения файлов
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени
  },
});

// Настройка multer с проверкой формата файлов
const upload = multer({
  storage: storage, // Используется для настройки хранения файлов
  dest: UPLOAD_DIR, // Путь для сохранения файлов, указанный через переменную UPLOAD_DIR
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Получение всех категорий
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Добавление новой категории с изображением
router.post("/add", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !image) {
    return res
      .status(400)
      .json({ success: false, error: "Name and image are required" });
  }

  try {
    // Создаем категорию с изображением
    const category = await Category.create({ name, image });

    res.json({
      success: true,
      msg: "Category successfully created",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Обновление категории
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name && !image) {
    return res
      .status(400)
      .json({ success: false, error: "Name or image must be provided" });
  }

  
  try {
    // Находим категорию по ID
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    // Обновляем имя и/или изображение категории
    if (name) category.name = name;
    if (image) category.image = image;

    // Сохраняем изменения
    await category.save();

    res.json({
      success: true,
      msg: "Category successfully updated",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удаление категории
router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    // Удаляем все изображения
    for (const image of deletedCategory.image) {
      const imagePath = path.join(UPLOAD_DIR, path.basename(image));
      try {
        await fs.unlink(imagePath);
        console.log("Image successfully deleted:", imagePath);
      } catch (err) {
        console.warn("Image file not found:", imagePath);
      }
    }

    res.json({ success: true, msg: "Category successfully deleted" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
