export interface AnalysisResult {
  type: string;
  confidence: number;
  entities: Record<string, string[]>;
} 