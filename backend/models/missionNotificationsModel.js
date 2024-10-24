const mongoose = require('mongoose');

// const CoordsSchema = new mongoose.Schema({
//     message: String,
//     msg_category: String,
//     mav_command: String,
//     msg_severity: Number,
// });

const missionNotificationsModel = new mongoose.Schema({
    mission_id:{
        type:String,
        required:true,
    },
    message: {
        type: String,
        required: true
    },
    msg_category: {
        type: String,
    },
    mav_command: {
        type: String,
    },
    msg_severity: {
        type: Number,
        required: true
    },
    mission_type: {
        type: String,
        required: true
    },
    mission_location: {
        type: String,
    },
    timestamp: {type:Date}
});


module.exports = mongoose.model('missionNotification', missionNotificationsModel);