import api from "@/components/api/api";
import { AxiosError } from "axios";
import { AnalysisResult } from "./nlpService";
import { priorityService } from "./priorityService";
import * as chrono from 'chrono-node';

export interface Task {
  id: string;
  title: string;
  deadline: string | null;
  deadline_text?: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Event {
  id: string;
  title: string;
  date_time: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Use the built-in French parser as demonstrated by the user
const frenchParser = chrono.fr;
const englishParser = chrono.en;

export const taskService = {
  async saveTask(analysisResult: AnalysisResult): Promise<Task | Event> {
    try {
      // Create a deep copy of the analysis result to avoid modifying the original
      const processedResult = {
        ...analysisResult,
        entities: { ...analysisResult.entities }
      };
      
      // Handle deadline parsing for tasks
      if (analysisResult.type === "Tâche" && processedResult.entities["DELAI"]?.length > 0) {
        const delaiValue = processedResult.entities["DELAI"][0];
        
        try {
          // First try to parse as JSON (this happens when edited through UI)
          const parsedDelai = JSON.parse(delaiValue);
          if (parsedDelai.originalText && parsedDelai.parsedDate) {
            // Keep the JSON format, but ensure it's properly structured
            processedResult.entities["DELAI"] = [parsedDelai.parsedDate];
            // Store the original text in a new property
            processedResult.entities["DELAI_TEXT"] = [parsedDelai.originalText];
          }
        } catch {
          // Not in JSON format, try to parse using French first, then English
          // First try with French parser
          let parsedDate = frenchParser.parseDate(delaiValue);
          
          // If French parsing failed, try with English parser
          if (!parsedDate) {
            parsedDate = englishParser.parseDate(delaiValue);
          }
          
          console.log(`Parsing in taskService: "${delaiValue}" → ${parsedDate ? parsedDate.toLocaleDateString() : 'null'}`);
          
          if (parsedDate) {
            // Store the parsed date and keep the original text
            processedResult.entities["DELAI"] = [parsedDate.toISOString()];
            processedResult.entities["DELAI_TEXT"] = [delaiValue];
          } else {
            // If parsing fails, keep as is
            processedResult.entities["DELAI_TEXT"] = [delaiValue];
          }
        }
      }
      
      // If it's a task, standardize the priority before saving
      if (analysisResult.type === "Tâche") {
        const priorityText = analysisResult.entities["PRIORITE"]?.[0];
        const priorityLevel = priorityService.classifyPriority(priorityText);
        const standardizedPriority = priorityService.getPriorityLabel(priorityLevel);
        
        if (standardizedPriority) {
          processedResult.entities.PRIORITE = [standardizedPriority];
        }
        
        const { data } = await api.post("/tasks/save", processedResult);
        return data;
      } else {
        // For events, pass through unchanged
        const { data } = await api.post("/tasks/save", processedResult);
        return data;
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to save task");
      }
      throw new Error("Failed to save task");
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      const { data } = await api.get("/tasks/tasks");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch tasks");
      }
      throw new Error("Failed to fetch tasks");
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/tasks/${taskId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to delete task");
      }
      throw new Error("Failed to delete task");
    }
  },

  async getEvents(userId: string): Promise<Event[]> {
    try {
      const { data } = await api.get(`/tasks/events/${userId}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch events");
      }
      throw new Error("Failed to fetch events");
    }
  },

  async getAllItems(userId: string): Promise<{ tasks: Task[], events: Event[] }> {
    try {
      const [tasksResponse, eventsResponse] = await Promise.all([
        this.getTasks(),
        this.getEvents(userId)
      ]);
      
      return {
        tasks: tasksResponse,
        events: eventsResponse
      };
    } catch {
      throw new Error("Failed to fetch all items");
    }
  }
}; 