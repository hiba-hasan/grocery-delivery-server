import Order from "../models/order.models.js";
import Product from "../models/product.models.js";

export async function placeOrderCOD(req, res, next) {
  try {
    const { userId, items, address } = req.body;

    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += amount * 0.02;

    await Order.create({ userId, items, address, paymentType: "COD", amount });
    return res
      .status(201)
      .json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Orders.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}
