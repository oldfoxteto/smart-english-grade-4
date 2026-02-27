import { query } from "../db/pool.js";

export function requireRole(roleCode) {
  return async (req, res, next) => {
    try {
      if (!req.user?.sub) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await query(
        `SELECT 1
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         WHERE ur.user_id = $1 AND r.code = $2
         LIMIT 1`,
        [req.user.sub, roleCode]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
