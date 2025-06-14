import express from "express";
import {
  createUser,
  signIn,
  signOut,
} from "../controllers/user.controllers.js";
import { authorize } from "../middlewars/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/sign-up", createUser);
userRouter.post("/sign-in", signIn);
userRouter.get("/sign-out", authorize, signOut);

export default userRouter;
