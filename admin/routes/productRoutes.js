const express = require("express");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

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
// router.post("/add", async (req, res) => {
//   const { name, brand, price, description, country, volume, weight, purpose } =
//     req.body;
//   const image = req.files?.image;

//  if (!image || !image.tempFilePath) {
//    return res.status(400).json({ success: false, error: "Invalid input data" });
//  }

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
//  const result = await cloudinary.uploader.upload(image.tempFilePath, {
//       folder: "products",
//       public_id: `${Date.now()}-${name}`,
//     });

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
//       image: result.secure_url
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

router.post("/add", async (req, res) => {
  const { name, brand, description, country, volumes, purpose, hit } = req.body;
  const files = req.files?.images;

  if (
    !name ||
    !brand ||
    !description ||
    !country ||
    !volumes ||
    !purpose ||
    !files
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Все поля должны быть заполнены" });
  }

  try {
    const imageUrls = await Promise.all(
      (Array.isArray(files) ? files : [files]).map(async (file) => {
        const uploadResponse = await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            folder: "products",
          }
        );
        return uploadResponse.secure_url;
      })
    );

    const product = await Product.create({
      productName: name,
      brand,
      description,
      country,
      volumes: JSON.parse(volumes),
      purpose: JSON.parse(purpose),
      hit,
      images: imageUrls,
    });

    console.log("hit", hit);
    console.error("hit", hit);

    res.json({
      success: true,
      msg: "Продукт успешно создан",
      data: product,
    });
  } catch (error) {
    console.error("Ошибка создания продукта:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, brand, description, country, volumes, purpose, hit } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Товар не найден" });
    }

    if (req.files?.images) {
      // Удаляем старые изображения
      await Promise.all(
        product.images.map(async (imageUrl) => {
          const publicId = `products/${
            imageUrl.split("/").pop().split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        })
      );

      // Загружаем новые изображения
      const imageUrls = await Promise.all(
        (Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        ).map(async (file) => {
          const uploadResponse = await cloudinary.uploader.upload(
            file.tempFilePath,
            { folder: "products" }
          );
          return uploadResponse.secure_url;
        })
      );

      product.images = imageUrls;
    }

    product.productName = name || product.productName;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.country = country || product.country;
    product.hit = hit || product.hit;
    product.volumes = volumes ? JSON.parse(volumes) : product.volumes;
    product.purpose = purpose ? JSON.parse(purpose) : product.purpose;

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

router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Продукт не найден" });
    }

    console.log("Cloudinary Config:", cloudinary.config());

    // Удаляем изображения из Cloudinary
    await Promise.all(
      product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        console.log("Deleting publicId:", publicId);
        await cloudinary.uploader.destroy(publicId);
      })
    );

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Продукт успешно удалён" });
  } catch (error) {
    console.error("Ошибка удаления продукта:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
