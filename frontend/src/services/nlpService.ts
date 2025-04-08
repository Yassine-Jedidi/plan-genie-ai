import api from "@/components/api/api";
import { AxiosError } from "axios";

export interface AnalysisResult {
  type: string;
  confidence: number;
  entities: Record<string, string[]>;
}

export const nlpService = {
  async analyzeText(text: string): Promise<AnalysisResult> {
    try {
      const { data } = await api.post("/api/analyze-text", { text });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to analyze text");
      }
      throw new Error("Failed to analyze text");
    }
  },

  async predictType(text: string): Promise<{ type: string; confidence: number }> {
    try {
      const { data } = await api.post("/api/predict-type", { text });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to predict type");
      }
      throw new Error("Failed to predict type");
    }
  },

  async extractEntities(text: string): Promise<Record<string, string[]>> {
    try {
      const { data } = await api.post("/api/extract-entities", { text });
      return data.entities;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to extract entities");
      }
      throw new Error("Failed to extract entities");
    }
  },
}; 