import { InferSelectModel } from "drizzle-orm";
import { posts } from "@/db/schema";
import EditPostButton from "./edit-post-button";
import DeletePostButton from "./delete-post-button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Post = InferSelectModel<typeof posts>;

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: Post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              {post.title}
            </CardTitle>
            <CardDescription>
              Last updated {post.updatedAt.toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {post.images?.[0] && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={`/api/files/${post.images[0]}`}
                  alt={post.title || "post image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            {post.description && (
              <p className="mt-4 text-sm text-muted-foreground">{post.description}</p>
            )}
          </CardContent>

          <CardFooter className="border-t pt-6">
            <div className="flex w-full items-center justify-end gap-3">
              <EditPostButton
                defaultValues={{
                  title: post.title,
                  description: post.description,
                  images: post.images,
                }}
                id={post.id}
              />
              <DeletePostButton id={post.id} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


