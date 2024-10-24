const Drone=require('../models/droneModel');
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

module.exports={createDrone,ViewDrone,deleteDrone,editDrone,ViewDroneIdList,verifyToken,getDrone,CountDrones};