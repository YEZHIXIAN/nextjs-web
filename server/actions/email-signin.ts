'use server'

import {db} from "@/server";
import {sendTwoFactorTokenEmail, sendVerificationEmail} from "@/server/actions/email";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail
} from "@/server/actions/tokens";
import {signIn} from "@/server/auth";
import {twoFactorTokens, users} from "@/server/schema";
import {LoginSchema} from "@/types/login-schema";
import {eq} from "drizzle-orm";
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

        if (existingUser.twoFactorEnabled && existingUser.email) {
          if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

            if (!twoFactorToken) {
              return {error: "Invalid Token"}
            }

            if (twoFactorToken.token !== code) {
              return {error: "Invalid Token"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if (hasExpired) {
              return {error: "Token has expired"}
            }

            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.id, twoFactorToken.id))
          } else {

            const token = await generateTwoFactorToken(existingUser.email)

            if (!token) {
              return {error: "Token not generated"}
            }

            await sendTwoFactorTokenEmail(existingUser.email, token[0].token)
            return {twoFactor: "Two Factor Token sent!"}
          }
        }

        await signIn("credentials", {
          email,
          password,
          redirect: false,
        })


        return {success: "User signed in!"}
      } catch
        (error) {
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
  )
;
