import jwt from "jsonwebtoken";
import db from "../db.js";

const accessSecret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Mungon access token." });
  }

  try {
    const payload = jwt.verify(token, accessSecret);
    const user = db
      .prepare("SELECT id, email, role FROM users WHERE id = ?")
      .get(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Perdorues i pavlefshem." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Token i pavlefshem ose i skaduar." });
  }
}
