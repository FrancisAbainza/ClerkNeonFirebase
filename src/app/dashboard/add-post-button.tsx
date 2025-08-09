"use client"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { createPost, savePostImagesPaths } from "./actions";
import PostForm from "../../components/post-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { postSchema } from "@/lib/validation/postSchema";
import { useRef } from "react";
import { uploadFiles } from "@/utils/firebase-storage-utils";
import { toast } from "sonner";

export default function AddPostButton() {
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(data: z.infer<typeof postSchema>) {
    const { images, ...rest } = data;

    try {
      // Save post to database. Returns created post id
      const createPostResponse = await createPost(rest);

      // Upload files to firebase storage. Returns uploaded file paths
      const uploadImagesResponse = await uploadFiles(createPostResponse.id, 'posts', images);

      // Save post images paths to database
      await savePostImagesPaths(createPostResponse.id, uploadImagesResponse.paths);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }

    toast.success("Success!", {
      description: "Post added",
    });
    closeRef.current?.click();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Post</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
            <DialogDescription>
              Fill out the fields below to create a new post.
            </DialogDescription>
          </DialogHeader>
          <PostForm handleSubmit={handleSubmit} />
          <DialogClose ref={closeRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}


