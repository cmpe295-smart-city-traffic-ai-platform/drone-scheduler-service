const Mission=require('../models/missionDetailsModel');
const Drone=require('../models/droneDetailsModel');
const TrackingConfig = require('../models/missionTrackingConfigModel');
const { v4: uuidv4 } = require('uuid');

const addMission = async (req, res,next) => {
  try {
      const {
          drone_id,
          tenant_id,
          // mission_id,
          mission_distance,
          mission_name,
          items,
          location,
          defaults,
          service_type,
          mission_description,
          mission_start_time,
          mission_end_time
      } = req.body;

      let mission_id = req.body.mission_id; // Get mission_id from request body
      // console.log(mission_id);

      // If mission_id is not provided in the request body, generate a new one for creating a new mission
      if (!mission_id) {
        mission_id = uuidv4();
      }

      // Map items to mission_waypoints format
      const mission_waypoints = items.map(item => ({
          latitude: item.coordinates[0],
          longitude: item.coordinates[1],
          altitude: item.coordinates[2],
          speed: item.speed || null,
          camera_actions: item.cameraAction == 0 ? item.cameraAction :  item.cameraAction ? item.cameraAction :null,
          delay: item.delay || null
      }));

      // Add defaults to mission_global_settings
      const globalSettings = {
        aircraftType: defaults.aircraftType || null,
        defaultTerrainAlt: defaults.defaultTerrainAlt || null,
        defaultHeading: defaults.defaultHeading || null,
        defaultSpeed: defaults.defaultSpeed || null,
        defaultFrame: defaults.defaultFrame || null
      };

      // Check if mission with the given mission_id already exists
    let existingMission = await Mission.findOne({ mission_id });

    // If mission exists, update it; otherwise, create a new mission
    if (existingMission) {
      // Update the existing mission
      existingMission = await Mission.findOneAndUpdate(
        { mission_id },
        {
          drone_id,
          mission_type: service_type,
          mission_location: mission_name,
          mission_waypoints,
          mission_distance,
          mission_global_settings: globalSettings,
          user_id: tenant_id,
          mission_description,
          mission_start_time,
          mission_end_time
        },
        { new: true } // Return the updated document
      );
    } else {
      // Create a new mission instance
      existingMission = new Mission({
        drone_id,
        mission_id,
        mission_type: service_type,
        mission_location: mission_name,
        mission_status: 'Planned', // Assuming mission status starts as pending
        mission_waypoints,
        mission_distance,
        mission_global_settings: globalSettings,
        user_id: tenant_id,
        mission_description,
        mission_start_time,
        mission_end_time
      });
      // Save the new mission to the database
      await existingMission.save();
    }

    res.status(201).json({ message: 'Mission created/updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}

  const CountMissions=async(req,res,next)=>{
    let missionscount;
    try{
      missionscount= await Mission.count({});
      // console.log("Count of missions:",missionscount);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Error retrieving Missions." });
      }
      return res.status(200).json(missionscount);
  }

  const getMissions=async(req,res,next)=>{
    let missions;
    try{
        missions=await Mission.find({});
    }catch(err){
        return new Error(err);
    }
    if(!missions){
        return res.status(400).json({message:"Missions not found"})
    }
    return res.status(200).json(missions);
}

const getAllMissionsForGivenUser=async(req,res,next)=>{
  const userId = req.query.userId;
  let missions;
  try{
      missions=await Mission.find({user_id: userId})
      .select('mission_id mission_type mission_location mission_status mission_distance drone_id mission_waypoints mission_description mission_start_time mission_end_time');
  }catch(err){
      return new Error(err);
  }
  if(!missions){
      return res.status(400).json({message:"Missions not found"})
  }
  return res.status(200).json(missions);
}

const getOneMission=async(req,res,next)=>{
    //console.log(req.params);
    const missionId = req.params.mission_id;
    try{
      //console.log(missionId);
      Mission.find({mission_id: missionId}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(mission => {
          //console.log(mission);
          res.json(mission);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error retrieving Mission." });
        });
    } catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving Mission." });
    }
  }

// const getTelemetry = async(req, res, next) => {
//   const data = req.body;
//   const missionId = 'M001';
//   const io = req.io;
//   //console.log("io: " + JSON.stringify(io));
//   // Fetch a document from the collection
//   try{
//       const doc = await Mission.find({mission_id: missionId});
//       // Modify the desired field in the document
//       if (doc) {
//           //console.log(doc[0]);
//           const _id = doc[0]._id;
//           const {latitude, longitude} = req.body;
//           const updateData = {$push: {telemetry: req.body, lineCoords: [longitude, latitude]} };
//           const options = {new: true};

//           const result = await Mission.findByIdAndUpdate(_id, updateData, options);
//           //console.log(result);
//           res.json(result);
//           //console.log('Document updated successfully');
//           io.emit('telemetry', data);
//           //res.sendStatus(200);
//       } 
//       else 
//       {
//           console.error('Document not found');
//       }
//   }
//   catch(err)
//   {
//       console.error('Error finding document:', err);
//   }
// }

// const getTelemetry = async(req, res, next) => {
//   const data = req.body;
//   const droneId = data.drone_id;
//   const missionId = data.mission_id;
//   const io = req.io;
//   //console.log("io: " + JSON.stringify(io));
//   // Fetch a document from the collection
//   try{
//       const missionDoc = await Mission.find({mission_id: missionId});
//       const droneDoc = await Drone.find({drone_id: droneId});
//       if(droneDoc)
//       {
//         const filter = { drone_id: droneId };
//         const update = {
//             last_known_lat: data.telemetry.location.latitude,
//             last_known_long: data.telemetry.location.longitude,
//             last_known_status: data.drone_status,
//             updated_at: new Date(),
//             battery_life: data.telemetry.iot.battery
//         };
//         const options = { new: true }; // Return the modified document after update

//         const updatedDrone = await Drone.findOneAndUpdate(filter, update, options);
//       }
//       // Modify the desired field in the document
//       if (missionDoc) {
//           //console.log(doc[0]);
//           const _id = missionDoc[0]._id;
//           const {latitude, longitude} = data.telemetry.location;
//           const updateData = {
//             $push: {telemetry: data.telemetry, lineCoords: [longitude, latitude]},
//             mission_status: data.mission_status
//           };
//           const options = {new: true};

//           const result = await Mission.findByIdAndUpdate(_id, updateData, options);
//           //console.log(result);
//           res.json(result);
//           //console.log('Document updated successfully');
//           io.emit('telemetry', data);
//           //res.sendStatus(200);
//       } 
//       else 
//       {
//           console.error('Document not found');
//       }
//   }
//   catch(err)
//   {
//       console.error('Error finding document:', err);
//   }
// }


const getTelemetry = async(req, res, next) => {
  const data = req.body;
  const droneId = data.drone_id;
  const missionId = data.mission_id;
  const io = req.io;
  //console.log("io: " + JSON.stringify(io));
  // Fetch a document from the collection
  try{
      const missionDoc = await Mission.find({mission_id: missionId});
      const droneDoc = await Drone.find({drone_id: droneId});
      if(droneDoc)
      {
        const filter = { drone_id: droneId };
        const update = {
            last_known_lat: data.telemetry.location.latitude,
            last_known_long: data.telemetry.location.longitude,
            last_known_status: data.drone_status,
            updated_at: new Date(),
            battery_life: data.telemetry.iot.battery
        };
        const options = { new: true }; // Return the modified document after update

        const updatedDrone = await Drone.findOneAndUpdate(filter, update, options);
      }
      // Modify the desired field in the document
      if (missionDoc) {
          //console.log(doc[0]);
          const _id = missionDoc[0]._id;
          const {latitude, longitude} = data.telemetry.location;
          const updateData = {
            $push: {telemetry: data.telemetry, lineCoords: [longitude, latitude]},
            mission_status: data.mission_status
          };
          const options = {new: true};

          const result = await Mission.findByIdAndUpdate(_id, updateData, options);
          //console.log(result);
          res.json(result);
          //console.log('Document updated successfully');
          io.to(missionId).emit('telemetry', data);
          //res.sendStatus(200);
      } 
      else 
      {
          console.error('Document not found');
      }
  }
  catch(err)
  {
      console.error('Error finding document:', err);
  }
}

const getlineCoordsForMission = async(req, res, next) => {
  //const { missionId } = req.params;

  const missionId = req.query.missionId;
  const userId = req.query.userId;
  //const missionId = 'M001';
  // Fetch a document from the collection
  try{
      const doc = await Mission.find({mission_id: missionId, user_id: userId});
      // Modify the desired field in the document
      if (doc) {
          const result = doc[0].lineCoords;
          res.json(result);
      } 
      else 
      {
          console.error('Document not found');
      }
  }
  catch(err)
  {
      console.error('Error finding document:', err);
  }
}

const getMissionsFromDroneID = async(req, res, next) => {
    //const { droneId } = req.params;
    const droneId = req.query.droneId;
    const userId = req.query.userId;
    //console.log(req.params);
    // Fetch a document from the collection
    try{
        const missions = await Mission.find({ drone_id: droneId, user_id: userId }).select('mission_id mission_type mission_location mission_status');
        // Modify the desired field in the document
        if (missions) {
            return res.status(200).json(missions);
        } 
        else 
        {
            console.error('Document not found');
        }
    }
    catch(err)
    {
        console.error('Error finding document:', err);
    }
  }

const configureTracking = async (req, res) => {
  
  try {
    const { missionId, config } = req.body;

    //console.log('Received missionId:', missionId); // Log the received missionId

    // // Find the existing mission tracking config
    let existingConfig = await TrackingConfig.findOne({ mission_id : missionId });

    //console.log(existingConfig);
    // If config exists, update it; otherwise, create a new one
    if (existingConfig != null) {
      await TrackingConfig.updateOne({ mission_id : missionId }, { config });
    } else {
      // console.log(config);
      // console.log(missionId);
      // console.log("Inside else");
      // Save mission tracking config to MongoDB
      const missionTrackingConfig = new TrackingConfig({ mission_id : missionId, config });
      await missionTrackingConfig.save();
    }
    //console.log("Outside else");
    // Use findOneAndUpdate with upsert option
    // await TrackingConfig.findOneAndUpdate(
    //   { mission_id: missionId }, // Find document by missionId
    //   { mission_id: missionId, config }, // Update with the new config and set missionId
    //   { upsert: true } // Create if not exists
    // );

    res.status(201).json({ message: 'Mission tracking configuration saved successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getConfiguredTracking = async (req, res) => {
  const missionId = req.query.missionId;
  try {
    //const { missionId, config } = req.body;

    // Find the existing mission tracking config
    let existingConfig = await TrackingConfig.findOne({ mission_id : missionId });

    // If config exists, update it; otherwise, create a new one
    if (existingConfig) {
      res.status(201).json(existingConfig);
    } else {
      //console.error('Document not found');
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteOneMission = async (req, res) => {
  const missionId = req.query.missionId;
  const userId = req.query.userId;

  try {
      // Check if the mission exists and belongs to the user
      const mission = await Mission.findOne({ mission_id: missionId, user_id: userId });
      if (!mission) {
          return res.status(404).json({ message: 'Mission not found or user does not have permission to delete' });
      }

      // Delete the mission
      await Mission.deleteOne({ mission_id: missionId, user_id: userId });
      
      res.json({ message: 'Mission deleted successfully', deleted: true });
  } catch (error) {
      console.error('Error deleting mission:', error);
      res.status(500).json({ message: 'Internal server error', deleted: false });
  }
}

const fetchMissionDetails = async (req, res, next) => {
  try {
      const mission_id = req.query.missionId; // Assuming mission_id is passed as a parameter in the URL

      // Fetch mission details from the database
      const mission = await Mission.findOne({ mission_id }, { telemetry: 0, lineCoords: 0 }); // Exclude telemetry and lineCoords

      if (!mission) {
          return res.status(404).json({ message: 'Mission not found' });
      }

      // Modify mission details into the desired format
      const missionDetails = {
          version: 2,
          defaults: mission.mission_global_settings,
          items: mission.mission_waypoints.map((waypoint, index) => ({
            coordinates: [waypoint.latitude, waypoint.longitude, waypoint.altitude],
            pointName: index === 0 ? 'takeoff' : 'waypoint',
            frame: 3,
            delay: waypoint.delay || 0,
            speed: waypoint.speed || 0,
            wpRadius: 3,
            cameraAction: waypoint.camera_actions || 0
          })),
          location: mission.mission_location,
          service_type: mission.mission_type,
          drone_id: mission.drone_id,
          tenant_id: mission.user_id,
          mission_id: mission.mission_id,
          mission_distance: mission.mission_distance,
          mission_name: mission.mission_location,
          mission_description: mission.mission_description,
          mission_start_time: mission.mission_start_time,
          mission_end_time: mission.mission_end_time
      };

      res.status(200).json(missionDetails);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}

const deleteConfigurationForMission = async(req, res, next) => {
  const missionId = req.query.missionId;

  try {
      // Delete notifications for the given mission ID
      await TrackingConfig.deleteMany({ mission_id: missionId });

      res.status(200).json({ success: true, message: 'Notifications deleted successfully.' });
  } catch (error) {
      console.error('Error deleting notifications:', error);
      res.status(500).json({ success: false, error: 'Failed to delete notifications.' });
  }
}
  
module.exports={
  addMission,
  CountMissions,
  getMissions,
  getTelemetry,
  getlineCoordsForMission,
  getMissionsFromDroneID,
  getOneMission,
  configureTracking,
  getAllMissionsForGivenUser,
  getConfiguredTracking,
  deleteOneMission,
  fetchMissionDetails,
  deleteConfigurationForMission
};