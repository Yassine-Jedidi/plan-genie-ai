export interface BilanEntry {
  id: string;
  minutes_spent: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  bilan_id: string;
  task_id: string;
  task?: import('./task').Task;
}

export interface Bilan {
  id: string;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  entries: BilanEntry[];
} 