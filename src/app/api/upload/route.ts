import { storage } from "@/lib/firebase";
import { pathToFirebaseURL } from "@/lib/urlFormatter";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const folderName = formData.get('folderName') as string;
    const files = formData.getAll('files') as (string | File)[];

    const bucket = storage.bucket();

    const uploadedImagesUrl: string[] = await Promise.all(
      files.map(async (file, index) => {
        if (file instanceof File) {
          const path = `${folderName}/${id}/${Date.now()}-${index}-${file.name}`;
          const url = pathToFirebaseURL(path);
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const fileRef = bucket.file(path);

          await fileRef.save(buffer, {
            metadata: {
              contentType: file.type,
            },
          });

          return url;
        } else {
          return file;
        }
      })
    );

    return NextResponse.json(uploadedImagesUrl);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload files' },
      { status: 500 }
    );
  }
}