const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  description: { type: String, required: true },
  country: { type: String, required: true },
  volumes: [
    {
      volume: { type: String, required: true },
      price: { type: String, required: true },
      weight: { type: String, required: true },
    },
  ],
  purpose: { type: [String], required: true },
  hit: { type: Boolean, required: true, default: false },
  // image: { type: String, required: true },
  images: { type: [String], required: true },
});

module.exports = mongoose.model("Product", productSchema);
