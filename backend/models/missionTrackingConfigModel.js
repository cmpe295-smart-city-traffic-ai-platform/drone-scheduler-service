const mongoose = require('mongoose');

const missionTrackingConfigModel = new mongoose.Schema({
  mission_id: {
    type: String,
    required: true,
    unique: true,
  },
  config: {
    iot: {
      battery: Boolean,
      pressure: Boolean,
      soundLevel: Boolean,
      temperature: Boolean,
      humidity: Boolean,
    },
    health: {
      batteryvoltage: Boolean,
      signalStrength: Boolean,
      batterycurrent: Boolean,
      propellerCondition: Boolean,
      cameraHealth: Boolean,
      motorPerformance: Boolean,
      flightTime: Boolean,
    },
    location: {
      latitude: Boolean,
      altitude: Boolean,
      longitude: Boolean,
    },
    velocity: {
      velocityZ: Boolean,
      groundspeed: Boolean,
      velocityX: Boolean,
      velocityY: Boolean,
      airspeed: Boolean,
    },
    position: {
      roll: Boolean,
      direction: Boolean,
      yaw: Boolean,
      heading: Boolean,
      pitch: Boolean,
    },
  },
});

module.exports = mongoose.model('TrackingConfiguration', missionTrackingConfigModel);

