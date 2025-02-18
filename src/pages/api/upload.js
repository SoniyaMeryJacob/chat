import { MongoClient } from "mongodb";
import multer from "multer";
import path from "path";
import { createRouter } from "next-connect";

const uri = "mongodb+srv://soniyamery22:Faith1234@cluster0.kdo8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Configure storage to save files locally in the `public/uploads` directory
const storage = multer.diskStorage({
  destination: "./public/uploads", // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "application/pdf", "text/plain", "application/msword"];
    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, TXT, and DOC files are allowed!"), false);
    }
  }
});


// Create API router
const router = createRouter();

// Middleware for handling file upload
router.use(upload.single("file"));

// POST handler to upload file
router.post(async (req, res) => {
  console.log("File received:", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`, // Local file URL
    contentType: req.file.mimetype,
    size: req.file.size,
    uploadDate: new Date(),
  };

  try {
    await client.connect();
    const db = client.db("chatdb"); // Database
    const collection = db.collection("chatfile"); // Collection

    const result = await collection.insertOne(fileData);
    console.log("File inserted into MongoDB:", result.insertedId);

    res.status(200).json({
      success: true,
      fileUrl: fileData.fileUrl,
      filename: fileData.filename,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("MongoDB Insert Error:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
});

// Global error handler
router.use((error, req, res, next) => {
  console.error("Error during file upload:", error.message);
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds the 5MB limit." });
  } else if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ error: "Invalid file type. Only image files are allowed." });
  } else {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// Handle unsupported HTTP methods
router.use((req, res) => {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
});

export default router.handler();

// Disable Next.js body parser for multer to work correctly
export const config = {
  api: {
    bodyParser: false,
  },
};
