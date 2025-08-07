"use server";

import { db } from "@/db/db";
import { todos } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq, InferInsertModel } from "drizzle-orm";
import z from "zod";
import { todoDataSchema } from "@/lib/validation/todoSchema";

type UpdateTodoFields = Pick<InferInsertModel<typeof todos>, "title" | "description" | "images">;
type CreateTodoFields = Pick<InferInsertModel<typeof todos>, "title" | "description">;

export const createTodo = async (data: CreateTodoFields) => {
  const validation = todoDataSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  }

  const { title, description } = data;
  const [insertedTodo] = await db
    .insert(todos)
    .values({ title, description, images: [] })
    .returning();

  return {
    id: insertedTodo.id
  };
}

export const saveTodoImagesUrl = async (id: number, urls: string[]) => {
  const schema = z.object({
    id: z.number(),
    urls: z.array(z.string()),
  });

  // Check if data is of correct type
  const validation = schema.safeParse({ id, urls });
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  };

  // Save images urls to the database
  await db
    .update(todos)
    .set({ images: urls })
    .where(eq(todos.id, id));

  revalidatePath('/');
}

export const getTodos = async () => {
  return await db.select().from(todos).orderBy(desc(todos.updatedAt));
}

export const updateTodo = async (data: UpdateTodoFields, id: number) => {
  const validation = todoDataSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message ?? "An error has occured");
  }

  const { title, description, images } = data;
  await db.update(todos)
    .set({
      title,
      description,
      images,
      updatedAt: new Date(),
    })
    .where(eq(todos.id, id));

  revalidatePath("/");
}

export const deleteTodo = async (id: number) => {
  await db.delete(todos).where(eq(todos.id, id));

  revalidatePath("/");
}

export const toggleTodoCompleted = async (id: number, isCompleted: boolean) => {
  await db
    .update(todos)
    .set({ isCompleted })
    .where(eq(todos.id, id));

  revalidatePath("/");
}