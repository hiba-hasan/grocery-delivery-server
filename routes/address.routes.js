import { Router } from "express";
import { authorize } from "../middlewars/auth.middleware.js";
import { addAddress, getAddress } from "../controllers/address.controllers.js";
const addressRouter = Router();

addressRouter.post("/add", authorize, addAddress);
addressRouter.get("/get", authorize, getAddress);

export default addressRouter;
