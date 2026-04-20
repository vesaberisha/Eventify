import { Router } from "express";
import db from "../db.js";
import { eventSearchSchema } from "../validation/eventSearchSchema.js";

const router = Router();

router.get("/", (req, res) => {
  const parsed = eventSearchSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Query params te pavlefshem.", errors: parsed.error.issues });
  }

  const {
    q,
    category,
    location,
    dateFrom,
    dateTo,
    priceMin,
    priceMax,
    sort = "starts_at",
    order = "asc",
    page = 1,
    limit = 12
  } = parsed.data;

  const where = [];
  const params = [];

  if (q) {
    where.push("(title LIKE ? OR description LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like);
  }
  if (category) {
    where.push("category = ?");
    params.push(category);
  }
  if (location) {
    where.push("location LIKE ?");
    params.push(`%${location}%`);
  }
  if (dateFrom) {
    where.push("starts_at >= ?");
    params.push(dateFrom);
  }
  if (dateTo) {
    where.push("starts_at <= ?");
    params.push(dateTo);
  }
  if (priceMin !== undefined) {
    where.push("price_eur >= ?");
    params.push(priceMin);
  }
  if (priceMax !== undefined) {
    where.push("price_eur <= ?");
    params.push(priceMax);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sortColumn = sort; // already whitelisted by zod enum
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const offset = (page - 1) * limit;

  const total = db
    .prepare(`SELECT COUNT(*) as c FROM events ${whereSql}`)
    .get(...params)?.c;

  const rows = db
    .prepare(
      `SELECT id, title, description, category, location, starts_at, price_eur, image_url
       FROM events
       ${whereSql}
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset);

  return res.json({
    items: rows,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil((total || 0) / limit))
  });
});

export default router;

