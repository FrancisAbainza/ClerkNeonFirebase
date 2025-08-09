// app/api/files/[...path]/route.ts
import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase-server"; // make sure your Firebase admin is initialized here

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const filePath = path.join("/"); // "posts/1/image.jpeg"
  const bucket = storage.bucket();
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    return new NextResponse("Not found", { status: 404 });
  }

  const [buffer] = await file.download();
  const contentType = file.metadata?.contentType || "application/octet-stream";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=31536000",
    },
  });
}

