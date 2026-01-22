import { deleteObject } from "firebase/storage";

export async function deletePostAudio(postId: string): Promise<void> {
  if (!storage) throw new Error("Firebase storage not initialized");
  const audioRef = ref(storage, `post-audio/${postId}.webm`);
  await deleteObject(audioRef);
}
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export async function uploadPostAudio(
  postId: string,
  audioBlob: Blob,
): Promise<string> {
  if (!storage) throw new Error("Firebase storage not initialized");
  const audioRef = ref(storage, `post-audio/${postId}.webm`);
  await uploadBytes(audioRef, audioBlob, { contentType: "audio/webm" });
  return getDownloadURL(audioRef);
}
