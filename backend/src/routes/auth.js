import { Router } from "express";
import { query } from "../db/pool.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema, refreshSchema, registerSchema } from "../validation.js";
import { sha256 } from "../utils/hash.js";
import { config } from "../config.js";

export const authRouter = Router();

async function issueAuthTokens(userId, email) {
  const accessToken = signAccessToken({ sub: userId, email });
  const refreshToken = signRefreshToken({ sub: userId, email });

  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [userId, sha256(refreshToken)]
  );

  return { accessToken, refreshToken };
}

async function assignRoleByCode(userId, roleCode) {
  await query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, r.id
     FROM roles r
     WHERE r.code = $2
     ON CONFLICT DO NOTHING`,
    [userId, roleCode]
  );
}

async function getUserRoles(userId) {
  const roles = await query(
    `SELECT r.code
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY r.code`,
    [userId]
  );

  return roles.rows.map((r) => r.code);
}

async function syncAdminRoleByEmail(userId, email) {
  const normalized = String(email || "").toLowerCase();
  const shouldBeAdmin = config.adminEmails.includes(normalized);

  if (shouldBeAdmin) {
    await assignRoleByCode(userId, "admin");
  }
}

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password, displayName, country = null } = req.validatedBody;

    const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashed = await hashPassword(password);

    const userInsert = await query(
      `INSERT INTO users (email, password_hash, status)
       VALUES ($1, $2, 'active')
       RETURNING id, email, status, created_at`,
      [email.toLowerCase(), hashed]
    );

    const user = userInsert.rows[0];

    await query(
      `INSERT INTO profiles (user_id, display_name, country)
       VALUES ($1, $2, $3)`,
      [user.id, displayName, country]
    );

    await assignRoleByCode(user.id, "learner");
    await syncAdminRoleByEmail(user.id, user.email);
    const roles = await getUserRoles(user.id);

    const tokens = await issueAuthTokens(user.id, user.email);

    return res.status(201).json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName,
        status: user.status,
        roles,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.status, p.display_name
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await syncAdminRoleByEmail(user.id, user.email);
    const roles = await getUserRoles(user.id);

    const tokens = await issueAuthTokens(user.id, user.email);

    return res.json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        status: user.status,
        roles
      }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/refresh", validateBody(refreshSchema), async (req, res) => {
  try {
    const { refreshToken } = req.validatedBody;
    const payload = verifyRefreshToken(refreshToken);

    const tokenCheck = await query(
      `SELECT id
       FROM refresh_tokens
       WHERE user_id = $1
         AND token_hash = $2
         AND is_revoked = FALSE
         AND expires_at > NOW()
       LIMIT 1`,
      [payload.sub, sha256(refreshToken)]
    );

    if (tokenCheck.rowCount === 0) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const userResult = await query("SELECT id, email FROM users WHERE id = $1", [payload.sub]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await query("UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = $1", [tokenCheck.rows[0].id]);

    const user = userResult.rows[0];
    const tokens = await issueAuthTokens(user.id, user.email);

    return res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

authRouter.post("/logout", validateBody(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.validatedBody;

    await query(
      `UPDATE refresh_tokens
       SET is_revoked = TRUE
       WHERE token_hash = $1`,
      [sha256(refreshToken)]
    );

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.status, u.created_at, p.display_name, p.country
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.sub]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const roles = await getUserRoles(req.user.sub);

    return res.json({ user: { ...result.rows[0], roles } });
  } catch (error) {
    return next(error);
  }
});
