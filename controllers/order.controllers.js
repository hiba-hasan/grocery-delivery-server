import stripe from "stripe";
import Order from "../models/order.models.js";
import Product from "../models/product.models.js";
import { request, response } from "express";
import User from "../models/user.models.js";

export async function placeOrderCOD(req, res, next) {
  try {
    const { items, address } = req.body;
    const user = req.user;
    const userId = String(user._id);

    console.log("Add: ", address);

    // const amount = await items.reduce(async (acc, item) => {
    //   const product = await Product.findById(item.product);
    //   return (await acc) + product.offerPrice * item.quantity;
    // }, 0);

    let amount = 0;

    const pricePromises = items.map(async (item) => {
      const product = await Product.findById(item.product);
      return product.offerPrice * item.quantity;
    });

    const prices = await Promise.all(pricePromises);
    amount = prices.reduce((acc, val) => acc + val, 0);

    amount += amount * 0.02;

    console.log("Amount: ", amount);

    await Order.create({ userId, items, address, paymentType: "COD", amount });
    return res
      .status(201)
      .json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    next(error);
  }
}
export async function placeOrderStripe(req, res, next) {
  try {
    const { items, address } = req.body;
    const user = req.user;
    // const { origin } = req.headers;

    const { origin = process.env.FRONTEND_URL } = req.headers;
    const userId = String(user._id);

    console.log("Add: ", address);

    // const amount = await items.reduce(async (acc, item) => {
    //   const product = await Product.findById(item.product);
    //   return (await acc) + product.offerPrice * item.quantity;
    // }, 0);

    let productData = [];
    let amount = 0;

    const pricePromises = items.map(async (item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return product.offerPrice * item.quantity;
    });

    const prices = await Promise.all(pricePromises);
    amount = prices.reduce((acc, val) => acc + val, 0);

    amount += amount * 0.02;

    console.log("Amount: ", amount);

    const newOrder = await Order.create({
      userId,
      items,
      address,
      paymentType: "Online",
      amount,
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId,
      },
    });
    console.log("Session: ", session.url);
    return res.status(201).json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
}

export async function stripeWebHooks(req, res, next) {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error:${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { userId, orderId } = session.data[0].metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
    }

    default:
      console.error(`Unhandled Event Type:${event.type}`);
  }
  response.json({ received: true });
}

export async function getUserOrders(req, res, next) {
  try {
    const user = req.user;
    const userId = String(user._id);
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    //console:
    console.log(orders);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}
