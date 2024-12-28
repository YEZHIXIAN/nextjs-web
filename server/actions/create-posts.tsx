'use server'

import {db} from "@/server";
import {posts} from "@/server/schema";

export default async function getPosts(formData: FormData)  {
  console.log(formData)
  const title = formData.get('title')?.toString()
  if (title) {
    await db.insert(posts).values({
      title,
    })
  }
}

