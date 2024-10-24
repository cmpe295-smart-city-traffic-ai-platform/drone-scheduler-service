const mongoose=require('mongoose')

const droneModel=mongoose.Schema(
    {
        drone_id:{type:String,required:true, unique:true},
        manufacturer:{type:String,required:true},
        name:{type:String, required:true},
        model_number:{type:String, required:true},
        price:{type:String,required:true},
    },
);

const Drone=mongoose.model("Dronemodel",droneModel);

module.exports=Drone;

