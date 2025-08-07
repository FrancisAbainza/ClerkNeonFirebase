"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { todoSchema } from "@/lib/validation/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";
import { MultiImageUploader } from "./multi-image-uploader";

type Props = {
  handleSubmit: (data: z.infer<typeof todoSchema>) => void,
  defaultValues?: z.infer<typeof todoSchema>,
}

export default function TodoForm({ handleSubmit, defaultValues }: Props) {
  const combinedDefaultValues: z.infer<typeof todoSchema> = {
    title: "",
    description: "",
    images: [],
    ...defaultValues
  }

  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: combinedDefaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Images</FormLabel>
                <MultiImageUploader
                  onImagesChange={field.onChange}
                  images={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </fieldset>
      </form>
    </Form>
  );
}