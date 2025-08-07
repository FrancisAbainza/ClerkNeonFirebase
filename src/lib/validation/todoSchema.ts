import { z } from "zod";

export const todoDataSchema = z.object({
  title: z.string().min(1, {
    message: "Title must contain a value.",
  }),
  description: z.string().min(1, {
    message: "Description must contain a value.",
  }),
})

export const todoImagesSchema = z.object({
  images: z.array(z.union([z.string(), z.instanceof(File)])).min(1, "A minimum of one image is required"),
});

export const todoSchema = todoDataSchema.and(todoImagesSchema);