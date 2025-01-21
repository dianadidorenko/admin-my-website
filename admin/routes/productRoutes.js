const express = require("express");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ДЛЯ ОДНОГО ФОТО
// router.post("/add", upload.single("image"), async (req, res) => {
//   const { name, brand, price, description, country, volume, weight, purpose } =
//     req.body;
//   const image = req.file;

//   if (!image) {
//     return res.status(400).json({ message: "Изображение не загружено" });
//   }

//   if (
//     !name ||
//     !brand ||
//     !price ||
//     !description ||
//     !country ||
//     !volume ||
//     !weight ||
//     !purpose
//   ) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Missing required fields" });
//   }

//   try {
//     const cloudinaryResponse = await cloudinary.uploader.upload(image.path, {
//       folder: "products", // Папка на Cloudinary для хранения изображений
//     });

//     // Получаем URL изображения
//     const imageUrl = cloudinaryResponse.secure_url;

//     // Создаем продукт
//     const product = await Product.create({
//       productName: name,
//       brand: brand,
//       price: price,
//       description: description,
//       country: country,
//       volume: volume,
//       weight: weight,
//       purpose: JSON.parse(purpose),
//       image: imageUrl,
//     });

//     res.json({
//       success: true,
//       msg: "Product successfully created",
//       data: product,
//     });
//   } catch (error) {
//     console.error("Error creating product:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// ДЛЯ НЕСКОЛЬКИХ ФОТО
router.post("/add", upload.array("images", 5), async (req, res) => {
  const { name, brand, description, country, volumes, purpose } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Изображения не загружены" });
  }

  if (
    !name ||
    !brand ||
    !description ||
    !country ||
    !volumes ||
    volumes.length === 0 ||
    !purpose
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  let imageUrls = [];

  try {
    imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const cloudinaryResponse = await cloudinary.uploader
          .upload(file.path, {
            folder: "products",
          })
          .catch((error) => {
            console.error("Cloudinary upload failed:", error);
            throw new Error("Ошибка загрузки в Cloudinary");
          });
        return cloudinaryResponse.secure_url;
      })
    );
  } catch (error) {
    console.error("Error creating product:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }

  try {
    const product = await Product.create({
      productName: name,
      brand: brand,
      description: description,
      country: country,
      volumes: JSON.parse(volumes),
      purpose: JSON.parse(purpose),
      images: imageUrls,
    });

    res.json({
      success: true,
      msg: "Product successfully created",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", upload.array("images", 5), async (req, res) => {
  const productId = req.params.id;
  const { name, brand, description, country, volumes, purpose } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Товар не найден" });
    }

    let updatedImageUrls = product.images || [];

    if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map(async (imageUrl) => {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
          })
        );
      }

      updatedImageUrls = await Promise.all(
        req.files.map(async (file) => {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            file.path,
            {
              folder: "products",
            }
          );
          return cloudinaryResponse.secure_url;
        })
      );
    }

    product.productName = name || product.productName;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.country = country || product.country;
    product.volumes = volumes ? JSON.parse(volumes) : product.volumes;
    product.purpose = purpose ? JSON.parse(purpose) : product.purpose;
    product.images = updatedImageUrls;

    await product.save();

    res.json({
      success: true,
      message: "Товар успешно обновлён",
      data: product,
    });
  } catch (error) {
    console.error("Ошибка обновления товара:", error.message);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Товар не найден" });
    }
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (imageUrl) => {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `products/${publicId}`,
            (error, result) => {
              if (error) {
                console.error(
                  "Ошибка удаления изображения из Cloudinary:",
                  error
                );
              }
            }
          );
        })
      );
    }

    await Product.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: "Товар успешно удалён",
    });
  } catch (error) {
    console.error("Ошибка удаления товара:", error.message);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

module.exports = router;
