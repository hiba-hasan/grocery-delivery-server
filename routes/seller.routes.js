import { Router } from "express";
import { sellerSignIn } from "../controllers/seller.controllers.js";

const sellerRouter = Router();

sellerRouter.post("/sign-in", sellerSignIn);

export default sellerRouter;
