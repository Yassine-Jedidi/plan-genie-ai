import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X, Mic, MicOff } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { audioService } from "@/services/audioService";

interface PromptInputWithActionsProps {
  onSubmit?: (
    text: string,
    fileContents: { name: string; content: string }[]
  ) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  resetFile?: boolean;
  onFileReset?: () => void;
}

export function PromptInputWithActions({
  onSubmit: externalSubmit,
  value: externalValue,
  onValueChange: externalValueChange,
  isLoading: externalLoading,
  placeholder,
  resetFile = false,
  onFileReset,
}: PromptInputWithActionsProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Use external values if provided, otherwise use internal state
  const currentValue = externalValue !== undefined ? externalValue : input;
  const currentLoading =
    externalLoading !== undefined ? externalLoading : isLoading;

  // Effect to reset file when resetFile prop changes to true
  useEffect(() => {
    if (resetFile && file) {
      console.log("Resetting file input");
      setFile(null);
      if (uploadInputRef?.current) {
        uploadInputRef.current.value = "";
      }

      // Notify parent that file has been reset
      if (onFileReset) {
        onFileReset();
      }
    }
  }, [resetFile, file, onFileReset]);

  const handleValueChange = (value: string) => {
    if (externalValueChange) {
      externalValueChange(value);
    } else {
      setInput(value);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log(`Extracting text from file: ${file.name}, type: ${file.type}`);

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          console.log(
            `Successfully extracted content from ${file.name}, length: ${content.length}`
          );
          resolve(content);
        } else {
          console.error(`Failed to extract content from ${file.name}`);
          resolve("");
        }
      };

      reader.onerror = (e) => {
        console.error(`Error reading file ${file.name}:`, e);
        resolve("");
      };

      reader.readAsText(file);
    });
  };

  const processFile = async () => {
    if (!file) return [];

    console.log(`Processing file: ${file.name}`);
    const contents: { name: string; content: string }[] = [];

    try {
      const content = await extractTextFromFile(file);
      contents.push({
        name: file.name,
        content,
      });
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }

    console.log(`Processed file successfully`);
    return contents;
  };

  const handleSubmit = async () => {
    console.log(
      `Submit triggered. Input: "${currentValue}", File: ${
        file?.name || "none"
      }`
    );

    if (currentValue.trim() || file) {
      setIsLoading(true);

      try {
        const contents = await processFile();

        if (externalSubmit) {
          console.log(
            `Calling external submit with ${contents.length} file content`
          );
          externalSubmit(currentValue, contents);
        } else {
          console.log(`No external submit handler, running mock submission`);
          // Display file contents in the console for debugging
          if (contents.length > 0) {
            console.log("File content:");
            contents.forEach(({ name, content }) => {
              console.log(`---${name}---`);
              console.log(
                content.substring(0, 200) + (content.length > 200 ? "..." : "")
              );
            });
          }

          // Mock submission for demonstration
          setTimeout(() => {
            setIsLoading(false);
            setInput("");
            setFile(null);

            // Alert for demonstration purposes
            if (contents.length > 0) {
              alert(`Processed file successfully. Check console for details.`);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Error during submission:", error);
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFile = event.target.files[0];
      console.log(`Added file: ${newFile.name}`);

      // Remove previous file if exists
      if (file) {
        console.log(`Replacing previous file: ${file.name}`);
      }

      setFile(newFile);
      toast.success(`File "${newFile.name}" uploaded successfully`, {
        position: "top-right",
      });
    }
  };

  const handleRemoveFile = () => {
    if (file) {
      const removedFile = file;
      setFile(null);
      console.log(`Removed file: ${removedFile.name}`);

      toast.info(`File "${removedFile.name}" removed`, {
        position: "top-right",
      });
    }

    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  // Only allow text-based file formats
  const acceptedFileTypes = ".txt,.md,.csv";

  const handleStartRecording = async () => {
    try {
      await audioService.startRecording();
      setIsRecording(true);
      toast.info("Recording started...", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording", {
        position: "top-right",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);

      // Show loading toast
      const loadingToast = toast.loading("Transcribing audio...", {
        position: "top-right",
      });

      // Transcribe the audio
      const transcription = await audioService.transcribeAudio(audioBlob);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Recording transcribed successfully", {
        position: "top-right",
      });

      // Update the input with the transcription
      handleValueChange(
        currentValue + (currentValue ? " " : "") + transcription
      );
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to transcribe recording", {
        position: "top-right",
      });
    }
  };

  return (
    <PromptInput
      value={currentValue}
      onValueChange={handleValueChange}
      isLoading={currentLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-4xl"
    >
      {file && (
        <div className="flex flex-wrap gap-2 pb-2">
          <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
            <Paperclip className="size-4" />
            <span className="max-w-[120px] truncate">{file.name}</span>
            <button
              onClick={handleRemoveFile}
              className="hover:bg-secondary/50 rounded-full p-1"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <PromptInputTextarea
        placeholder={
          placeholder || "Ask me anything, upload a file, or use voice input..."
        }
      />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <PromptInputAction tooltip="Attach a text file (.txt, .md, .csv)">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            >
              <input
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                ref={uploadInputRef}
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>

          <PromptInputAction
            tooltip={isRecording ? "Stop recording" : "Start recording"}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              type="button"
            >
              {isRecording ? (
                <MicOff className="text-red-500 size-6" />
              ) : (
                <Mic className="text-primary size-6" />
              )}
            </Button>
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={currentLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={currentLoading && !(currentValue.trim() || file)}
            type="button"
          >
            {currentLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
