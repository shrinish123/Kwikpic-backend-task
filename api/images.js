const express = require('express');
const router = express.Router();
const ImageModel = require('../models/images');
const UserModel = require('../models/users');
const GroupModel = require('../models/groups');
const userExists = require('../utils/userExists');

const ObjectId = require('mongoose').Types.ObjectId;



router.post("/",async(req,res)=>{
    
    const {url,name,uploadedBy,groupId} = req.body;

    if(url ===undefined || name ===undefined || uploadedBy ===undefined || groupId ===undefined ){
        return res.status(401).send('Data sent incorrrectly');
    }

    if(!ObjectId.isValid(uploadedBy) || !ObjectId.isValid(groupId) ){
        return res.status(401).send("Invalid objectIds");
    }
    
    try{

        const user = await UserModel.findById(uploadedBy);

        if(!user){
            return res.status(404).send("User not found");
        }


        const group = await GroupModel.findById(groupId)

        if(!group){
            return res.status(404).send("Group not found");
        }
      
        if(!userExists(uploadedBy,group.participants)){
             return res.status(401).send("User is not a member of the group");
        }
        
        

        const image = new ImageModel({
            url,
            name,
            users:[],
            uploadedBy,
            groupId
        });

        await image.save();

        return res.status(201).send(image);

    }  
    catch(err){ 
        console.log(err);
        return res.status(502).send('Server Error');
    }
})


router.post('/temp',async(req,res)=>{

    const {images} = req.body;

    console.log(images);

    try{
         
        const imagesres = await ImageModel.insertMany(images);
 
        return res.status(201).send("Completed");
    }
    catch(err){ 
        console.log(err);
        return res.status(502).send('Server Error');
    }
})

router.delete("/",async(req,res)=>{
   
    const images = await ImageModel.deleteMany({});

    return res.send("Deleted");
})

router.get("/count",async(req,res)=>{

    const count = await ImageModel.find({}).count();

    return res.sendStatus(201).send(count);
})


module.exports = router;
