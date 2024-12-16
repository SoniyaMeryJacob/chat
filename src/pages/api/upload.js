// pages/api/upload.js
import multer from 'multer';
import path from 'path';
import { createRouter } from 'next-connect';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',  // Directory where files will be stored
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique timestamped filename
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { // Only image files allowed
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, etc.) are allowed!'), false);
    }
  },
});

// Create the router using next-connect
const router = createRouter();

// Use multer middleware for handling file upload
router.use(upload.single('file'));

// POST handler for file upload
router.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    fileUrl,
    message: 'File uploaded successfully',
  });
});

// Global error handler (correct approach)
router.use((error, req, res, next) => {
  console.error('Error during file upload:', error.message);
  
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
  } else if (error.message === 'Only image files (JPEG, PNG, GIF, etc.) are allowed!') {
    return res.status(400).json({ error: 'Invalid file type. Only image files are allowed.' });
  } else {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// Handle unsupported HTTP methods
router.use((req, res) => {
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
});

export default router.handler();

// Disable Next.js body parser to allow multer to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};
