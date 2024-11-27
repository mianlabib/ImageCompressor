const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const compressedFilePath = path.join(__dirname, "uploads", `compressed-${Date.now()}.jpg`);

  sharp(filePath)
    .resize(800) // Resize to 800px width
    .jpeg({ quality: 80 }) // Compress image
    .toFile(compressedFilePath, (err, info) => {
      if (err) {
        console.error("Error compressing image:", err);
        return res.status(500).send("Image compression failed");
      }
      // Send the path of the compressed image
      res.json({ compressedImage: `http://localhost:5000/${compressedFilePath.replace('uploads/', '')}` });
    });
};
