import jwt from "jsonwebtoken";

export default function authSeller(req, res, next) {
  try {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
      const error = new Error("Seller is not Authorized");
      error.statusCode = 401;
      throw error;
    }

    const decode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decode) {
      if (process.env.SELLER_EMAIL != decode.email) {
        const error = new Error("Seller is not Authorized");
        error.statusCode = 401;
        throw error;
      }
      next();
    }
  } catch (error) {
    next(error);
  }
}
