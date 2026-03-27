const mongoose = require("mongoose");

const emailConfigSchema = new mongoose.Schema({
  emails: [String],
  interval: Number, // minutes
  lastSentAt: Date
});

module.exports = mongoose.model("EmailConfig", emailConfigSchema);