const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PictureSchema = new Schema(
 {
    groupId:{
        type:Schema.Types.ObjectId, ref:'Group'
    },

    imageId:{
        type:Schema.Types.ObjectId, ref:'Image'
    },
    
    url:{
        type:String,
        required:true
    },

    userId: {
        type:Schema.Types.ObjectId, ref:'User'
    },

    
 },
 
);

module.exports = mongoose.model("Picture",PictureSchema);