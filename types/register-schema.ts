import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long"
  }),
  name: z.string().min(4, {
    message: "Name must be at least 4 characters long"
  })
})
