import { env } from "~/env.mjs";

export function getFileMaxSizeInBytes(): number {
  return parseFloat(env.NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE) * 1024 * 1024;
}

export function getFileMaxUpload(): number {
  return parseInt(env.NEXT_PUBLIC_FILE_UPLOAD_MAX_FILES);
}
