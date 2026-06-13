import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;
    
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));

// Allowed origins: local dev defaults plus any comma-separated values from CLIENT_URL
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(o => o.trim()) : [])
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin / non-browser requests (no origin header) and whitelisted origins
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
}));


// Routes setup
app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/test", (req, res)=> res.json({success: true, message: "Backend is working!"}));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)


// Connect to MongoDB
await connectDB();

// Start an HTTP listener everywhere except Vercel's serverless runtime, which
// invokes the exported handler instead of a long-lived listening process.
if(!process.env.VERCEL){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ()=> console.log("Server is running on PORT: " + PORT));
}

// Export server for Vercel
export default server;
