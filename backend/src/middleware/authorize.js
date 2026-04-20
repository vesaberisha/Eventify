export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Nuk je i autentikuar." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Nuk ke te drejta per kete veprim." });
    }

    return next();
  };
}
