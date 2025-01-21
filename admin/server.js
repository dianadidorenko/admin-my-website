const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
