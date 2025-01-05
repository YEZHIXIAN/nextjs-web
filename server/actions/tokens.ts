"use server"

import {db} from "@/server";
import {emailTokens, users} from "@/server/schema";
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
  } catch (error) {
    console.log(error)
    return null
  }
}

export const newVerification = async (token: string) => {
  const existingToken = await db.query.emailTokens.findFirst({
    where: eq(emailTokens.token, token)
  })

  if (!existingToken) {
    return {error: "No token found"}
  }
  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return {error: "Token has expired"}
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email)
  })

  if (!existingUser) {
    return {error: "Email does not exist"}
  }

  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email
  })

  await db.delete(emailTokens).where(eq(emailTokens.token, token))

  return {success: "Email verified!"}
}
