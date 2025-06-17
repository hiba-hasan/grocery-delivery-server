import jwt from "jsonwebtoken";

/*    /seller/sign-in  */
export async function sellerSignIn(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log("Login", email);

    if (
      email != process.env.SELLER_EMAIL ||
      password != process.env.SELLER_PASSWORD
    ) {
      const error = new Error("UnAuthorized:Invalid Email or password");
      error.statusCode = 401;
      throw error;
    }
    const sellerToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.cookie("sellerToken", sellerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", //CSRF protection
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "logged In Successfully", email: email });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", //CSRF protection
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function isSellerAuth(req, res, next) {
  try {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
      const error = new Error("UnAuthorized");
      error.status = 401;
      throw error;
    }
    const decode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (decode) {
      console.log(decode.email);
      if (decode.email == process.env.SELLER_EMAIL) {
        return res.status(200).json({ success: true });
      } else {
        const error = new Error("UnAuthorized");
        error.status = 401;
        throw error;
      }
    }
    const error = new Error("UnAuthorized");
    error.status = 401;
    throw error;
  } catch (error) {
    next(error);
  }
}
