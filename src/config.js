// export const BASE_URL = "https://dronecloudbackend.adaptable.app";
export const BASE_URL = "http://localhost:5001";
export const API_ENDPOINTS = {

    //mission-menu-manager.js
    createUpdateMissionPlan: "/api/v1/droneScheduler/createMissionPlanNew",
    //cesium.js, modifyMission/index.jsx
    getOneMissionForPlanner: "/api/v1/droneScheduler/getonemissionforplanner",
    //LoginPage.js
    getUserProfile: "/api/v1/droneScheduler/getuserProfile",
    login: "/api/v1/droneScheduler/login",
    //MapBoxDynamic.jsx
    getLineCoordsForMission: "/api/v1/droneScheduler/getlinecoordsformission",
    //MissionDetailsCard.jsx
    getMissionsForUser: "/api/v1/droneScheduler/getmissionsforuser",
    //addMap/index.jsx, addMap2/index.jsx
    addMap: "/api/v1/droneScheduler/addMap",
    //createDrone/index.jsx
    addDrone: "/api/v1/droneScheduler/adddrone",
    //createMission/index.jsx, modifyMission/index.jsx
    getServiceTypesForAllDrones: "/api/v1/droneScheduler/getservicetypesforalldrones1",
    //createMission2/index.jsx, deleteMapByName/index.jsx
    getAllMaps: "/api/v1/droneScheduler/getAllMaps",
    createMissionPlan: "/api/v1/droneScheduler/createMissionPlan",
    //createSchedule/index.jsx
    fetchMissionOptions: "/api/v1/droneScheduler/missionOptions",
    fetchDroneOptions: "/api/v1/droneScheduler/droneOptions",
    addSchedule: "/api/v1/droneScheduler/addschedule",
    //dashboard/index.jsx
    countDrones: "/api/v1/droneScheduler/countdrones",
    countUsers: "/api/v1/droneScheduler/countusers",
    countMissions: "/api/v1/droneScheduler/countmissions",
    getAllMissionPlans: "/api/v1/droneScheduler/getAllMissionPlans",
    //deleteAllMaps/index.jsx
    deleteAllMaps: "/api/v1/droneScheduler/deleteAllMaps",
    //deleteAllMissions/index.jsx
    deleteAllMissionPlans: "/api/v1/droneScheduler/deleteAllMissionPlans",
    //deleteMapByName/index.jsx
    deleteMapByName: "/api/v1/droneScheduler/deleteMapByName",
    //deleteMissionById/index.jsx
    deleteMissionPlanById: "/api/v1/droneScheduler/deleteMissionPlanById",
    //EditDrone/index.jsx
    getDrones: "/api/v1/droneScheduler/drones",
    //EditSchedule/index.jsx
    getSchedules: "/api/v1/droneScheduler/schedules",
    //missionDashboard/index.jsx
    getAllMissionsForGivenUser: "/api/v1/droneScheduler/getallmissionsforgivenuser",
    //trackingConfiguration/index.jsx
    configureTracking: "/api/v1/droneScheduler/configuretracking",
    getConfiguredTracking: "/api/v1/droneScheduler/getconfiguredtracking",
    //trackingDashboard/index.jsx
    getAllDronesPerUserForMap: "/api/v1/droneScheduler/getalldronesperuserformap",
    getRecentNotifications : "/api/v1/droneScheduler/getrecentnotifications",
    //trackingDrone/index.jsx
    getOneDrone: "/api/v1/droneScheduler/getonedrone1",
    getOneMission: "/api/v1/droneScheduler/getonemission1",
    getNotificationsForMission: "/api/v1/droneScheduler/getnotificationsformission",
    //VideoDashboard.js, VideoDashboard2.js
    videoList: "/api/v1/droneScheduler/videoList",
    getVideos: "/api/v1/droneScheduler/videos",
    //VideoUpload.js
    videoUpload: "/api/v1/droneScheduler/upload",
    //viewDrone/index.jsx
    getAllDrones: "/api/v1/droneScheduler/getalldrones1",
    //viewDrone2/index.jsx
    viewDrone : "/api/v1/droneScheduler/viewdrone",
    //viewMissions/index.jsx
    deleteMissionForUser: "/api/v1/droneScheduler/deletemissionforuser",
    deleteConfigurationForMission: "/api/v1/droneScheduler/deleteconfigurationformission",
    deleteNotificationsForMission: "/api/v1/droneScheduler/deletenotificationsformission",
    //viewSchedules/index.jsx
    viewSchedules: "/api/v1/droneScheduler/viewschedule",
    //RegisterPage.js
    signUp: "/api/v1/droneScheduler/signup",
  // Add more API endpoints here as needed
};
