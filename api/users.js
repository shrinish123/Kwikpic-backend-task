const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');

router.post("/",async(req,res)=>{
   
    const {name,lastName} = req.body;

    if(name === undefined || lastName === undefined){
        return res.status(401).send("User Data sent incorrectly");
    }

    try{
        const user= new UserModel({
            name,
            lastName
           });
        
        await user.save();
        
        return res.status(201).send(user);


    }catch(err){
        console.log(err);
        return res.status(502).semd("Server Error");
    }
})

router.get('/',async(req,res)=>{

    const users = await UserModel.find({});

    res.send(users);
});

router.delete("/",async(req,res)=>{
   
    const users = await UserModel.deleteMany({});

    return res.send("Deleted");
})


module.exports = router;