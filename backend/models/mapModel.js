const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    TenantId: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Lat: {
        type: Number,
        required: true
    },
    Long: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('mapData', mapSchema);