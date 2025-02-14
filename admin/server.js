const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();

const connectDB = require("./config/db");
require("dotenv").config();
connectDB();

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const podborkiRoutes = require("./routes/podborkiRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// app.use("/categories", categoryRoutes);
// app.use("/products", productRoutes);
// app.use("/podborki", podborkiRoutes);
// app.use("/users", userRoutes);
// app.use("/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/podborki", podborkiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
