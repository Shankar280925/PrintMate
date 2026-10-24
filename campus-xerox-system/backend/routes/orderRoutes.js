const express = require("express");
const uploadDocument = require("../middleware/upload");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// uploadDocument runs first (saves the file), then createOrder runs
router.post("/", uploadDocument, createOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/status", updateOrderStatus);

module.exports = router;
