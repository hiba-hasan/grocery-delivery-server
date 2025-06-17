import User from "../models/user.models.js";

export async function updateCartItems(req, res, next) {
  try {
    console.log("cartController");
    const { cartItems } = req.body;
    const user = req.user;
    console.log("CART:", cartItems);

    console.log("cart", user._id);
    await User.updateOne({ _id: user._id }, { $set: { cartItems: cartItems } });
    res
      .status(200)
      .json({ success: true, message: "Updated Cart successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
