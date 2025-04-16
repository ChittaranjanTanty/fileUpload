const express = require("express");
const multer = require("multer");
const router = express.Router();
const fileController = require("../controllers/fileController");

// Use memory storage to keep file in buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/file/:id", fileController.getFile);

module.exports = router;
