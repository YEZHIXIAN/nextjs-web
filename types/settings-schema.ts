import {z} from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  image: z.optional(z.string().url()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
}).refine((data) => {
  return !(data.password && !data.newPassword);

}, {message: "New password is required >_<", path:["newPassword"]})
