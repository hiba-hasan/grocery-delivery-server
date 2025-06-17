import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export async function authorize(req, res, next) {
  try {
    console.log("userAuth");
    const { token } = req.cookies;
    if (!token) {
      console.log("Not Token");
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      throw error;
    }

    console.log("REquest:", req.body);

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode) {
      console.log(decode.id);
      const user = await User.findById(decode.id);
      if (!user) {
        console.log("Not of user");

        const error = new Error("UnAuthorized");
        error.statusCode = 401;
        throw error;
      }
      req.user = user;

      next();
    }
  } catch (error) {
    console.log("Error in userAuth");
    console.log(error);
    next(error);
  }
}
