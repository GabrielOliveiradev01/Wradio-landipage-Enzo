/**
 * uploadService.ts
 *
 * Central service for all file upload and audio capture operations.
 * All functions are stubs — replace the TODO blocks with real API calls
 * once the backend is ready. The signatures and return shapes are already
 * defined so the frontend stays unchanged when you wire them up.
 */

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
}

// ─── Laudo Express ───────────────────────────────────────────────────────────

/**
 * Uploads exam images for Laudo Express.
 *
 * @param files    - Image files selected by the user (PNG, JPG, DICOM)
 * @param examType - Type of exam (e.g. "Tomografia Computadorizada")
 * @returns        - Array of hosted image URLs
 *
 * TODO: POST /api/exams/images
 *   Content-Type: multipart/form-data
 *   Fields: images[] (File), examType (string)
 *   Response: { urls: string[] }
 */
export async function uploadExamImages(
  files: File[],
  examType: string,
): Promise<{ urls: string[] }> {
  // TODO: implement
  // const formData = new FormData();
  // files.forEach((f) => formData.append("images", f));
  // formData.append("examType", examType);
  // const res = await fetch("/api/exams/images", { method: "POST", body: formData });
  // if (!res.ok) throw new Error("Falha ao enviar imagens");
  // return res.json();

  console.log("[uploadExamImages] stub — files:", files.length, "examType:", examType);
  return { urls: [] };
}

// ─── Audio / Transcrição ─────────────────────────────────────────────────────

/**
 * Sends an audio blob for server-side transcription.
 *
 * @param blob - Audio blob from MediaRecorder (webm/ogg)
 * @returns    - Transcribed text
 *
 * TODO: POST /api/audio/transcribe
 *   Content-Type: multipart/form-data
 *   Fields: audio (Blob as "recording.webm")
 *   Response: { transcription: string }
 */
export async function transcribeAudio(
  blob: Blob,
): Promise<{ transcription: string }> {
  // TODO: implement
  // const formData = new FormData();
  // formData.append("audio", blob, "recording.webm");
  // const res = await fetch("/api/audio/transcribe", { method: "POST", body: formData });
  // if (!res.ok) throw new Error("Falha ao transcrever áudio");
  // return res.json();

  console.log("[transcribeAudio] stub — size:", blob.size, "type:", blob.type);
  return { transcription: "" };
}

// ─── Perfil ──────────────────────────────────────────────────────────────────

/**
 * Uploads a profile picture for the logged-in user.
 *
 * @param file - Image file (JPG, PNG or GIF, max 5 MB)
 * @returns    - Hosted URL of the new avatar
 *
 * TODO: POST /api/users/avatar
 *   Content-Type: multipart/form-data
 *   Fields: avatar (File)
 *   Response: { url: string }
 */
export async function uploadProfilePicture(
  file: File,
): Promise<{ url: string }> {
  // TODO: implement
  // const formData = new FormData();
  // formData.append("avatar", file);
  // const res = await fetch("/api/users/avatar", { method: "POST", body: formData });
  // if (!res.ok) throw new Error("Falha ao atualizar foto de perfil");
  // return res.json();

  console.log("[uploadProfilePicture] stub — file:", file.name);
  // Returns a local object URL as preview until the backend is ready
  return { url: URL.createObjectURL(file) };
}

// ─── Chat ────────────────────────────────────────────────────────────────────

/**
 * Uploads file/image attachments for a chat message.
 *
 * @param files  - Files attached to the message
 * @param chatId - ID of the active conversation
 * @returns      - Array of uploaded file metadata
 *
 * TODO: POST /api/chat/:chatId/attachments
 *   Content-Type: multipart/form-data
 *   Fields: files[] (File)
 *   Response: { files: UploadedFile[] }
 */
export async function uploadChatAttachments(
  files: File[],
  chatId: string,
): Promise<{ files: UploadedFile[] }> {
  // TODO: implement
  // const formData = new FormData();
  // files.forEach((f) => formData.append("files", f));
  // const res = await fetch(`/api/chat/${chatId}/attachments`, {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Falha ao enviar anexos");
  // return res.json();

  console.log("[uploadChatAttachments] stub — chatId:", chatId, "files:", files.length);
  return { files: [] };
}

// ─── Comunidade ──────────────────────────────────────────────────────────────

/**
 * Uploads file/image attachments for a community post.
 *
 * @param files - Files attached to the post
 * @returns     - Array of uploaded file metadata
 *
 * TODO: POST /api/community/attachments
 *   Content-Type: multipart/form-data
 *   Fields: files[] (File)
 *   Response: { files: UploadedFile[] }
 */
export async function uploadCommunityAttachments(
  files: File[],
): Promise<{ files: UploadedFile[] }> {
  // TODO: implement
  // const formData = new FormData();
  // files.forEach((f) => formData.append("files", f));
  // const res = await fetch("/api/community/attachments", {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Falha ao enviar anexos");
  // return res.json();

  console.log("[uploadCommunityAttachments] stub — files:", files.length);
  return { files: [] };
}
