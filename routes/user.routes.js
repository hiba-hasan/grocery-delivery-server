import express from "express";
import {
  createUser,
  isUserAuth,
  signIn,
  signOut,
} from "../controllers/user.controllers.js";
import { authorize } from "../middlewars/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/sign-up", createUser);
userRouter.post("/sign-in", signIn);
userRouter.get("/sign-out", authorize, signOut);
userRouter.get("/is-Auth", isUserAuth);

export default userRouter;
