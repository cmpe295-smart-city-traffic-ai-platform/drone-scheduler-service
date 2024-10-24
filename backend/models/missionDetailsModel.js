const mongoose = require('mongoose');

const CoordsSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    altitude: Number,
    speed: Number,
    camera_actions: Number,
    delay: Number
  });

const GlobalDefaultSettingsSchema = new mongoose.Schema({
    aircraftType: String,
    defaultTerrainAlt: Number,
    defaultHeading: Number,
    defaultSpeed: Number,
    defaultFrame: Number
});

const missionDetailsModel = new mongoose.Schema({
    drone_id: {
        type: String, 
        required: true
    },
    mission_id:{
        type:String,
        required:true,
        unique:true,
    },
    mission_type: {
        type: String,
        required: true
    },
    mission_location: {
        type: String,
    },
    mission_status: {
        type: String,
    },
    mission_waypoints: {type:[CoordsSchema], default:undefined},
    mission_global_settings: {type:GlobalDefaultSettingsSchema, default:undefined},
    mission_distance: {
        type: Number,
        required: true
    },
    telemetry: {type:Array, default:undefined},
    lineCoords: {type:Array, default:undefined},
    user_id: {
        type: String,
        required: true
    },
    mission_description: {
        type: String,
    },
    mission_start_time:{
        type:Date,
        required: true
    },
    mission_end_time:{
        type:Date,
        required: true
    }
});


module.exports = mongoose.model('mission', missionDetailsModel);