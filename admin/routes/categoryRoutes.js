const express = require("express");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

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
router.post("/add", async (req, res) => {
  const { name } = req.body;
  const image = req.files?.image;

  if (!name || !image || !image.tempFilePath) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid input data" });
  }

  try {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "categories",
      public_id: `${Date.now()}-${name}`,
    });

    const category = await Category.create({ name, image: result.secure_url });
    res.json({
      success: true,
      msg: "Category successfully created",
      data: category,
    });
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Обновление категории
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.files?.image;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    if (name) category.name = name;
    if (image) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "categories",
        public_id: `${Date.now()}-${name}`,
      });
      category.image = result.secure_url;
    }

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
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    const publicId = `categories/${
      category.image.split("/").pop().split(".")[0]
    }`;
    await cloudinary.uploader.destroy(publicId);

    await Category.findByIdAndDelete(id);
    res.json({ success: true, msg: "Category successfully deleted" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
