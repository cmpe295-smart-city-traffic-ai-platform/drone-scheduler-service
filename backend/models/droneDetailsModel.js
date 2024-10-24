const mongoose=require('mongoose')

const dimensionSchema = new mongoose.Schema({
    length: Number,
    width: Number,
    height: Number
  });

const camSpecsSchema = new mongoose.Schema({
    resolution: String,
    sensor_size: String,
    max_aperture: String,
    field_of_view: Number
});

const droneDetailsModel=mongoose.Schema(
    {
        drone_id:{type:String,required:true, unique:true},
        name:{type:String, required:true},
        model:{type:String, required:true},
        type:{type:String,required:true},
        manufacturer:{type:String,required:true},
        description:{type:String,required:true},

        price:{type:Number,required:true},
        weight:{type:Number,required:true},
        dimensions:{type:dimensionSchema,required:true},
        battery_life:{type:Number,required:true},
        battery_capacity:{type:Number,required:true},
        max_speed:{type:Number,required:true},
        range:{type:Number,required:true},
        camera_specs:{type:camSpecsSchema},
        lidar:{type:Boolean},
        created_at:{type:Date},
        updated_at:{type:Date},
        last_known_lat:{type:Number, required:true},
        last_known_long:{type:Number, required:true},
        last_known_status:{type:String, required:true},
        service_types:{type:Array, required:true}
    },
);

const DroneDetails=mongoose.model("Drone",droneDetailsModel);

module.exports=DroneDetails;

