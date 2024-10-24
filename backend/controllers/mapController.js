const mapModel = require('../models/mapModel');

// create Map/Location entry to db
exports.uploadMap = async (req, res) => {
    const data = new mapModel({
        TenantId: req.body.TenantId,
        Name: req.body.Name,
        Address: req.body.Address,
        Lat: req.body.Lat,
        Long: req.body.Long
    })
    try {
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Received POST request : add Map to database");
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully executed POST : added new map to database");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to add map to database");
        res.status(400).json({message: error.message});
    }
}


// fetch all maps/Locations
exports.getAllMaps = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received GET request : fetching all maps");
        const data = await mapModel.find(
            {TenantId: req.params.TenantId}
        );
        res.json(data);
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully executed GET for all maps");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute GET for all maps for user");
        res.status(500).json({message: error.message});
    }
}


// fetch map by Name
exports.getMapByName = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Received GET request : fetching map for Name: " + req.body.Name);
        const data = await mapModel.find(
            {Name: req.body.Name, TenantId: req.body.TenantId}
        );
        res.json(data);
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully executed GET request : fetched map for Name: " + req.body.Name);
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to execute GET for map Name: " + req.body.Name);
        res.status(500).json({message: error.message});
    }
}


// get map long and lat by name
exports.getMapLatLong = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Recieved GET request : fetching lat and long for Name: " + req.body.Name);
        const data = await mapModel.find(
            {Name: req.body.Name, TenantId: req.body.TenantId}
        );
        const latLong = data.map(({Lat, Long}) => ({Lat, Long}));
        res.json(latLong);
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully executed GET for map lat and long");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to execute GET lat and long for map: " + req.body.Name);
        res.status(500).json({message: error.message});
    }
}


// get map by Address



// delete map by name
exports.deleteMapByName = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Received DELETE request : deleting map " + req.body.Name);
        const data = await mapModel.findOneAndDelete(
            {Name: req.body.Name, TenantId: req.body.TenantId} 
        );
        res.status(200).json({message: "[INFO] TenantID = " + req.body.TenantId + " | Deleted map " + req.body.Name});
        console.log("[INFO] TenantID = " + req.body.TenantId + " | Successfully deleted Map: " + req.body.Name);
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.body.TenantId + " | Failed to execute DELETE for map " + req.body.Name);
        res.status(500).json({message: error.message});
    }
}


// delete all map entries
exports.deleteAllMaps = async (req, res) => {
    try {
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Received DELETE request : deleting all maps");
        const data = await mapModel.deleteMany(
            {TenantId: req.params.TenantId}
        );
        res.status(200).json({message: "[INFO] TenantID = " + req.params.TenantId + " | Deleted all maps"})
        console.log("[INFO] TenantID = " + req.params.TenantId + " | Successfully deleted all maps");
    }
    catch(error) {
        console.log("[ERROR] TenantID = " + req.params.TenantId + " | Failed to execute DELETE for all maps");
        res.status(500).json({message: error.message});
    }
}