import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Root (browser / health check — API lives under /api)
app.get("/", (_req, res) => {
  res.json({
    service: "Eventify API",
    auth: "/api/auth",
    hint: "Open the app at your Vite dev URL (e.g. http://localhost:5173), not this port, unless you only need the API."
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = Number(process.env.PORT) || 5000;

httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use (another Node/backend instance?). Close it or change PORT in .env. On Windows: netstat -ano | findstr ":${PORT}" then taskkill /PID <pid> /F`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
