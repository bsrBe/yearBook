import { v2 as cloudinary } from 'cloudinary';

const uploadImage = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
}

export default uploadImage;