const mongoose = require("mongoose");

const CollectionImageSchema = new mongoose.Schema(
  {
    collectionId: {
      type: Number, 
      required: [true, "collectionId is required"],
      index: true,
    },
    image: {
      type: String, 
      required: [true, "image is required"],
      trim: true,
    },
    collection_name:{
      type: String,
      required:[true,"Collection name is required"]
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (ret.image && !ret.image.startsWith('http')) {
          ret.image = `${process.env.BASE_URL_TWO}uploads/${ret.image}`;
        }
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        if (ret.image && !ret.image.startsWith('http')) {
          ret.image = `${process.env.BASE_URL_TWO}uploads/${ret.image}`;
        }
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("CollectionImage", CollectionImageSchema);
