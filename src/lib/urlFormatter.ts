export const pathToFirebaseURL = (path: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/experiment-80996.firebasestorage.app/o/${encodeURIComponent(path)}?alt=media`
}

export const extractStoragePath = (url: string) => {
  const pathEncoded = new URL(url).pathname.split('/o/')[1];
  return decodeURIComponent(pathEncoded);
}