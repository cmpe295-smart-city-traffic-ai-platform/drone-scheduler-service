const Drone=require('../models/droneModel');
const DroneDetails=require('../models/droneDetailsModel');
const User=require('../models/userModel');
const Mission=require('../models/missionDetailsModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
  

const createDrone=async(req,res,next)=>{
    const {drone_id,name,manufacturer,model_number,price}=req.body;
    console.log(drone_id,name,manufacturer,model_number,price);
    let existingDrone;
    try{
        existingDrone=await Drone.findOne({drone_id:drone_id});
        console.log(existingDrone);
    }catch(err){
        console.log(err);
    }
    if(existingDrone){
        console.log("Drone already exists");
        return res.status(400).json({message:"Drone already exists"});
    }
    const drone= new Drone({
        drone_id,
        name,
        manufacturer,
        model_number,
        price,
    });
    console.log("Adding Drone");

    try{
        await drone.save();
        console.log("saved");
    }catch (err){
        console.log(err);
    }

    return res.status(201).json({message:Drone});
}

const CountDrones=async(req,res,next)=>{
  let dronescount;
  try{
    dronescount= await Drone.count({});
    console.log("Count of drones:",dronescount);
  }
  catch(err){
      console.log(err);
      res.status(500).json({ message: "Error retrieving Drones." });
    }
    return res.status(200).json(dronescount);
}

const ViewDrone=async(req,res,next)=>{
    try{
      Drone.find({}) // pass the query object with the search criteria
        .exec() // execute the query
        .then(Drones => {
          console.log(Drones);
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

  const deleteDrone = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
      const drone = await Drone.findOneAndDelete({ drone_id: id });
      if (!drone) {
        console.log("Drone not found");
        res.status(404).json({ message: "Drone not found" });
      } else {
        console.log("Drone deleted successfully");
        res.status(200).json({ message: "Drone deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting drone:", error);
      res.status(500).json({ message: "Error deleting drone" });
    }
  };
  
  const editDrone = async (req, res, next) => {
    const { id } = req.params;
    const { drone_id, name, manufacturer, model_number, price, schedule_id } = req.body;
  
    try {
      const drone = await Drone.findOne({ drone_id: id });
      if (!drone) {
        res.status(404).json({ message: "Drone not found" });
      } else {
        drone.drone_id = drone_id || drone.drone_id;
        drone.name = name || drone.name;
        drone.manufacturer = manufacturer || drone.manufacturer;
        drone.model_number = model_number || drone.model_number;
        drone.price = price || drone.price;
        drone.schedule_id = schedule_id || drone.schedule_id;
  
        await drone.save();
        res.status(200).json({ message: "Drone updated successfully", drone });
      }
    } catch (error) {
      console.error("Error editing drone:", error);
      res.status(500).json({ message: "Error editing drone" });
    }
  };
  
  const ViewDroneIdList=async(req,res,next)=>{
    try {
        Drone.find({})
          .exec()
          .then((drones) => {
            const droneIds = drones.map((drone) => ({
              value: drone.drone_id,
              label: `Drone ${drone.drone_id}`,
            }));
            console.log(droneIds);
            res.json(droneIds);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error retrieving drone IDs." });
          });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving drone IDs." });
      }
  }
  
  
const verifyToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    console.log("Cookie:",cookies);
    const token=cookies.split('=')[1];
    // const headers=req.headers["authorization"];
    // console.log("Headers:",headers);
    // const token=headers.split(" ")[1];
    if(!token){
        return res.status(400).json({message:'Token not found'})
    }
    jwt.verify(String(token),"shakshi",(err,drone)=>{
        if(err){
            return res.status(400).json({message:"Invalid token"})
        }
        console.log("Drone Id:",drone.id);
        req.id=drone.id;
    })
    next();
}

const getDrone=async(req,res,next)=>{
    const droneId=req.id;
    let drone;
    try{
        drone=await Drone.findById(droneId,"-password");
    }catch(err){
        return new Error(err);
    }
    if(!drone){
        return res.status(400).json({message:"Drone not found"})
    }
    return res.status(200).json({drone});
}

const getDronesForMap=async(req,res,next)=>{
  const {uuid,role}=req.body;
  console.log(uuid,role);
  let email = '';
  let results = [];
  let drone_ids = [];

  if (role === 'client') {
    // Get all active drones for client
    try {
      let drones=await DroneDetails.find();

      for (let i=0; i < drones.length; i++) {
        if (drones[i]?.last_known_status === 'Active') {
          const result = {
            drone_id:drones[i]?.drone_id ?? null,
            drone_status:drones[i]?.last_known_status,
            drone_name:drones[i]?.name ?? null,
            location:getRandomSouthBayLandCoordinates(),
          }
          results.push(result);
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({message:"Error while getting drone name and status"});
    }

    // return result
    return res.status(200).json(results);
  } else if (role === 'agent') {
    // Using uuid get unqiue email from users model
    try {
      let user=await User.findOne({uuid:uuid});
      email = user.email;
      result.email = email;
    } catch (e) {
      console.log(e);
      return res.status(400).json({message:"Error While Getting Email"});
    }

    // From unqiue email get drone id, drone name, and status from mission model
    try {
      let missions=await Mission.find({user_id:email});

      for (let i=0; i<missions.length; i++) {
        if (!drone_ids.includes(missions[i].drone_id)) {
          // capture drone ids
          drone_ids.push(missions[i].drone_id);

          // add drone ids and location to results
          results.push({
            drone_id: missions[i]?.drone_id,
            location: getRandomSouthBayLandCoordinates(),
          });
        } 
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({message:"Error while getting drone ids"});
    }

    // get drone name and status from drone table using drone id
    try {
      for (let i=0; i<drone_ids.length; i++) {
        // get drone by id
        console.log(drone_ids[i]);
        let drone=await DroneDetails.findOne({drone_id:drone_ids[i]});
        console.log('drone:', drone);
        console.log('results:', results[i])

        // add drone name and status to results
        results[i].drone_name = drone?.name ?? null;
        results[i].drone_status = drone?.last_known_status ?? null;
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({message:"Error while getting drone name and status"});
    }

    // return result
    return res.status(200).json(results);

  } else {
    return res.status(400).json({message:"Invalid role: " + role});
  }
}

const getRandomSouthBayLandCoordinates = () => {
  // Approximate bounding box for Palo Alto, San Jose, and Fremont area
  const minLat = 37.2;   // South around San Jose
  const maxLat = 37.5;   // North near Palo Alto
  const minLng = -122.2; // West near the coast and Highway 280
  const maxLng = -121.8; // East near Fremont

  const generatePoint = () => {
      const lat = Math.random() * (maxLat - minLat) + minLat;
      const lng = Math.random() * (maxLng - minLng) + minLng;
      return [lat, lng];
  };

  const isInHighwayArea = ([lat, lng]) => {
      // Rough boundaries to keep points within the area surrounded by highways 280, 237, 101, 85, and 87

      // Exclude points that fall outside the rough highway boundary area
      if (lng < -122.1 || lng > -121.85) return false; // West of 280 or East of Fremont
      if (lat > 37.5 || lat < 37.2) return false;      // North of Palo Alto or South of San Jose

      return true;
  };

  const isOnLand = ([lat, lng]) => {
      // Further filter points to avoid areas likely to be in the Bay
      if (lat < 37.4 && lng < -122.05) return false; // Exclude areas near the Bay in Palo Alto and Mountain View
      if (lat < 37.3 && lng < -122.0) return false;  // Exclude southeastern Bay near San Jose
      
      return true;
  };

  let point;
  do {
      point = generatePoint();
  } while (!isInHighwayArea(point) || !isOnLand(point));

  // Format the result as requested
  return `${point[0].toFixed(6)},${point[1].toFixed(6)}`;
}

// Example usage
console.log(getRandomSouthBayLandCoordinates());


module.exports={createDrone,ViewDrone,deleteDrone,editDrone,ViewDroneIdList,verifyToken,getDrone,CountDrones,getDronesForMap};