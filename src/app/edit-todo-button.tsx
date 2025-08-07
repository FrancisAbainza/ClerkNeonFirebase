"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TodoForm from "../components/todo-form";
import { todoSchema } from "@/lib/validation/todoSchema";
import z from "zod";
import { updateTodo } from "./actions";
import { toast } from "sonner";
import { useRef } from "react";
import { deleteFilesByUrl, uploadFiles } from "@/lib/firebase-storage-utils";
import { InferInsertModel } from "drizzle-orm";
import { todos } from "@/db/schema";

type Props = {
  defaultValues: Pick<InferInsertModel<typeof todos>, "title" | "description" | "images">;
  id: number;
}

export default function EditTodoButton({ defaultValues, id }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (data: z.infer<typeof todoSchema>) => {
    const { images, ...rest } = data;

    try {
      // Upload files to firebase storage. Returns uploaded file urls
      const uploadFilesResponse = await uploadFiles(id, 'todos', images);

      // Update todo in the database
      const updatedTodo = {
        ...rest,
        images: uploadFilesResponse.urls
      }
      await updateTodo(updatedTodo, id);

      // Delete images from firebase storage
      const imagesToDelete = defaultValues.images.filter(
        (image) => (!updatedTodo.images.includes(image))
      );
      if (!!imagesToDelete) {
        await deleteFilesByUrl(imagesToDelete);
      }

    } catch (error: unknown) {
      toast.error((error as Error).message);
    }

    toast.success("Success!", {
      description: "Todo updated",
    });
    closeRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Edit the fields below to edit the todo.
          </DialogDescription>
        </DialogHeader>
        <TodoForm
          handleSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}