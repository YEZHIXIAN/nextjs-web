'use server'

import {db} from "@/server";
import {sendVerificationEmail} from "@/server/actions/email";
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {signIn} from "@/server/auth";
import {users} from "@/server/schema";
import {LoginSchema} from "@/types/login-schema";
import { eq } from "drizzle-orm";
import {AuthError} from "next-auth";
import {createSafeActionClient} from "next-safe-action";

const action = createSafeActionClient();

export const emailSignIn = action(
  LoginSchema,
  async ({email, password, code}) => {

    try {
      console.log(email, password, code)

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (existingUser?.email !== email) {
        return {error: "Email not found"}
      }
      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(email, verificationToken[0].token)
        return {success: "Confirmation email sent!"}
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      })

      return {success: "User signed in!"}
    } catch (error) {
      console.log(error)
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {error: "Email or password is incorrect"}
          case "AccessDenied":
            return {error: error.message}
          case "OAuthSignInError":
            return {error: error.message}
          default:
            return {error: "An error occurred"}
        }
      }
      throw error
    }
  }
);
