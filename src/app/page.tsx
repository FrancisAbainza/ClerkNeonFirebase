import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Organize your tasks, store your files, and build faster
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            A modern starter with Clerk auth, Neon + Drizzle, and Firebase Storage — styled with shadcn/ui.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <SignUpButton mode="modal">
              <Button size="lg">Get started</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">Sign in</Button>
            </SignInButton>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required. You can explore the demo after signing in.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md border bg-secondary p-2">
                <Image src="/globe.svg" alt="Clerk" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-base">Authentication</CardTitle>
                <CardDescription>Secure auth with Clerk</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Out-of-the-box sign in, sign up, and user management with role-ready patterns.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md border bg-secondary p-2">
                <Image src="/vercel.svg" alt="Database" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-base">Database</CardTitle>
                <CardDescription>Neon + Drizzle ORM</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Type-safe queries and migrations using Drizzle, backed by a serverless Postgres.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md border bg-secondary p-2">
                <Image src="/file.svg" alt="Storage" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-base">Storage</CardTitle>
                <CardDescription>Firebase Storage uploads</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Upload and manage files with optimized routes and strict access rules.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md border bg-secondary p-2">
                <Image src="/next.svg" alt="UI" width={24} height={24} />
              </div>
              <div>
                <CardTitle className="text-base">UI Kit</CardTitle>
                <CardDescription>shadcn/ui + Tailwind</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Accessible components and sensible defaults for a polished developer UX.
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Button asChild variant="ghost">
            <Link href="/dashboard">Skip to dashboard →</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}