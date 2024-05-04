import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    videoFile: {
        type: String, //cloude url
        required: [true, "Video url required"]
    },
    thumbnail: {
        type: String, //cloudnary url
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    discription: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    views: {
        type: Number, 
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: ""
    }

  },
  {
    timestamps: true,
  }
);

export const Video = mongoose.model("Video", videoSchema);
