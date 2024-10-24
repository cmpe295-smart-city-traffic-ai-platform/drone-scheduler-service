const DroneSummary=require('../models/droneSummaryModel');

  const getSummary=async(req,res,next)=>{
    let summary;
    try{
        summary=await DroneSummary.find({});
    }catch(err){
        return new Error(err);
    }
    if(!summary){
        return res.status(400).json({message:"Summary not found"})
    }
    return res.status(200).json(summary);
}

  
module.exports={getSummary};