import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { nlpService, AnalysisResult } from "@/services/nlpService";
import { PromptInputWithActions } from "./components/input";
import { AnalysisResults } from "@/components/analysis-results";
import { ShiningText } from "./components/ui/shining-text";

function HomePage() {
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [allResults, setAllResults] = useState<AnalysisResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [savedResults, setSavedResults] = useState<Set<number>>(new Set());
  const [isFromFileUpload, setIsFromFileUpload] = useState(false);
  const [shouldResetFile, setShouldResetFile] = useState(false);

  // Handle file reset callback
  const handleFileReset = useCallback(() => {
    console.log("File has been reset, updating state");
    setShouldResetFile(false);
  }, []);

  const analyzeSingleSentence = async (
    sentence: string
  ): Promise<AnalysisResult | null> => {
    if (!sentence.trim()) return null;

    try {
      const data = await nlpService.analyzeText(sentence);
      const typeMap: Record<string, string> = {
        Tâche: "Task",
        Événement: "Event",
      };
      return { ...data, type: typeMap[data.type as string] || data.type };
    } catch (error) {
      console.error("Sentence analysis failed:", error, "Sentence:", sentence);
      return null;
    }
  };

  const analyzeMultipleSentences = async (
    content: string
  ): Promise<AnalysisResult[]> => {
    // Split by newlines and filter out empty lines
    const sentences = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (sentences.length === 0) {
      toast.error("No valid text found to analyze", {
        position: "top-right",
      });
      return [];
    }

    console.log(`Processing ${sentences.length} sentences from content`);

    // If just one sentence, process it normally
    if (sentences.length === 1) {
      const result = await analyzeSingleSentence(sentences[0]);
      return result ? [result] : [];
    }

    // For multiple sentences, analyze each and collect results
    const results: AnalysisResult[] = [];
    let completedCount = 0;

    // Show a progress toast that we'll update
    const toastId = toast.loading(
      `Analyzing sentences (0/${sentences.length})...`,
      {
        position: "top-right",
      }
    );

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const result = await analyzeSingleSentence(sentence);

      if (result) {
        results.push(result);
      }

      completedCount++;
      toast.loading(
        `Analyzing sentences (${completedCount}/${sentences.length})...`,
        {
          id: toastId,
          position: "top-right",
        }
      );
    }

    // Update final toast status
    if (results.length > 0) {
      toast.success(`Analyzed ${results.length} sentences successfully`, {
        id: toastId,
        position: "top-right",
      });
    } else {
      toast.error("Failed to analyze any sentences", {
        id: toastId,
        position: "top-right",
      });
    }

    return results;
  };

  const analyzeText = async (
    text: string,
    files: { name: string; content: string }[]
  ) => {
    console.log("Analyzing text:", text);
    console.log(
      "Analyzing files:",
      files.map((f) => f.name)
    );

    // Reset file reset flag
    setShouldResetFile(false);

    // Determine what to analyze: text input or file content
    let contentToAnalyze = text.trim();
    let fromFileUpload = false;

    // If no text but files exist, use the first file's content
    if (!contentToAnalyze && files.length > 0) {
      const fileContent = files[0].content.trim();
      if (fileContent) {
        contentToAnalyze = fileContent;
        console.log(`Using content from file: ${files[0].name}`);
        fromFileUpload = true;
      }
    }

    if (!contentToAnalyze) {
      toast.error("Please enter some text or upload a file to analyze", {
        position: "top-right",
      });
      return;
    }

    setAnalyzing(true);
    setIsFromFileUpload(fromFileUpload);

    try {
      // Process content which may contain multiple sentences
      const resultsArray = await analyzeMultipleSentences(contentToAnalyze);

      if (resultsArray.length > 0) {
        setAllResults(resultsArray);
        setCurrentResultIndex(0);
        setResults(resultsArray[0]);
        setSavedResults(new Set()); // Reset saved results
        setInputText("");

        // Set flag to reset file after successful analysis
        if (fromFileUpload) {
          setShouldResetFile(true);
        }
      } else {
        toast.error("No results were generated from the analysis", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Text analysis failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to analyze text. Please try again.",
        {
          position: "top-right",
        }
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const showNextResult = () => {
    if (allResults.length <= 1 || currentResultIndex >= allResults.length - 1)
      return;
    const nextIndex = currentResultIndex + 1;
    setCurrentResultIndex(nextIndex);
    setResults(allResults[nextIndex]);
  };

  const showPreviousResult = () => {
    if (allResults.length <= 1 || currentResultIndex <= 0) return;
    const prevIndex = currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    setResults(allResults[prevIndex]);
  };

  // Find the next unsaved result or go to the first one
  const findNextUnsavedResult = (): number => {
    if (allResults.length <= 1) return 0;

    // If all results are saved, go back to the first one
    if (savedResults.size >= allResults.length) {
      return 0;
    }

    // Look for the next unsaved result after the current one
    for (let i = currentResultIndex + 1; i < allResults.length; i++) {
      if (!savedResults.has(i)) {
        return i;
      }
    }

    // If no unsaved results after current, look from the beginning
    for (let i = 0; i < currentResultIndex; i++) {
      if (!savedResults.has(i)) {
        return i;
      }
    }

    // Default to first result if nothing else found
    return 0;
  };

  // Handle saving a result and moving to the next one
  const handleResultSave = useCallback(() => {
    // Make sure we have the current result
    const currentResult = allResults[currentResultIndex];
    if (!currentResult) return;

    // Get the exact type from the current result
    const resultType = currentResult.type || "Task";
    console.log("Saving result of type:", resultType);

    // Mark the current result as saved
    setSavedResults((prev) => {
      const updated = new Set(prev);
      updated.add(currentResultIndex);
      return updated;
    });

    // Check if this is a multi-sentence file upload or just a single sentence
    const isMultiSentenceFile = isFromFileUpload && allResults.length > 1;

    // Check if we've saved all results after this save
    if (savedResults.size + 1 >= allResults.length) {
      // All results are now saved, clear everything

      // Different message based on source - only show for multi-sentence files
      if (isMultiSentenceFile) {
        toast.success("All tasks processed and saved!", {
          position: "top-right",
        });
      }

      // Clear results immediately without delay
      setResults(null);
      setAllResults([]);
      setCurrentResultIndex(0);
      setSavedResults(new Set());

      return;
    }

    // Not all results saved yet, move to next unsaved
    const nextIndex = findNextUnsavedResult();
    setCurrentResultIndex(nextIndex);
    setResults(allResults[nextIndex]);
  }, [allResults, currentResultIndex, savedResults, isFromFileUpload]);

  return (
    <main className="flex-1 min-w-100vh">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
        <div className="flex-grow overflow-auto pb-4 flex justify-center">
          <div className="w-full max-w-4xl">
            {results && (
              <>
                {allResults.length > 1 && isFromFileUpload && (
                  <div className="flex justify-between items-center mb-4 text-primary-foreground text-sm">
                    <button
                      onClick={showPreviousResult}
                      disabled={currentResultIndex === 0}
                      className="px-4 py-2 bg-primary/90 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-foreground">
                      Result {currentResultIndex + 1} of {allResults.length}
                      {savedResults.has(currentResultIndex) ? " (Saved)" : ""}
                    </span>
                    <button
                      onClick={showNextResult}
                      disabled={currentResultIndex === allResults.length - 1}
                      className="px-4 py-2 bg-primary/90 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
                <AnalysisResults
                  results={results}
                  setResults={setResults}
                  onSave={handleResultSave}
                  isSaved={savedResults.has(currentResultIndex)}
                />
              </>
            )}
            {analyzing && (
              <div className="flex justify-center items-center h-full">
                <ShiningText text={"Plan Genie AI is thinking..."} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto sticky bottom-0 flex justify-center">
          <PromptInputWithActions
            onSubmit={analyzeText}
            value={inputText}
            onValueChange={setInputText}
            isLoading={analyzing}
            resetFile={shouldResetFile}
            onFileReset={handleFileReset}
            placeholder="Enter your task text here... e.g., 'I need to prepare a presentation for the marketing team by next Friday. It's urgent!'"
          />
        </div>
      </div>
    </main>
  );
}

export default HomePage;
