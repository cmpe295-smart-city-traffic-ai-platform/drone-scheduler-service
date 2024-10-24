const express=require("express");
const dotenv=require("dotenv");
const connectDb=require("./config/db");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const router=require('./routes');
const http = require('http');
const socketIo = require('socket.io');
const { log } = require("console");

dotenv.config();
const app=express();
const server = http.createServer(app);
const isDev = process.env.NODE_ENV !== 'production';
console.log(isDev);
const corsOptions = {
  // origin: 'https://dronecloud.saitejagoruganthu.com',
  origin: isDev ? 'http://localhost:3000' : 'https://dronecloud.saitejagoruganthu.com',
  credentials: true,
};
const io = socketIo(server, {
  cors: {
    // origin: "https://dronecloud.saitejagoruganthu.com"
    origin: isDev ? 'http://localhost:3000' : 'https://dronecloud.saitejagoruganthu.com',
  }
});

app.use(cors(corsOptions));

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

app.use('/api',router);
app.use('/api/upload', require('./controllers/upload'));
app.use('/api/videoList', require('./controllers/videoList'));
app.use('/api/videos', express.static('media/uploads'));
app.get("/",(req,res)=>{
    res.send("API running");
})

const PORT= process.env.PORT || 5001;

server.listen(PORT,console.log(`Server running on ${PORT}`))