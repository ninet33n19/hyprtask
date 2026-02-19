import { pool } from "../pool";

export const createUser = async (
  id: string,
  email: string,
  passwordHash: string,
) => {
  const result = await pool.query(
    `
    INSERT INTO users (id, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, created_at
    `,
    [id, email, passwordHash],
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT id, email, created_at FROM users
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};
