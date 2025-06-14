/*    /seller/sign-in  */
export async function sellerSignIn(req, res, next) {
  try {
    const { email, password } = req.body;

    if (
      email != process.env.SELLER_EMAIL &&
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
