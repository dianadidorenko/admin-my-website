const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const { fileURLToPath } = require("url");
const path = require("path");
const { readdirSync } = require("fs");

const connectDB = require("./config/db");
require("dotenv").config();
connectDB();

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(cors({ origin: "*" }));
app.use(express.json());

const routesPath = path.resolve(__dirname, "./routes");
const routeFiles = readdirSync(routesPath);
routeFiles.forEach((file) => {
  const routeModule = require(`./routes/${file}`);
  app.use("/", routeModule);
});

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
