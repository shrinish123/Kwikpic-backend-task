const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const GroupModel= require('../models/groups');
const ImageModel = require('../models/images');
const PictureModel = require('../models/pictures');


const ObjectId = require('mongoose').Types.ObjectId;

router.post("/",async(req,res)=>{
    
    const {userId,groupId,results} = req.body;
     
    if(userId === undefined || groupId === undefined || results === undefined){
        return res.status(401).send('Data sent incorrectly');
    }

    if(!ObjectId.isValid(userId) || !ObjectId.isValid(groupId)){
        return res.status(401).send('Invalid ObjectIds');
    }

    try{

        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).send('User not found');
        }

        const group = await GroupModel.findById(groupId);
        if(!group){
            return res.status(404).send('Group not found');
        }

       let successfulResults =[];
       let unsucessfulResults = [];

       const newUser = [{
            user: ObjectId(userId)
        }]
     
       // creating pipeline aggregate  to fetch Images and update users array 

       const pipeline = [
        {$match:     { $and : [{groupId:ObjectId(groupId)},{url: {$in: results}}]}},
        {$addFields: {"__order": {$indexOfArray: [results, "$url" ]}}},
        {$sort:      {"__order": 1}},
        {$set:       {users: { $cond : [{$in: [ {user:ObjectId(userId)}, "$users" ]},"$users",{ $concatArrays :[ "$users",newUser]}]}}}
       ];

       const images = await  ImageModel.aggregate(pipeline);
       
       console.log(images);

       // checking for unsuccessful retrieved images

       let j=0;

       for(let i=0;i<results.length;i++){

         if(j < images.length){
               
            if(images[j].__order !== i){
                unsucessfulResults.push(results[i]);
            }
            j++;
         }
         else{
            unsucessfulResults.push(results[i]);
         }
          
       }


       
        

      //  Making unique entries to Picture Table 

       let pictures =[];
       const picturesBulk = PictureModel.collection.initializeUnorderedBulkOp();

       const start = new Date();

       for(let i=0;i<images.length;i++){
         

        
        const picture = {
           groupId,
           imageId:images[i]._id,
           userId
        }
        
        let picExists = await PictureModel.exists(picture);
         
        // if(true){
        //     picturesBulk.insert({...picture,url:images[i].url});
        // }
        
        successfulResults.push(images[i].url);
    }
       const end = new Date();
       console.log(end-start);
       if(picturesBulk.batches.length > 0 ){
        const picres = await picturesBulk.execute();
        console.log(picres);
       }
       
       

       
        return res.status(201).json({status:'201',successfulResults,unsucessfulResults});
    

    //    console.log(images);
  

    //    for(let i=0;i<results.length;i++){
        
    //       try{
    //         const url = results[i];
    //         const imageArr = await ImageModel.find({url});

    //         const image = imageArr[0];

    //         if(!image){
    //             unsucessfulResults.push(url);
    //             continue;
    //         }
             
    //         if(image.groupId != groupId){
    //             unsucessfulResults.push(url);
    //             continue;
    //         }
           
    //         if(!userExistsinArr(userId,image.users)){

    //             image.users.push({ user: userId});
    //             console.log(image);
    //             await image.save();
                 
    //             const picture = new PictureModel({
    //                 groupId,
    //                 imageId: image._id,
    //                 url,
    //                 userId
    //             });
    
    //             await picture.save();
    
    //             successfulResults.push(url);
    //             console.log(i);
  
    //        }else{
    //           skippedResults.push(url);
    //           continue;
    //        }

    //       }
    //       catch(err){
    //          console.log(err);
    //          return res.status(502).send("Server Error");
    //       }
    //    }
        

    }
    catch(err){
        console.log(err);
        return res.status(502).send("Server Error");
    }
    
})




module.exports = router;