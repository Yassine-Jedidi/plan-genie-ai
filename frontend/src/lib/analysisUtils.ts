import * as chrono from "chrono-node";

// Function to parse date from text using chrono-node with French priority
export const frenchParser = chrono.fr;
export const englishParser = chrono.en;

export function parseDate(text: string): { originalText: string; parsedDate: Date | null } {
  if (!text) return { originalText: text, parsedDate: null };
  try {
    const now = new Date();
    let parsedDate = frenchParser.parseDate(text, now);
    if (parsedDate && parsedDate.toDateString() === now.toDateString()) {
      const lowerCaseText = text.toLowerCase();
      if (lowerCaseText.includes("tomorrow") || lowerCaseText.includes("demain")) {
        parsedDate.setDate(parsedDate.getDate() + 1);
      }
    }
    if (!parsedDate) {
      parsedDate = englishParser.parseDate(text, now);
    }
    if (parsedDate) {
      const now = new Date();
      const dayNames = [
        "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche",
        "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
      ];
      const lowerCaseText = text.toLowerCase().trim();
      const isDayOfWeek = dayNames.some((day) => lowerCaseText === day);
      if (isDayOfWeek && parsedDate < now) {
        parsedDate.setDate(parsedDate.getDate() + 7);
      }
    }
    return { originalText: text, parsedDate };
  } catch {
    return { originalText: text, parsedDate: null };
  }
}

// Helper function to get a display-friendly name for entity types
export function getEntityDisplayName(entityType: string, t: (key: string) => string) {
  const displayNames: Record<string, string> = {
    TITRE: t("analysis.title"),
    DELAI: t("analysis.deadline"),
    PRIORITE: t("analysis.priority"),
    DATE_HEURE: t("analysis.date"),
  };
  return displayNames[entityType] || entityType;
}

// Helper function to ensure all required entities exist and order them correctly
export function getOrderedEntitiesForDisplay(
  type: string,
  entities: Record<string, string[]>
): Array<[string, string[]]> {
  const result = { ...entities };
  if (type === "Task") {
    if (!result["TITRE"]) result["TITRE"] = [];
    if (!result["DELAI"]) result["DELAI"] = [];
    if (!result["PRIORITE"]) result["PRIORITE"] = [];
    return [
      ["TITRE", result["TITRE"]],
      ["DELAI", result["DELAI"]],
      ["PRIORITE", result["PRIORITE"]],
    ];
  } else if (type === "Event") {
    if (!result["TITRE"]) result["TITRE"] = [];
    if (!result["DATE_HEURE"]) result["DATE_HEURE"] = [];
    return [
      ["TITRE", result["TITRE"]],
      ["DATE_HEURE", result["DATE_HEURE"]],
    ];
  }
  return Object.entries(result);
} 