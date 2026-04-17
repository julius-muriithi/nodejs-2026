const express = require("express");
const authMiddleware = require("../middleware/middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController,fetchImageController,deleteImageController } = require("../controllers/image-controller");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController,
  fetchImageController
);

router.get("/get",authMiddleware,fetchImageController)
router.delete("/:id",authMiddleware,adminMiddleware,deleteImageController)


module.exports = router;
