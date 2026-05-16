import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Socket.IO + Redis Adapter connected");
      })
      .catch((err) => {
        console.warn("⚠️ Redis unavailable; Socket.IO running without adapter:", err.message);
      });
  } else {
    console.log("ℹ️ REDIS_URL not set; Socket.IO running without Redis adapter");
  }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinEventRoom", (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`User joined event room: ${eventId}`);
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
