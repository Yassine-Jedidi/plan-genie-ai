import "./i18n";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const WAKE_UP_URL = import.meta.env.VITE_HUGGINGFACE_SPACE;

const AppWrapper = () => {
  useEffect(() => {
    fetch(WAKE_UP_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Hugging Face Space wake-up request sent successfully!");
      })
      .catch((error) => {
        console.error(
          "Error sending Hugging Face Space wake-up request:",
          error
        );
      });
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<AppWrapper />);
