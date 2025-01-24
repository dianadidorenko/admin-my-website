const express = require("express");
const Podborki = require("../models/Podborki");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Получение всех категорий
router.get("/", async (req, res) => {
  try {
    const podborki = await Podborki.find();
    res.json({ success: true, data: podborki });
  } catch (error) {
    console.error("Error fetching podborki:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Добавление новой категории с изображением
router.post("/add", async (req, res) => {
  const { name, redirectName } = req.body;
  const image = req.files?.image;

  if (!name || !redirectName || !image || !image.tempFilePath) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid input data" });
  }

  try {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "podborki",
      public_id: `${Date.now()}-${name}`,
    });

    const podborka = await Podborki.create({
      name,
      redirectName,
      image: result.secure_url,
    });
    res.json({
      success: true,
      msg: "Category successfully created",
      data: podborka,
    });
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Обновление категории
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, redirectName } = req.body;
  const image = req.files?.image;

  try {
    const podborka = await Podborki.findById(id);
    if (!podborka) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    if (name) podborka.name = name;
    if (redirectName) podborka.redirectName = redirectName;
    if (image) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "podborki",
        public_id: `${Date.now()}-${name}`,
      });
      podborka.image = result.secure_url;
    }

    await podborka.save();
    res.json({
      success: true,
      msg: "Podborka successfully updated",
      data: podborka,
    });
  } catch (error) {
    console.error("Error updating podborka:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удаление категории
router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Podborki.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Podborka not found" });
    }

    const publicId = `categories/${
      category.image.split("/").pop().split(".")[0]
    }`;
    await cloudinary.uploader.destroy(publicId);

    await Podborki.findByIdAndDelete(id);
    res.json({ success: true, msg: "Podborka successfully deleted" });
  } catch (error) {
    console.error("Error deleting podborka:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
