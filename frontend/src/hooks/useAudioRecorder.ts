import { useState } from "react";
import { audioService } from "@/services/audioService";
import { toast } from "sonner";

export function useAudioRecorder(onTranscription: (transcription: string) => void) {
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    try {
      await audioService.startRecording();
      setIsRecording(true);
      toast.info("Recording started. Speak now…", { position: "top-right" });
    } catch (error) {
      setIsRecording(false);
      toast.error("Failed to start recording.", { position: "top-right" });
      throw error;
    }
  };

  const handleStopRecording = async () => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Transcribing audio…", { position: "top-right" });
      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);
      const transcription = await audioService.transcribeAudio(audioBlob);
      onTranscription(transcription);
      toast.success("Transcription complete!", { id: toastId, position: "top-right" });
    } catch (error) {
      setIsRecording(false);
      toast.error("Failed to transcribe audio.", { id: toastId, position: "top-right" });
      throw error;
    }
  };

  return {
    isRecording,
    handleStartRecording,
    handleStopRecording,
  };
} 