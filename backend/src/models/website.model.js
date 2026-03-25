const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },

  status: { type: String, enum: ["UP", "DOWN"], default: "UP" },
  responseTime: Number,
  lastChecked: Date,

  uptimeCount: { type: Number, default: 0 },
  downtimeCount: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Website", websiteSchema);