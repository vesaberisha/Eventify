import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin nuk lejohet."));
    },
    credentials: true
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err?.message?.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  return res.status(500).json({ message: "Gabim i brendshem ne server." });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Eventify backend running at http://localhost:${port}`);
});
