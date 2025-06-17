import { Router } from "express";
import {
  isSellerAuth,
  logout,
  sellerSignIn,
} from "../controllers/seller.controllers.js";

const sellerRouter = Router();

sellerRouter.post("/sign-in", sellerSignIn);
sellerRouter.get("/logout", logout);
sellerRouter.get("/is-Auth", isSellerAuth);

export default sellerRouter;
