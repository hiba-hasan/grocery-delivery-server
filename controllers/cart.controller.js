import User from "../models/user.models.js";

export async function updateCartItems(req, res, next) {
  try {
    const { user, cartItems } = req.body;
    await User.updateOne({ _id: user._id }, { $set: { cartItems: cartItems } });
    res
      .status(204)
      .json({ success: true, message: "Updated Cart successfully" });
  } catch (error) {
    next(error);
  }
}
