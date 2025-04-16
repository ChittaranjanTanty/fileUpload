const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  fileType: String,
  data: Buffer,
  contentType: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
