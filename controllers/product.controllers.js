import Product from "../models/product.models.js";
import { v2 as cloudinary } from "cloudinary";

export async function addProduct(req, res, next) {
  try {
    let productData = JSON.parse(req.body.productData);
    let images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });
    res.status(201).json({ success: true, message: "Product Created" });
  } catch (error) {
    next(error);
  }
}

export async function getProductList(req, res, next) {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

export async function getSpecificProduct(req, res, next) {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

export async function changeStock(req, res, next) {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.status(200).json({ success: true, message: "Stock updated" });
  } catch (error) {
    next(error);
  }
}
