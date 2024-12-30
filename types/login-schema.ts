import * as z from "zod"

export const RegisterForm = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(
    6,
    "Password must be at least 6 characters long"
  ),
  code: z.optional(z.string()),
})
