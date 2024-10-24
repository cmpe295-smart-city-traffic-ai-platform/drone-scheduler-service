const Mission=require('../models/missionDetailsModel');
const MissionNotification=require('../models/missionNotificationsModel');

const getNotification = async(req, res, next) => {
    const data = req.body;
    //console.log(data);
    const missionId = data.mission_id;
    const io = req.io;
    try {
        // Fetch mission details from Missions collection
        const mission = await Mission.findOne({ mission_id: missionId });

        if (!mission) {
            return res.status(404).json({ success: false, error: 'Mission not found.' });
        }

        // Extract mission location and type
        const { mission_location, mission_type } = mission;
        
        //console.log(data.timestamp.$date);
        // Parse timestamp to Date object
        const timestamp = new Date(data.timestamp.$date);
        //console.log(timestamp);

        const notifObj = {
            mission_id: missionId,
            message: data.message,
            msg_category: data.msg_category,
            mav_command: data.mav_command,
            msg_severity: data.msg_severity,
            mission_location: mission_location,
            mission_type: mission_type,
            timestamp: timestamp
        };

        // Save notification to missionNotificationsModel collection
        const missionNotification = new MissionNotification(notifObj);

        // Save notification to missionNotificationsModel collection
        await missionNotification.save();

        io.to(missionId).emit('notification', notifObj);

        // Respond with success
        res.status(200).json({ success: true, message: 'Notification saved successfully.' });

    } catch (error) {
        // Handle any errors
        console.error('Error saving notification:', error);
        res.status(500).json({ success: false, error: 'Failed to save notification.' });
    }
}

const getNotificationsForMission = async(req, res, next) => {
    const missionId = req.query.missionId;
    // Fetch a document from the collection
    try{
        const doc = await MissionNotification.find({mission_id: missionId});
        // Modify the desired field in the document
        if (doc) {
            //const result = doc[0].lineCoords;
            res.json(doc);
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

const getRecentNotifications = async(req, res, next) => {
    const userId = req.query.userId;
    try {
        // Fetch mission IDs associated with the user
        const userMissions = await Mission.find({ user_id: userId }).distinct('mission_id');

        // Fetch 10 most recent notifications associated with the user's missions, sorted by timestamp
        const notifications = await MissionNotification.find({ mission_id: { $in: userMissions } })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order
            .limit(10); // Limit to 10 notifications

        if (notifications) {
            res.json(notifications);
        } else {
            console.error('No notifications found');
            res.status(404).json({ error: 'No notifications found' });
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

const deleteNotificationsForMission = async(req, res, next) => {
    const missionId = req.query.missionId;

    try {
        // Delete notifications for the given mission ID
        await MissionNotification.deleteMany({ mission_id: missionId });

        res.status(200).json({ success: true, message: 'Notifications deleted successfully.' });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notifications.' });
    }
}

module.exports={
    getNotification,
    getNotificationsForMission,
    deleteNotificationsForMission,
    getRecentNotifications
};