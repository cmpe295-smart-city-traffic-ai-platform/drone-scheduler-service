const mongoose=require('mongoose')

const missionModel=mongoose.Schema(
    {
        mission_id:{type:String,required:true, unique:true},
        location:{type:String,required:true},
        drone_id:{type:String, required:true},
        date:{type:String, required:true},
        status:{type:String,required:true},
        flightheight:{type:String,required:true},
        alerts:{type:Array,required:true},
    },
);

const Mission=mongoose.model("Missionmodel",missionModel);

module.exports=Mission;

