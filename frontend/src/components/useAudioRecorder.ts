import { useState } from "react";
import { audioService } from "@/services/audioService";

export function useAudioRecorder(onTranscription: (transcription: string) => void) {
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    try {
      await audioService.startRecording();
      setIsRecording(true);
    } catch (error) {
      setIsRecording(false);
      throw error;
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);
      const transcription = await audioService.transcribeAudio(audioBlob);
      onTranscription(transcription);
    } catch (error) {
      setIsRecording(false);
      throw error;
    }
  };

  return {
    isRecording,
    handleStartRecording,
    handleStopRecording,
  };
} 