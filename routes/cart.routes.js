import { Router } from "express";
import { authorize } from "../middlewars/auth.middleware.js";
import { updateCartItems } from "../controllers/cart.controller.js";
const cartRouter = Router();

cartRouter.post("/update", authorize, updateCartItems);
export default cartRouter;
