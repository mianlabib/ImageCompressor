const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;

// Enable CORS for frontend
app.use(cors());

// Setup multer for file uploads with validation and size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB max file size
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    if (validMimeTypes.includes(file.mimetype)) {
      cb(null, true); // File is valid
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  }
});

// API endpoint for image compression
app.post("/api/compress", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;

    // Ensure image exists
    if (!image) {
      return res.status(400).send("No image uploaded");
    }

    // Original image size in KB
    const originalSizeKB = image.size / 1024;

    // Compress image using sharp
    const compressedBuffer = await sharp(image.buffer)
      .resize(800) // Resize image to width of 800px (maintains aspect ratio)
      .toFormat("jpeg", { quality: 80 }) // Convert to JPEG and compress
      .toBuffer();

    // Compressed image size in KB
    const compressedSizeKB = compressedBuffer.length / 1024;

    // Calculate size reduction percentage
    const sizeReductionPercentage = ((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100;

    // Debug logging
    console.log("Original Size (KB):", originalSizeKB);
    console.log("Compressed Size (KB):", compressedSizeKB);
    console.log("Size Reduction (%):", sizeReductionPercentage);

    // Generate a temporary file name for the compressed image
    const tempFileName = `compressed_${Date.now()}.jpg`;
    const tempFilePath = path.join(__dirname, "temp", tempFileName);

    // Ensure the temp directory exists
    await fs.promises.mkdir(path.join(__dirname, "temp"), { recursive: true });

    // Save the compressed image temporarily
    await fs.promises.writeFile(tempFilePath, compressedBuffer);

    // Return the URL to download the compressed image
    res.json({
      compressedImageUrl: `${req.protocol}://${req.get("host")}/temp/${tempFileName}`,
      originalSize: Math.round(originalSizeKB),  // Round to avoid decimal points
      compressedSize: Math.round(compressedSizeKB),
      sizeReduction: Math.round(sizeReductionPercentage),
    });

    // Cleanup the temporary file after sending the response
    res.on('finish', () => {
      fs.promises.unlink(tempFilePath)
        .then(() => console.log(`Deleted temporary file: ${tempFileName}`))
        .catch((err) => console.error('Error deleting temporary file:', err));
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    res.status(500).send("Error compressing image");
  }
});

// Serve the compressed image from the temp folder
app.use("/temp", express.static(path.join(__dirname, "temp")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
