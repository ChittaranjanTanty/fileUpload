const File = require("../schema/fileSchema");

exports.uploadFile = async (req, res) => {
  try {
    const file = new File({
      filename: req.file.originalname,
      fileType: req.file.mimetype.startsWith("image") ? "image" : "pdf",
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", id: file._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });
    
        res.set({
          'Content-Type': file.contentType, // like 'application/pdf' or 'image/png'
          'Content-Disposition': `inline; filename="${file.originalName}"`,
        });
    
        res.send(file.data); // Send buffer as-is
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch file' });
      }
};

exports.deleteFile = async (req, res) => {
    try {
      const file = await File.findByIdAndDelete(req.params.id);
      if (!file) return res.status(404).json({ error: 'File not found' });
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  };
