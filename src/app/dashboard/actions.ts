"use server";

import { db } from "@/db/db";
import { posts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { postDataSchema, postInsertSchema } from "../../lib/validation/postSchema";

export const createPost = async (data: z.infer<typeof postDataSchema>) => {
  const validation = postDataSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  }

  const { title, description } = data;
  const [insertedPost] = await db
    .insert(posts)
    .values({ title, description, images: [] })
    .returning();

  return {
    id: insertedPost.id
  };
}

export const savePostImagesPaths = async (id: number, paths: string[]) => {
  const schema = z.object({
    id: z.number(),
    paths: z.array(z.string()),
  });

  // Check if data is of correct type
  const validation = schema.safeParse({ id, paths });
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  };

  // Save images paths to the database
  await db
    .update(posts)
    .set({ images: paths })
    .where(eq(posts.id, id));

  revalidatePath('/');
}

export const getPosts = async () => {
  return await db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export const updatePost = async (data: z.infer<typeof postInsertSchema>, id: number) => {
  const validation = postInsertSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  }

  const { title, description, images } = data;
  await db.update(posts)
    .set({
      title,
      description,
      images,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidatePath("/");
}

export const deletePost = async (id: number) => {
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/");
}