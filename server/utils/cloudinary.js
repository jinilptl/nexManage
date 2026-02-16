import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); 

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("ENV:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "exists" : "missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "missing"
});


const uploadOnCloudinary = async (localFilePath, folder = "nexmanage") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    fs.unlinkSync(localFilePath);

    return {
      url: response.secure_url,
      publicId: response.public_id,
      fileName: response.original_filename,
      resourceType: response.resource_type,
    };
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
