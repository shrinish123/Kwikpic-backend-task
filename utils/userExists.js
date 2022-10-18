
const userExists = (userId,participants) =>{

    
    return  participants.some((participant)=>{
        return participant.user == userId;
    })
     
}
 
module.exports = userExists;
