import api from "@/components/api/api";
import { AxiosError } from "axios";

export const accountService = {
  async deleteAccount() {
    try {
      const { data } = await api.delete("/auth/delete-account");
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async exportData() {
    try {
      const { data } = await api.get("/auth/export-data");
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};

// Handle Axios errors with TypeScript
function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    return error.response.data; // Return the API error response
  }
  return { error: "Something went wrong" }; // Generic error message
} 