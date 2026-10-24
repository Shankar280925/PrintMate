const fs = require("fs");
const { Order, ORDER_STATUSES } = require("../models/Order");
const Counter = require("../models/Counter");

// Price per page in rupees
const PRICE_PER_PAGE = {
  "Black & White": 1,
  Color: 5,
};

// price = pages x copies x price per page
function calculateAmount(pages, copies, printType) {
  const pricePerPage = PRICE_PER_PAGE[printType];
  return pages * copies * pricePerPage;
}

// Creates XR1001, XR1002, XR1003 ...
async function generateOrderId() {
  // $inc adds 1 to the counter in ONE atomic step, so IDs never repeat
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true } // upsert: create the counter if it doesn't exist
  );
  return "XR" + (1000 + counter.value); // first order => XR1001
}

// Checks that a value is a whole number between min and max
function isWholeNumberInRange(value, min, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max;
}

// Deletes the uploaded file and sends a 400 error.
// Without this, rejected orders would leave useless files in uploads/.
function rejectOrder(res, file, message) {
  if (file) {
    fs.unlink(file.path, function () {});
  }
  return res.status(400).json({ message: message });
}

// POST /api/orders
async function createOrder(req, res) {
  const file = req.file; // set by the multer middleware

  try {
    const studentName = (req.body.studentName || "").trim();
    const registerNumber = (req.body.registerNumber || "").trim();
    const { pages, copies, printType, printSide } = req.body;

    // ---- Validation ----
    if (!studentName) {
      return rejectOrder(res, file, "Student name is required.");
    }
    if (!registerNumber) {
      return rejectOrder(res, file, "Register number is required.");
    }
    if (!file) {
      return rejectOrder(res, file, "Please upload a document (PDF, JPG, JPEG or PNG).");
    }
    if (!isWholeNumberInRange(pages, 1, 500)) {
      return rejectOrder(res, file, "Number of pages must be a whole number between 1 and 500.");
    }
    if (!isWholeNumberInRange(copies, 1, 100)) {
      return rejectOrder(res, file, "Number of copies must be a whole number between 1 and 100.");
    }
    if (printType !== "Black & White" && printType !== "Color") {
      return rejectOrder(res, file, "Print type must be 'Black & White' or 'Color'.");
    }
    if (printSide !== "Single Side" && printSide !== "Double Side") {
      return rejectOrder(res, file, "Printing side must be 'Single Side' or 'Double Side'.");
    }

    // ---- Business logic (backend decides the price) ----
    const amount = calculateAmount(Number(pages), Number(copies), printType);
    const orderId = await generateOrderId();

    // ---- Save in MongoDB ----
    const newOrder = await Order.create({
      orderId: orderId,
      studentName: studentName,
      registerNumber: registerNumber,
      documentName: file.originalname,
      documentPath: "uploads/" + file.filename,
      pages: Number(pages),
      copies: Number(copies),
      printType: printType,
      printSide: printSide,
      amount: amount,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("createOrder error:", error.message);
    if (file) {
      fs.unlink(file.path, function () {});
    }
    res.status(500).json({ message: "Could not save the order. Please try again." });
  }
}

// GET /api/orders
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // newest first
    res.json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    res.status(500).json({ message: "Could not load orders. Please try again." });
  }
}

// GET /api/orders/:orderId
async function getOrderById(req, res) {
  try {
    const orderId = req.params.orderId.trim().toUpperCase(); // "xr1001" also works
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error.message);
    res.status(500).json({ message: "Could not load the order. Please try again." });
  }
}

// PUT /api/orders/:orderId/status
async function updateOrderStatus(req, res) {
  try {
    const orderId = req.params.orderId.trim().toUpperCase();
    const status = req.body.status;

    // Reject anything that is not one of the 5 allowed statuses
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: " + ORDER_STATUSES.join(", ") + ".",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true } // return the updated order, not the old one
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("updateOrderStatus error:", error.message);
    res.status(500).json({ message: "Could not update the status. Please try again." });
  }
}

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
