import {db} from "@/server"
import {users} from "@/server/schema";
import {accounts} from "@/server/schema";
import {LoginSchema} from "@/types/login-schema"
import Credentials from "@auth/core/providers/credentials";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import bcrypt from "bcrypt"
import {eq} from "drizzle-orm";
import NextAuth from "next-auth"

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {strategy: "jwt"},
  callbacks: {
    async session({session, token}) {
      if (session && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role as string
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.isOAuth = token.isOAuth as boolean
      }

      return session
    },
    async jwt({token}){

      if (!token.sub) {
        return token
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, token.sub)
      })

      if (!user) {
        return token
      }

      token.name = user.name
      token.email = user.email
      token.role = user.role
      token.isTwoFactorEnabled = user.twoFactorEnabled
      token.image = user.image

      token.isOAuth = await db.query.accounts.findFirst({
        where: eq(accounts.userId, user.id)
      })

      return token
    }
  },
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
