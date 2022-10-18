const axios = require('axios');
const express = require('express');
const router = express.Router();


router.post("/",async(req,res)=>{
    
    for(let i=0;i<10;i++){
        
        const user = {
            name : `name-${i}`,
            lastName:`lastName-${i}`
        }
         
        try{
            const userres = await axios.post('http://localhost:5000/api/users',user);
           

            
            
            const group = {
                name : `group-name-${i}`,
                userId:userres.data._id
            }

            try{
                 
                const groupres = await  axios.post('http://localhost:5000/api/groups',group);
               
                let images = [];

                
                for(let j=0;j<10000;j++){

                    const image = {
                        url:`url-${j}`,
                        name:`image-name-${j}`,
                        users:[],
                        uploadedBy:userres.data._id,
                        groupId:groupres.data._id
                    }
                    images.push(image);
                }

                try{
                    const imageres=  await axios.post('http://localhost:5000/api/images/temp',{images});
                }
                catch(err){
                    console.log(err)
                }


            }
            catch(err){
                console.log(err);
            }
        }
        catch(err){
            console.log(err);

        }    
    }
    return res.status(201).send("Completed");
})


module.exports = router;