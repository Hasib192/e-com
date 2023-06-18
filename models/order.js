const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: mongoose.Schema.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not processed",
      enum: ["No processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
