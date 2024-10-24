const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    active: String,
    connected: String,
    stopped: String,
    repair: String,
  });

const droneSummaryModel = new mongoose.Schema({
    drone_status: {
        type: statusSchema, 
        required: true
    }
});


module.exports = mongoose.model('droneSummary', droneSummaryModel);