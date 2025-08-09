import { z } from "zod";
import { createInsertSchema } from 'drizzle-zod';
import { posts } from '@/db/schema';

export const postDataSchema = z.object({
  title: z.string().min(1, {
    message: "Title must contain a value.",
  }),
  description: z.string().min(1, {
    message: "Description must contain a value.",
  }),
})

export const postImagesSchema = z.object({
  images: z.array(z.union([z.string(), z.instanceof(File)])).min(1, "A minimum of one image is required"),
});

export const postSchema = postDataSchema.and(postImagesSchema);

export const postInsertSchema = createInsertSchema(posts);


