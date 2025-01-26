import { z } from "zod";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,128}$/;

export const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address").toLowerCase(),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(
      passwordPattern,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  profilePicture: z.string().optional().nullable(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string(),
});
