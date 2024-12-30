"use server"

import {db} from "@/server";
import {sendVerificationEmail} from "@/server/actions/email";
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {users} from "@/server/schema";
import {RegisterSchema} from "@/types/register-schema";
import {eq} from "drizzle-orm";
import {createSafeActionClient} from "next-safe-action";

const action = createSafeActionClient()

export const emailRegister = action(
  RegisterSchema,
  async ({email, password, name}) => {

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(email, verificationToken[0].token)
        return {success: "Email confirmation resent!"}
      }
      return {error: "Email already exists"}
    }

    await db.insert(users).values({
      email,
      name,
    })

    const verificationToken = await generateEmailVerificationToken(email)
    await sendVerificationEmail(email, verificationToken[0].token)

    return {success: "Email confirmation sent!"}

  }
)
