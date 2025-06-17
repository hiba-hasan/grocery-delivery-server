import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },
    description: {
      type: Array,
      required: [true, "production Description is Required"],
    },
    category: {
      type: String,
      required: [true, "Product Category is Required"],
    },
    price: { type: Number, required: [true, "Product Price is Required"] },
    offerPrice: { type: Number, required: [true, "Offer Price is Required"] },
    image: { type: Array, required: [true, "Product Image is Required"] },
    inStock: {
      type: Boolean,

      required: [true, "Mentioning of inStock is Required"],
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
