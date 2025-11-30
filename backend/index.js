const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (request, responce) => {
  responce.send("Hi welcome to clothing-ecommerce backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
