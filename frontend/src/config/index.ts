const config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "",
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
};

export default config;
