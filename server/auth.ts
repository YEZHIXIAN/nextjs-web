import {users} from "@/server/schema";
import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import {eq} from "drizzle-orm";
import NextAuth from "next-auth"
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import {db} from "@/server"
import {LoginSchema} from "@/types/login-schema"
import bcrypt from "bcrypt"

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {strategy: "jwt"},
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const {email, password} = validatedFields.data
          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          })

          if (!user || !user.password) {
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) {
            return user
          }
        }
        return null
      }
    })
  ],
})
