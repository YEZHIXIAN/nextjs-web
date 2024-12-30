'use server'

import {db} from "@/server";
import {users} from "@/server/schema";
import {RegisterForm} from "@/types/login-schema";
import { eq } from "drizzle-orm";
import {createSafeActionClient} from "next-safe-action";

const action = createSafeActionClient();

export const emailSignIn = action(
  RegisterForm,
  async ({email, password, code}) => {
    console.log(email, password, code)

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser?.email !== email) {
      return {error: "Email not found"}
    }
    /*if (!existingUser.emailVerified) {

    }*/

    return {success: email}
  }
);
