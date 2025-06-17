import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/*    /user/sign-up     */
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      let error = new Error("User Already Exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", //CSRF protection
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User created",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
}

/*    /user/sign-in    */

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      let error = new Error("User doesnt Exist");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      let error = new Error("Password is Invalid");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", //CSRF protection
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Logged In successfully",
      token: token,
      user: { name: existingUser.name, email: existingUser.email },
    });
  } catch (error) {
    next(error);
  }
}

/*   /user/sign-out   */

export async function signOut(req, res, next) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", //CSRF protection
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function isUserAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      const error = new Error("User is not authorized");
      error.statusCode = 401;
      throw error;
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decode.id);
    if (!user) {
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "User is Authorized", user });
  } catch (error) {}
}
