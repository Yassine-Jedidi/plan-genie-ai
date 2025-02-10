import api from "@/components/api/api"; // Import the Axios instance
import { AxiosError } from "axios"; // Import AxiosError for error handling

export const authService = {
  async signUp(email: string, password: string) {
    try {
      const { data } = await api.post("/auth/signup", { email, password });
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/auth/signin", { email, password });
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async signOut() {
    try {
      const { data } = await api.post("/auth/signout");
      return data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};

// ✅ Properly handle errors with TypeScript
function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    return error.response.data; // Return the API error response
  }
  return { error: "Something went wrong" }; // Generic error message
}
