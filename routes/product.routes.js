import { Router } from "express";
import {
  addProduct,
  changeStock,
  getProductList,
  getSpecificProduct,
} from "../controllers/product.controllers.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewars/authSeller.middleware.js";
const productRouter = Router();
productRouter.post("/add", upload.array(["images"]), addProduct);
productRouter.get("/list", getProductList);
productRouter.get("/id", getSpecificProduct);
productRouter.post("/stock", authSeller, changeStock);
export default productRouter;
