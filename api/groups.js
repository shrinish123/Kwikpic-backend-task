const express = require('express');
const router = express.Router();
const GroupModel = require('../models/groups');
const ObjectId = require('mongoose').Types.ObjectId;


router.post("/",async(req,res)=>{
    
    const {name,userId} = req.body;

    if(name === undefined || userId === undefined ){
        return res.status(401).send('Data sent incorrectly');
    }

    if(!ObjectId.isValid(userId)){
      return res.status(401).send("Invalid User Id");
    }

    try{
        const participants = [];
        participants.push({user:userId});

        const group = GroupModel({
          name,
          participants
        })

        await group.save();

        return res.status(201).send(group);

    }catch(err){
        console.log(err);
        return res.status(502).send('Server Error');
    }
})



router.delete("/",async(req,res)=>{
   
  const groups = await GroupModel.deleteMany({});

  return res.send("Deleted");
})


module.exports = router;