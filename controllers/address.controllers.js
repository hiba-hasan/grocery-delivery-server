import Address from "../models/address.models.js";

export async function addAddress(req, res, next) {
  try {
    const { userId, address } = req.body;
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
    const { userId } = req.body;
    const addresses = Address.find({ userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}
