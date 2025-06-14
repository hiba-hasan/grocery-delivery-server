import { Router } from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
} from "../controllers/order.controllers.js";
import authSeller from "../middlewars/authSeller.middleware.js";
import { authorize } from "../middlewars/auth.middleware.js";
const orderRouter = Router();
orderRouter.post("/cod", authorize, placeOrderCOD);
orderRouter.get("/user", authorize, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
