const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

require("dotenv").config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
