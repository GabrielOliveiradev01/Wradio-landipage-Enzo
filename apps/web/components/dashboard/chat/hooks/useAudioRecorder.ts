import { useState, useRef } from "react";
import { formatSeconds } from "../constants";

/**
 * @param onRecorded - Called when recording stops.
 *   `blob`         — raw audio data, ready to send to `transcribeAudio()` in uploadService
 *   `durationText` — human-readable duration (e.g. "[Áudio gravado: 0:12]")
 *                    used as fallback text until the backend transcription is wired up
 */
export function useAudioRecorder(
  onRecorded: (blob: Blob, durationText: string) => void,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const durationAtStop = { value: 0 };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const durationText = `[Áudio gravado: ${formatSeconds(durationAtStop.value)}]`;
        // TODO: pass `blob` to `transcribeAudio(blob)` from uploadService
        onRecorded(blob, durationText);
        setRecordingTime(0);
      };

      recorder.start();
      setIsRecording(true);

      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        durationAtStop.value = elapsed;
        setRecordingTime(elapsed);
      }, 1000);
    } catch {
      alert("Não foi possível acessar o microfone.");
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, recordingTime, start, stop };
}
