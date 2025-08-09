"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "../../components/post-form";
import { postSchema } from "@/lib/validation/postSchema";
import z from "zod";
import { updatePost } from "./actions";
import { toast } from "sonner";
import { useRef } from "react";
import { deleteFilesByPath, uploadFiles } from "@/utils/firebase-storage-utils";
import { InferInsertModel } from "drizzle-orm";
import { posts } from "@/db/schema";

type Props = {
  defaultValues: Pick<InferInsertModel<typeof posts>, "title" | "description" | "images">;
  id: number;
}

export default function EditPostButton({ defaultValues, id }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (data: z.infer<typeof postSchema>) => {
    const { images, ...rest } = data;

    try {
      // Upload files to firebase storage. Returns uploaded files paths
      const uploadFilesResponse = await uploadFiles(id, 'posts', images);

      // Update post in the database
      const updatedPost = {
        ...rest,
        images: uploadFilesResponse.paths
      }
      await updatePost(updatedPost, id);

      // Delete images from firebase storage
      const imagesToDelete = defaultValues.images.filter(
        (image) => (!updatedPost.images.includes(image))
      );
      if (!!imagesToDelete) {
        await deleteFilesByPath(imagesToDelete);
      }

    } catch (error: unknown) {
      toast.error((error as Error).message);
    }

    toast.success("Success!", {
      description: "Post updated",
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
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Edit the fields below to edit the post.
          </DialogDescription>
        </DialogHeader>
        <PostForm
          handleSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}


