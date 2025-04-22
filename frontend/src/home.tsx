import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { toast } from "sonner";
import { nlpService, AnalysisResult } from "@/services/nlpService";
import { PromptInputWithActions } from "./components/input";
import { AnalysisResults } from "@/components/analysis-results";

function HomePage() {
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeText = async () => {
    console.log("Analyzing text:", inputText);
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setAnalyzing(true);
    try {
      const data = await nlpService.analyzeText(inputText);
      setResults(data);
      toast.success("Text analysis complete!");
      setInputText("");
    } catch (error) {
      console.error("Text analysis failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to analyze text. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="flex-1 min-w-100vh">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
        <h1 className="text-2xl font-bold mb-4">Task Analysis</h1>

        <div className="flex-grow overflow-auto pb-4 flex justify-center">
          <div className="w-full max-w-5xl">
            {results && (
              <AnalysisResults results={results} setResults={setResults} />
            )}
          </div>
        </div>

        <div className="mt-auto sticky bottom-0 flex justify-center">
          <PromptInputWithActions
            onSubmit={analyzeText}
            value={inputText}
            onValueChange={setInputText}
            isLoading={analyzing}
            placeholder="Enter your task text here... e.g., 'I need to prepare a presentation for the marketing team by next Friday.'"
          />
        </div>
      </div>
    </main>
  );
}

export default HomePage;
