const mongoose = require("mongoose");

// All statuses an order can have. Used by the schema AND the controller.
const ORDER_STATUSES = ["PENDING", "PROCESSING", "READY", "COLLECTED", "CANCELLED"];

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // unique blocks duplicate IDs
    studentName: { type: String, required: true, trim: true },
    registerNumber: { type: String, required: true, trim: true },
    documentName: { type: String, required: true },
    documentPath: { type: String, required: true },
    pages: { type: Number, required: true, min: 1 },
    copies: { type: Number, required: true, min: 1 },
    printType: {
      type: String,
      required: true,
      enum: ["Black & White", "Color"],
    },
    printSide: {
      type: String,
      required: true,
      enum: ["Single Side", "Double Side"],
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES, // Mongoose rejects any other value
      default: "PENDING",
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ORDER_STATUSES };
