//upload.js
import multer from "multer";
import { createRouter } from "next-connect";

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Create the router using next-connect
const router = createRouter();

// Handle file upload
router.use(upload.single("file"));

// POST handler to upload a file
router.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Send a success response with file metadata
  res.status(200).json({
    success: true,
    fileId: req.file.id, // MongoDB ObjectId
    filename: req.file.filename, // Stored filename
    message: "File uploaded successfully",
  });
});

// Error handler
router.use((error, req, res, next) => {
  console.error("Error during file upload:", error.message);
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds the 5MB limit." });
  } else if (error.message === "Only image files are allowed!") {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only image files are allowed." });
  } else {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// Handle unsupported methods
router.use((req, res) => {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to allow multer to handle file uploads
  },
};
