const express=require("express");
const dotenv=require("dotenv");
const connectDb=require("./config/db");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const router=require('./routes');
const http = require('http');
const socketIo = require('socket.io');
const { log } = require("console");
const path = require('path');
const morgan = require('morgan');

dotenv.config();
const app=express();

// log requests
app.use(morgan());

// serve frontend drone scheduler service
app.use(express.static(path.join(__dirname, '/../build')));

const server = http.createServer(app);
const isDev = process.env.NODE_ENV !== 'production';
console.log(isDev);
// const corsOptions = {
//   // origin: 'https://dronecloud.saitejagoruganthu.com',
//   origin: isDev ? 'http://localhost:3000' : 'https://dronecloud.saitejagoruganthu.com',
//   credentials: true,
// };

const corsOptions = {
  origin: true,
  credentials: true,
};

// const io = socketIo(server, {
//   cors: {
//     // origin: "https://dronecloud.saitejagoruganthu.com"
//     origin: isDev ? 'http://localhost:3000' : 'https://dronecloud.saitejagoruganthu.com',
//   }
// });

const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true, // Enable credentials (e.g., cookies, headers)
  },
});


app.use(cors(corsOptions));

console.log(path.join(__dirname, '/../build'))


// CORS middleware for socket.io
// io.use((socket, next) => {
//   // You can customize the origin check based on your requirements
//   const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed
//   const origin = socket.handshake.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     return next();
//   }
//   // If the origin is not allowed, return an error
//   return next(new Error('Origin not allowed by CORS'));
// });

// Socket.io connection
io.on('connection', (socket) => {
  // console.log('Client connected: ' + socket.id);

  socket.on('joinMission', (mission_id) => {
    socket.join(mission_id);
  })

  socket.on('leaveMission', (mission_id) => {
    socket.leave(mission_id);
  })
});

// Middleware to pass socket.io instance to routes
app.use((req, res, next) => {
  req.io = io; // Pass the socket.io instance to the request object
  next(); // Proceed to the next middleware or route handler
});

app.use(express.json());
app.use(cookieParser());

connectDb();

app.use('/api/v1/droneScheduler',router);
app.use('/api/v1/droneScheduler/upload', require('./controllers/upload'));
app.use('/api/v1/droneScheduler/videoList', require('./controllers/videoList'));
app.use('/api/v1/droneScheduler/videos', express.static('media/uploads'));
// app.get("/",(req,res)=>{
//     res.send("API running");
// })


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

const PORT= process.env.PORT || 5001;

server.listen(PORT,console.log(`Server running on ${PORT}`))