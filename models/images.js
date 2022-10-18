const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
 {
    url:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },
    users:[
        {
            user : {type:Schema.Types.ObjectId, ref:'User'}
        }
    ],

    uploadedBy: {
        type:Schema.Types.ObjectId, ref:'User'
    },

    groupId:{
        type:Schema.Types.ObjectId, ref:'Group'
    }
 },
 
);

module.exports = mongoose.model("Image",ImageSchema);