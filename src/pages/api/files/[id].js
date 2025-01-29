import path from "path";
import fs from "fs";
import { createRouter } from "next-connect";

const router = createRouter();

router.get((req, res) => {
  const { id } = req.query; // `id` is the filename

  // Define file path
  const filePath = path.join(process.cwd(), "public/uploads", id);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router.handler();
