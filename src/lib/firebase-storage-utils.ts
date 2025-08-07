import { FileUpload } from "@/types/files";

// Function for uploadingfiles to storage. Accepts an array of string urls or file.
export const uploadFiles = async (id: number, folderName: string, files: FileUpload[]) => {
  // Create form data object
  const formData = new FormData();

  // Add id and folder name to form data
  formData.append('id', String(id));
  formData.append('folderName', folderName);

  // Add files to form data
  files.forEach((file) => {
    formData.append('files', file);
  })

  // Fetch the upload route then send form data. Returns uploaded files URL.
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  // If the status code is not with 200 - 299, retrun an error object
  if (!uploadResponse.ok) {
    const response = await uploadResponse.json();
    throw new Error(response.error || "Upload failed");
  }

  return { urls: await uploadResponse.json() as string[] };
}

export const deleteFilesByUrl = async (urls: string[]) => {
  const formData = new FormData();

  urls.forEach((url) => {
    formData.append('urls', url)
  })

  const deleteResponse = await fetch('/api/delete', {
    method: 'DELETE',
    body: formData,
  })

  // If the status code is not with 200 - 299, retrun an error object
  if (!deleteResponse.ok) {
    const response = await deleteResponse.json();
    throw new Error(response.error || "Delete failed");
  }
}

export const deleteFilesByPath = async (path: string) => {
  const deleteResponse = await fetch('/api/delete-folder', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderPath: path }),
  });

  if (!deleteResponse.ok) {
    const response = await deleteResponse.json();
    throw new Error(response.error || "Delete failed");
  }
}