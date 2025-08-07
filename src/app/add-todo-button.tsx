"use client"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { createTodo, saveTodoImagesUrl } from "./actions";
import TodoForm from "../components/todo-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { todoSchema } from "@/lib/validation/todoSchema";
import { useRef } from "react";
import { uploadFiles } from "@/lib/firebase-storage-utils";
import { toast } from "sonner";

export default function AddTodoButton() {
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(data: z.infer<typeof todoSchema>) {
    const { images, ...rest } = data;

    try {
      // Save todo to database. Returns created todo id
      const createTodoResponse = await createTodo(rest);

      // Upload files to firebase storage. Returns uploaded file urls
      const uploadImagesResponse = await uploadFiles(createTodoResponse.id, 'todos', images);

      // Save todo images url to database
      await saveTodoImagesUrl(createTodoResponse.id, uploadImagesResponse.urls);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }

    toast.success("Success!", {
      description: "Todo added",
    });
    closeRef.current?.click();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Todo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Todo</DialogTitle>
            <DialogDescription>
              Fill out the fields below to create a new todo.
            </DialogDescription>
          </DialogHeader>
          <TodoForm handleSubmit={handleSubmit} />
          <DialogClose ref={closeRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}