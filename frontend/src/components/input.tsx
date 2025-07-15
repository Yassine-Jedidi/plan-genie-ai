import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X, Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "@/components/useFileUpload";
import { useAudioRecorder } from "@/components/useAudioRecorder";

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
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Remove file and audio state, use hooks instead
  const {
    file,
    setFile,
    handleFileChange,
    handleRemoveFile,
    processFile,
    uploadInputRef,
    acceptedFileTypes,
  } = useFileUpload();
  const { isRecording, handleStartRecording, handleStopRecording } =
    useAudioRecorder((transcription) => {
      handleValueChange(
        currentValue + (currentValue ? " " : "") + transcription
      );
    });

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
              aria-label={t("input.removeFile") || undefined}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <PromptInputTextarea
        placeholder={placeholder || t("input.textareaPlaceholder")}
      />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          <PromptInputAction tooltip={t("input.attachFileTooltip")}>
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
            tooltip={
              isRecording
                ? t("input.stopRecordingTooltip")
                : t("input.startRecordingTooltip")
            }
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              type="button"
              aria-label={
                (isRecording
                  ? t("input.stopRecordingTooltip")
                  : t("input.startRecordingTooltip")) || undefined
              }
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
          tooltip={
            currentLoading
              ? t("input.stopGenerationTooltip")
              : t("input.sendMessageTooltip")
          }
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={currentLoading && !(currentValue.trim() || file)}
            type="button"
            aria-label={
              (currentLoading
                ? t("input.stopGenerationTooltip")
                : t("input.sendMessageTooltip")) || undefined
            }
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
