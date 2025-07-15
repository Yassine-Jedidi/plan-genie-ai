import { useRef, useState } from "react";

export function useFileUpload(acceptedFileTypes = ".txt,.md,.csv") {
  const [file, setFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFile = event.target.files[0];
      setFile(newFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          resolve("");
        }
      };
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });
  };

  const processFile = async () => {
    if (!file) return [];
    const contents: { name: string; content: string }[] = [];
    try {
      const content = await extractTextFromFile(file);
      contents.push({ name: file.name, content });
    } catch {
      // ignore
    }
    return contents;
  };

  return {
    file,
    setFile,
    handleFileChange,
    handleRemoveFile,
    processFile,
    uploadInputRef,
    acceptedFileTypes,
  };
} 