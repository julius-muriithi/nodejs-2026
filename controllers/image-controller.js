const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/helpersCloudinary");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: false,
        message: "File is required.Please upload an image",
      });
    }
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();
    res.status(201).json({
      success: false,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "Something went wrong.Please try again",
    });
  }
};
const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "Something went wrong.Please try again",
    });
  }
};
const deleteImageController = async (req, res) => {
  try {
    const imageToBeDeletedId = req.params.id;
    const userId = req.userInfo.userId;
    const image = await Image.findById(imageToBeDeletedId);

    if (!image) {
      res.status(400).json({
        success: false,
        message: "Image could not be found",
      });
    }
    //check if image is uploaded by the current user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this image",
      });
    }
    //delete from cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    //delete from mongo database
    await Image.findByIdAndDelete(imageToBeDeletedId);
    res.status(200).json({
      success: true,
      message: "Image deleted succefully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "Something went wrong.Please try again",
    });
  }
};
module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
