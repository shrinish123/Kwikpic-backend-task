const express = require('express');
const router = express.Router();
const PictureModel = require('../models/pictures');
const ImageModel = require('../models/images');
const UserModel = require('../models/users');
const GroupModel = require('../models/groups');

const ObjectId = require('mongoose').Types.ObjectId;

router.post("/",async(req,res)=>{


    const {groupId,imageId,url,userId} = req.body;

    if(groupId === undefined || imageId === undefined || url === undefined || userId === undefined ){
        return res.status(401).send("Data sent incorrectly");
    }

    if(!ObjectId.isValid(groupId) || !ObjectId.isValid(imageId) || !ObjectId.isValid(userId)){
        return res.status(401).send('Invalid objectIds');
    }

    try{

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(404).send("User not found");
        }

        const group = await GroupModel.findById(groupId);

        if(!group) {
            return res.status(404).send("Group not found");
        }

        const image  = await ImageModel.findById(imageId);

        if(!image) {
            return res.status(404).send("Image not found");
        }

        const picture = new PictureModel({
            url,
            imageId,
            groupId,
            userId
        });

        await picture.save();

        return res.status(201).send(picture);


    }catch(err){
        console.log(err);
        return res.status(502).send('Server Error');
    }
})

router.delete("/",async(req,res)=>{
   
    const pictures = await PictureModel.deleteMany({});
  
    return res.send("Deleted");
  })


module.exports = router;