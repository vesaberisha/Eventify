import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io;

const frontendOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: frontendOrigin },
  });

  const pubClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log("✅ Redis + Socket.IO Adapter initialized");
    })
    .catch((err) => {
      console.warn(
        "⚠️ Redis unavailable — Socket.IO running without adapter:",
        err.message
      );
    });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinUserRoom", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("joinEventRoom", (eventId) => {
      socket.join(`event-${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user-${userId}`).emit("notification", notification);
  }
};
