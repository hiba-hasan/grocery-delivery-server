import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export async function authorize(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      throw error;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode) {
      const user = await User.findById(decode.id);
      if (!user) {
        const error = new Error("UnAuthorized");
        error.statusCode = 401;
        throw error;
      }
      req.user = user;

      next();
    }
  } catch (error) {
    next(error);
  }
}
