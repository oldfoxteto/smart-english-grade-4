import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, SALT_ROUNDS);
}

export function verifyPassword(rawPassword, hashedPassword) {
  return bcrypt.compare(rawPassword, hashedPassword);
}
