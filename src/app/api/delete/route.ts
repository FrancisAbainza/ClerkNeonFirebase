import { storage } from '@/lib/firebase';
import { extractStoragePath } from '@/lib/urlFormatter';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const formData = await request.formData();
    const urls = formData.getAll('urls') as string[];
    const bucket = storage.bucket();

    // Delete all files
    const deletePromises = urls.map((url) => {
      const path = extractStoragePath(url);
      return bucket.file(path).delete()}
    );
    await Promise.all(deletePromises);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete files' },
      { status: 500 }
    );
  }
}