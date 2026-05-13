import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db, { createAuditLog } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import { loginSchema, refreshSchema, registerSchema, roleUpdateSchema } from "../validation/authSchemas.js";

const router = Router();
const accessSecret = process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production";

function getIp(req) {
  return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress || null;
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, accessSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
  });
}

function getRefreshExpiryDate() {
  const days = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

function signRefreshToken(user) {
  const expiresAt = getRefreshExpiryDate();
  const token = jwt.sign({ sub: user.id, role: user.role, type: "refresh" }, refreshSecret, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7}d`
  });

  db.prepare(
    `INSERT INTO refresh_tokens (user_id, token, expires_at, revoked_at)
     VALUES (?, ?, ?, NULL)`
  ).run(user.id, token, expiresAt.toISOString());

  return token;
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Input i pavlefshem.", errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email ekziston." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const insert = db.prepare(
    `INSERT INTO users (email, password_hash, role)
     VALUES (?, ?, 'User')`
  );
  const result = insert.run(email, passwordHash);
  const userId = result.lastInsertRowid;
  const user = db.prepare("SELECT id, email, role FROM users WHERE id = ?").get(userId);

  createAuditLog({
    userId: user.id,
    action: "USER_REGISTER",
    target: `users:${user.id}`,
    metadata: { email: user.email },
    ipAddress: getIp(req)
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return res.status(201).json({ user, accessToken, refreshToken });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Input i pavlefshem.", errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  const userRow = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!userRow) {
    return res.status(401).json({ message: "Email ose password gabim." });
  }

  const valid = await bcrypt.compare(password, userRow.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Email ose password gabim." });
  }

  const user = { id: userRow.id, email: userRow.email, role: userRow.role };
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  createAuditLog({
    userId: user.id,
    action: "USER_LOGIN",
    target: `users:${user.id}`,
    ipAddress: getIp(req)
  });

  return res.json({ user, accessToken, refreshToken });
});

router.post("/refresh", (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Input i pavlefshem.", errors: parsed.error.issues });
  }

  const { refreshToken } = parsed.data;
  const savedToken = db
    .prepare(
      `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at, u.email, u.role
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token = ?`
    )
    .get(refreshToken);

  if (!savedToken || savedToken.revoked_at) {
    return res.status(401).json({ message: "Refresh token i pavlefshem." });
  }

  const expiresAt = new Date(savedToken.expires_at);
  if (expiresAt < new Date()) {
    return res.status(401).json({ message: "Refresh token i skaduar." });
  }

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch {
    return res.status(401).json({ message: "Refresh token i pavlefshem." });
  }

  const user = { id: savedToken.user_id, email: savedToken.email, role: savedToken.role };
  const accessToken = signAccessToken(user);
  return res.json({ accessToken });
});

router.post("/logout", requireAuth, (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Input i pavlefshem.", errors: parsed.error.issues });
  }

  const { refreshToken } = parsed.data;
  db.prepare(
    `UPDATE refresh_tokens
     SET revoked_at = CURRENT_TIMESTAMP
     WHERE token = ? AND user_id = ? AND revoked_at IS NULL`
  ).run(refreshToken, req.user.id);

  createAuditLog({
    userId: req.user.id,
    action: "USER_LOGOUT",
    target: `users:${req.user.id}`,
    ipAddress: getIp(req)
  });

  return res.json({ message: "Logout me sukses." });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

router.patch("/users/:id/role", requireAuth, requireRole("Admin"), (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID e pavlefshme." });
  }

  const parsed = roleUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Input i pavlefshem.", errors: parsed.error.issues });
  }
  const { role } = parsed.data;

  const user = db.prepare("SELECT id, email, role FROM users WHERE id = ?").get(id);
  if (!user) {
    return res.status(404).json({ message: "Perdoruesi nuk u gjet." });
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);

  createAuditLog({
    userId: req.user.id,
    action: "USER_ROLE_CHANGED",
    target: `users:${id}`,
    metadata: { from: user.role, to: role },
    ipAddress: getIp(req)
  });

  return res.json({ message: "Roli u perditesua." });
});

router.get("/admin/audit-logs", requireAuth, requireRole("Admin"), (req, res) => {
  const logs = db
    .prepare(
      `SELECT id, user_id, action, target, metadata, ip_address, created_at
       FROM audit_logs
       ORDER BY id DESC
       LIMIT 200`
    )
    .all();

  const parsedLogs = logs.map((log) => ({
    ...log,
    metadata: log.metadata ? JSON.parse(log.metadata) : null
  }));

  return res.json({ logs: parsedLogs });
});

export default router;
