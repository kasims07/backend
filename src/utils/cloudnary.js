import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.COLUDNARY_NAME,
  api_key: process.env.COLUDNARY_APIKEY, 
  api_secret: process.env.COLUDNARY_SECRATE 
});


const uploadOnCloudnary = async (localfilePath) => {
  try{
    if(!localfilePath) return null
    //upload the file on cloudnary
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto"
    })
    //file hase been uploaded sucessfully
    console.log("File is uploaded on cloudnary", response.url);
    return response;
  }catch(e){
    fs.unlinkSync(localfilePath)
    return null
  }
}

export {uploadOnCloudnary}

