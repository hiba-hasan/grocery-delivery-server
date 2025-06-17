import Address from "../models/address.models.js";

export async function addAddress(req, res, next) {
  try {
    const { address } = req.body;
    const user = req.user;
    const userId = user._id;
    await Address.create({ ...address, userId });
    res
      .status(201)
      .json({ success: true, message: "Added Address Successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getAddress(req, res, next) {
  try {
    const user = req.user;

    const userId = String(user._id);
    console.log("UserID", userId);
    const addresses = await Address.find({ userId });
    console.log("Address: ", addresses);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}
