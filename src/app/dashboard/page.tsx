import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddPostButton from "./add-post-button";
import PostList from "./post-list";
import { getPosts } from "./actions";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  const posts = await getPosts();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-gradient-to-b from-background to-muted">
      <section className="container mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">
            Welcome{user.firstName ? `, ${user.firstName}` : ""}. Manage your posts and keep things organized.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </div>
          <AddPostButton />
        </div>

        <div className="mt-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
              <p className="text-base font-medium">No posts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first post.
              </p>
              <div className="mt-4">
                <AddPostButton />
              </div>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </section>
    </main>
  );
}