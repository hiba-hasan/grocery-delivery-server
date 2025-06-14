import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectToDataBase from "./configs/mongodb.js";
import errorMiddleWare from "./middlewars/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import addressRouter from "./routes/address.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();
const port = process.env.PORT || 4000;

//middlewares:
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.use("/api/users", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.use(errorMiddleWare);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectToDataBase();
  await connectCloudinary();
});
