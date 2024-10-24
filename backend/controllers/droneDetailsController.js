const Drone=require('../models/droneDetailsModel');
const Mission=require('../models/missionDetailsModel');

const countDrones=async(req,res,next)=>{
  let dronescount;
  try{
    dronescount= await Drone.count({});
    // console.log("Count of drones:",dronescount);
  }
  catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving Drones." });
    }
    return res.status(200).json(dronescount);
}

const getAllDrones=async(req,res,next)=>{
    try{
      Drone.find({}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(Drones => {
          //console.log(Drones);
          res.json(Drones);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error retrieving Drones." });
        });
    } catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving Drones." });
    }
  }

  const getServiceTypesForAllDrones=async(req,res,next)=>{
    try {
      const drones = await Drone.find({}); // Find all drones

      // Create an object to store drone service types
      const droneServiceTypes = {};

      // Iterate over each drone and collect its service types
      drones.forEach(drone => {
          const { drone_id, service_types } = drone;
          droneServiceTypes[drone_id] = service_types;
      });

      // Construct the output array in the desired format
      const output = Object.entries(droneServiceTypes).map(([droneId, serviceTypes]) => ({
          Drone_id: droneId,
          Drone_service_type: serviceTypes
      }));

      res.json(output); // Send the output array
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving service types for drones." });
    }
  }

  const getOneDrone=async(req,res,next)=>{
    //console.log(req.params);
    const droneId = req.params.drone_id;
    try{
      //console.log(droneId);
      Drone.find({drone_id: droneId}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(Drone => {
          //console.log(Drone);
          res.json(Drone);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error retrieving Drone." });
        });
    } catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving Drone." });
    }
  }

  const getDronesDataForMap = async (req, res) => {
    try {
      // Fetch drones from database
      const drones = await Drone.find().lean();
  
      // Fetch missions from database
      const missions = await Mission.find().lean();

      //console.log(missions);
  
      // Merge drones with their corresponding missions
      const dronesWithMissions = drones.map(drone => {
        const mission = missions.find(mission => mission.drone_id === drone.drone_id && mission.mission_status === "In_Progress");
        return {
          drone_id: drone.drone_id,
          name: drone.name,
          last_known_status: drone.last_known_status,
          last_known_lat: drone.last_known_lat,
          last_known_long: drone.last_known_long,
          mission_id: mission ? mission.mission_id : 'No Mission Assigned',
          mission_type: mission ? mission.mission_type : 'No Mission Assigned',
          mission_location: mission ? mission.mission_location : 'No Mission Assigned',
          mission_status: mission ? mission.mission_status : 'No Mission Assigned'
        };
      });
  
      res.json(dronesWithMissions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const getAllDronesPerUserForMap = async (req, res) => {
    const userId = req.query.userId;

    try {
      // Fetch drones from database
      const drones = await Drone.find().lean();
  
      // Fetch all missions for given user from database
      const missions = await Mission.find({user_id: userId}).lean();

      //console.log(missions);

      // Create a Set to store unique drone IDs
      const uniqueDroneIds = new Set();

      // Iterate through missions to collect unique drone IDs
      missions.forEach(mission => {
          uniqueDroneIds.add(mission.drone_id);
      });

      const userDrones = [];
      uniqueDroneIds.forEach(droneId => {
        const drone = drones.find(drone => drone.drone_id === droneId);
        if(drone)
        {
          userDrones.push({
            drone_id: drone.drone_id,
            name: drone.name,
            last_known_status: drone.last_known_status,
            last_known_lat: drone.last_known_lat,
            last_known_long: drone.last_known_long
          })
        }
      });
  
      // Send the combined data as the response
      res.json(userDrones);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports={getAllDrones,countDrones, getOneDrone, getDronesDataForMap, getAllDronesPerUserForMap, getServiceTypesForAllDrones};