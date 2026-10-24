const mongoose = require("mongoose");

// One document in this collection: { name: "order", value: 5 }
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
