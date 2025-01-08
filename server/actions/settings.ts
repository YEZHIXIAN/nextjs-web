"use server"


import {db} from "@/server";
import {auth} from "@/server/auth";
import {users} from "@/server/schema";
import {SettingsSchema} from "@/types/settings-schema";
import bcrypt from "bcrypt";
import {eq} from "drizzle-orm";
import {createSafeActionClient} from "next-safe-action";
import {revalidatePath} from "next/cache";

const action = createSafeActionClient()

export const settings = action(SettingsSchema, async(values) => {
  const user = await auth()
  if (!user) {
    return {error: "User not found"}
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id)
  })

  if (!dbUser) {
    return {error: "User not found"}
  }

  if (user.user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
    if (!passwordMatch) {
      return {error: "Password does not match"}
    }

    if (values.password === values.newPassword) {
      return {error: "New password must be different from old password"}
    }

    values.password = await bcrypt.hash(values.newPassword, 10)
    values.newPassword = undefined
  }

  await db.update(users).set({
    name: values.name,
    password: values.password,
    twoFactorEnabled: values.isTwoFactorEnabled,
    email: values.email,
    image: values.image
  }).where(eq(users.id, dbUser.id))

  revalidatePath("/dashboard/settings")
  return {success: "Settings updated"}
})
