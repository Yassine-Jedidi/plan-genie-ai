export interface Task {
  id: string;
  title: string;
  deadline: Date | null;
  deadline_text?: string | null;
  priority: string | null;
  status: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ManualTask {
  title: string;
  deadline: Date;
  priority: string;
  status: string;
}

export interface TaskFormData {
  title: string;
  priority: string;
  status: string;
  deadline: Date;
} 