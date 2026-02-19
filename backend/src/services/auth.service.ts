import { v7 as uuidv7 } from "uuid";
import { createUser, findUserByEmail } from "../db/queries/user.queries";
import type { User } from "../types/user.type";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const registerUser = async (email: string, password: string) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error("User already exists");
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const id = uuidv7();
  const user = await createUser(id, email, passwordHash);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user: User = await findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    throw error;
  }

  const valid = await comparePassword(password, user.password_hash);

  if (!valid) {
    const error = new Error("Invalid email or password");
    throw error;
  }

  const token = generateToken(user.id);

  return {
    token,
    user: { id: user.id, email: user.email },
  };
};
