"use server"

import {db} from "@/server";
import {emailTokens} from "@/server/schema";
import {eq} from "drizzle-orm";

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID()
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60)
  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.email, email))
  }

  return db
    .insert(emailTokens)
    .values({
    email,
    token,
    expires,
  }).returning()
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email)
    })
  } catch (e) {
    return null
  }
}
