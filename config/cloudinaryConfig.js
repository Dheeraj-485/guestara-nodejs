const cloudinary=require("cloudinary").v2;
require("dotenv").config()


//Cloudinary is used to upload our images global so that when we have to deploy our website we can access images globally
 cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

module.exports.uploadToCloudinary=cloudinary
