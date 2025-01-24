const mongoose = require("mongoose");

const podborkiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  redirectName: { type: String, required: true },
});

module.exports = mongoose.model("Podborki", podborkiSchema);
