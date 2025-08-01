const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async prioritizeTasks(tasks, language = "en") {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      if (!tasks || tasks.length === 0) {
        return { prioritizedTasks: [], reasoning: "No tasks to prioritize" };
      }

      // Filter out completed tasks and overdue tasks
      const activeTasks = tasks.filter((task) => {
        // Skip completed tasks
        if (task.status === "Done") {
          return false;
        }

        // Skip overdue tasks
        if (task.deadline) {
          const deadline = new Date(task.deadline);
          const now = new Date();
          if (deadline < now) {
            return false;
          }
        }

        return true;
      });

      if (activeTasks.length === 0) {
        const noTasksMessage =
          language === "fr"
            ? "Aucune tâche active à prioriser. Toutes les tâches sont soit terminées soit en retard."
            : "No active tasks to prioritize. All tasks are either completed or overdue.";

        return {
          prioritizedTasks: [],
          reasoning: noTasksMessage,
        };
      }

      // Format tasks for the AI
      const tasksDescription = activeTasks
        .map((task, index) => {
          const deadline = task.deadline
            ? new Date(task.deadline).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : language === "fr"
            ? "Aucune échéance"
            : "No deadline";
          const priority = task.priority || "Medium";
          const daysUntilDeadline = task.deadline
            ? Math.ceil(
                (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              )
            : null;

          let urgencyIndicator = "";
          if (daysUntilDeadline !== null) {
            if (daysUntilDeadline < 0) {
              urgencyIndicator =
                language === "fr" ? " (EN RETARD)" : " (OVERDUE)";
            } else if (daysUntilDeadline === 0) {
              urgencyIndicator =
                language === "fr" ? " (À RENDRE AUJOURD'HUI)" : " (DUE TODAY)";
            } else if (daysUntilDeadline === 1) {
              urgencyIndicator =
                language === "fr" ? " (À RENDRE DEMAIN)" : " (DUE TOMORROW)";
            } else if (daysUntilDeadline <= 3) {
              urgencyIndicator =
                language === "fr"
                  ? " (URGENT - à rendre dans " + daysUntilDeadline + " jours)"
                  : " (URGENT - due in " + daysUntilDeadline + " days)";
            } else if (daysUntilDeadline <= 7) {
              urgencyIndicator =
                language === "fr"
                  ? " (à rendre dans " + daysUntilDeadline + " jours)"
                  : " (due in " + daysUntilDeadline + " days)";
            } else {
              urgencyIndicator =
                language === "fr"
                  ? " (à rendre dans " + daysUntilDeadline + " jours)"
                  : " (due in " + daysUntilDeadline + " days)";
            }
          }

          const statusText =
            language === "fr"
              ? task.status === "In Progress"
                ? "En cours"
                : task.status === "Planned"
                ? "Planifié"
                : task.status === "Done"
                ? "Terminé"
                : "En attente"
              : task.status || "Pending";

          return `${index + 1}. ${task.title}
   - PRIORITY: ${priority.toUpperCase()}
   - DEADLINE: ${deadline}${urgencyIndicator}
   - Description: ${
     task.description ||
     (language === "fr" ? "Aucune description" : "No description")
   }
   - Status: ${statusText}`;
        })
        .join("\n\n");

      // Create language-specific prompts
      const prompts = {
        en: `You are a task prioritization expert. Analyze the following tasks and prioritize them based on DUE TIME and PRIORITY LEVELS.

IMPORTANT: All dates are in DD/MM/YYYY format (European format). For example:
- 04/08/2025 means August 4th, 2025 (not April 8th)
- 02/08/2025 means August 2nd, 2025 (not February 8th)
- 12/08/2025 means August 12th, 2025 (not December 8th)

Tasks to analyze:
${tasksDescription}

PRIORITIZATION CRITERIA (in order of importance):
1. **Due Time (Most Important)**: Tasks with earlier deadlines should be prioritized higher
2. **Priority Level (Very Important)**: High priority tasks should be ranked above Medium, Medium above Low
3. **Time Sensitivity**: Consider how close the deadline is to today
4. **Priority Override**: When tasks are due on the same day or within a few hours, PRIORITY LEVEL takes precedence over small time differences
5. **Task Dependencies**: If one task blocks others, prioritize it first

PRIORITIZATION RULES:
- Sort by deadline first (earliest first)
- Within same deadline, sort by priority (High > Medium > Low)
- PRIORITY OVERRIDE: If tasks are due on the same day or within 2-3 hours, High priority beats Low priority regardless of small time differences
- Tasks without deadlines go last, sorted by priority
- Consider urgency: tasks due today/tomorrow get highest priority
- When time difference is less than 3 hours, prioritize by priority level first, then by time

IMPORTANT: You MUST include ALL ${
          activeTasks.length
        } tasks in your prioritization. Do not skip any tasks.

Please provide a JSON response with this EXACT structure (no additional text before or after the JSON):
{
  "prioritizedTaskIds": [${activeTasks
    .map((_, index) => index + 1)
    .join(", ")}],
  "reasoning": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Brief, natural explanation focusing on deadline and priority factors]"`
  )
  .join(",\n")}
  },
  "estimatedTimePerTask": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Realistic time estimate based on task complexity and nature]"`
  )
  .join(",\n")}
  },
  "timeColors": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Color for time estimate: 'green' for short tasks (≤30min), 'yellow' for medium tasks (1-2h), 'red' for long tasks (3h+)]"`
  )
  .join(",\n")}
  }
}

CRITICAL REQUIREMENTS:
- You MUST include ALL ${
          activeTasks.length
        } tasks in the prioritizedTaskIds array
- The task title in reasoning MUST match the task that is actually prioritized in that position
${activeTasks
  .map(
    (_, index) =>
      `- Position ${
        index + 1
      } reasoning should describe the task that is ranked #${index + 1}`
  )
  .join("\n")}
- Use the EXACT task title from the prioritized list in each reasoning
- Ensure reasoning accurately reflects the actual deadline and priority of that specific task
- Return ONLY valid JSON, no markdown formatting or additional text
- Prioritize by DEADLINE FIRST, then by PRIORITY LEVEL
- IMPORTANT: When tasks are due on the same day or within 2-3 hours, HIGH priority should beat LOW priority
- Double-check that each reasoning describes the correct task for that position
- DO NOT OMIT ANY TASKS - include all ${activeTasks.length} tasks
- REASONING STYLE: Write natural, concise explanations without repetitive phrases like "Task X is prioritized Y because". Focus on the key factors that determined the priority.
- DATE FORMAT: Remember that all dates are in DD/MM/YYYY format (European format).
- TIME ESTIMATION: Provide realistic time estimates based on task complexity. Consider:
  * Simple tasks (quick calls, short errands): 15-30 minutes
  * Medium tasks (meetings, focused work): 1-2 hours  
  * Complex tasks (reports, projects): 2-4 hours or more
  * Return estimates in minutes or hours, e.g. "30 minutes", "2 hours"
  * Use common sense based on task titles`,

        fr: `Vous êtes un expert en priorisation de tâches. Analysez les tâches suivantes et priorisez-les en fonction de l'ÉCHÉANCE et des NIVEAUX DE PRIORITÉ.

IMPORTANT: Toutes les dates sont au format DD/MM/YYYY (format européen). Par exemple:
- 04/08/2025 signifie le 4 août 2025 (pas le 8 avril)
- 02/08/2025 signifie le 2 août 2025 (pas le 8 février)
- 12/08/2025 signifie le 12 août 2025 (pas le 8 décembre)

Tâches à analyser:
${tasksDescription}

CRITÈRES DE PRIORISATION (par ordre d'importance):
1. **Échéance (Très Important)**: Les tâches avec des échéances plus précoces doivent être priorisées plus haut
2. **Niveau de Priorité (Très Important)**: Les tâches de haute priorité doivent être classées au-dessus des moyennes, moyennes au-dessus des basses
3. **Sensibilité Temporelle**: Considérez à quel point l'échéance est proche d'aujourd'hui
4. **Surcharge de Priorité**: Quand les tâches sont dues le même jour ou dans quelques heures, le NIVEAU DE PRIORITÉ prend le dessus sur les petites différences de temps
5. **Dépendances de Tâches**: Si une tâche bloque les autres, priorisez-la en premier

RÈGLES DE PRIORISATION:
- Trier par échéance d'abord (la plus précoce en premier)
- Dans la même échéance, trier par priorité (Haute > Moyenne > Basse)
- SURCHARGE DE PRIORITÉ: Si les tâches sont dues le même jour ou dans 2-3 heures, la priorité haute bat la priorité basse indépendamment des petites différences de temps
- Les tâches sans échéance vont en dernier, triées par priorité
- Considérez l'urgence: les tâches dues aujourd'hui/demain obtiennent la priorité la plus haute
- Quand la différence de temps est inférieure à 3 heures, priorisez par niveau de priorité d'abord, puis par temps

IMPORTANT: Vous DEVEZ inclure TOUTES les ${
          activeTasks.length
        } tâches dans votre priorisation. Ne sautez aucune tâche.

Veuillez fournir une réponse JSON avec cette structure EXACTE (pas de texte supplémentaire avant ou après le JSON):
{
  "prioritizedTaskIds": [${activeTasks
    .map((_, index) => index + 1)
    .join(", ")}],
  "reasoning": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Explication brève et naturelle se concentrant sur les facteurs d'échéance et de priorité]"`
  )
  .join(",\n")}
  },
  "estimatedTimePerTask": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Estimation de temps réaliste basée sur la complexité et la nature de la tâche]"`
  )
  .join(",\n")}
  },
  "timeColors": {
${activeTasks
  .map(
    (_, index) =>
      `    "${
        index + 1
      }": "[Couleur pour l'estimation de temps: 'green' pour les tâches courtes (≤30min), 'yellow' pour les tâches moyennes (1-2h), 'red' pour les tâches longues (3h+)]"`
  )
  .join(",\n")}
  }
}

EXIGENCES CRITIQUES:
- Vous DEVEZ inclure TOUTES les ${
          activeTasks.length
        } tâches dans le tableau prioritizedTaskIds
- Le titre de la tâche dans le raisonnement DOIT correspondre à la tâche qui est réellement priorisée à cette position
${activeTasks
  .map(
    (_, index) =>
      `- Le raisonnement de la position ${
        index + 1
      } doit décrire la tâche qui est classée #${index + 1}`
  )
  .join("\n")}
- Utilisez le TITRE EXACT de la tâche de la liste priorisée dans chaque raisonnement
- Assurez-vous que le raisonnement reflète avec précision l'échéance et la priorité réelles de cette tâche spécifique
- Retournez UNIQUEMENT du JSON valide, pas de formatage markdown ou de texte supplémentaire
- Priorisez par ÉCHÉANCE D'ABORD, puis par NIVEAU DE PRIORITÉ
- IMPORTANT: Quand les tâches sont dues le même jour ou dans 2-3 heures, la priorité HAUTE doit battre la priorité BASSE
- Vérifiez que chaque raisonnement décrit la tâche correcte pour cette position
- NE SAUTEZ AUCUNE TÂCHE - incluez toutes les ${activeTasks.length} tâches
- STYLE DE RAISONNEMENT: Écrivez des explications naturelles et concises sans phrases répétitives comme "La tâche X est priorisée Y parce que". Concentrez-vous sur les facteurs clés qui ont déterminé la priorité.
- FORMAT DE DATE: Rappelez-vous que toutes les dates sont au format DD/MM/YYYY (format européen).
- ESTIMATION DE TEMPS: Fournissez des estimations de temps réalistes basées sur la complexité de la tâche. Considérez:
  * Tâches simples (appels rapides, courses courtes): 15-30 minutes
  * Tâches moyennes (réunions, travail concentré): 1-2 heures
  * Tâches complexes (rapports, projets): 2-4 heures ou plus
  * Retournez les estimations en minutes ou heures, ex. "30 minutes", "2 heures"
  * Utilisez le bon sens basé sur les titres de tâches`,
      };

      const prompt = prompts[language] || prompts.en;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse the JSON response
      try {
        // Clean the response text to extract JSON
        let jsonText = text.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith("```json")) {
          jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsedResponse = JSON.parse(jsonText);

        // Validate the response structure
        if (
          !parsedResponse.prioritizedTaskIds ||
          !Array.isArray(parsedResponse.prioritizedTaskIds)
        ) {
          throw new Error(
            "Invalid response structure: missing prioritizedTaskIds array"
          );
        }

        // Ensure all tasks are included
        if (parsedResponse.prioritizedTaskIds.length !== activeTasks.length) {
          console.warn(
            `AI returned ${parsedResponse.prioritizedTaskIds.length} tasks instead of ${activeTasks.length}. Adding missing tasks.`
          );

          // Find missing task IDs
          const includedIds = new Set(parsedResponse.prioritizedTaskIds);
          const missingIds = [];
          for (let i = 1; i <= activeTasks.length; i++) {
            if (!includedIds.has(i)) {
              missingIds.push(i);
            }
          }

          // Add missing tasks to the end
          parsedResponse.prioritizedTaskIds.push(...missingIds);

          // Add reasoning for missing tasks
          missingIds.forEach((taskId, index) => {
            const position =
              parsedResponse.prioritizedTaskIds.length -
              missingIds.length +
              index +
              1;
            const actualTask = activeTasks[taskId - 1];
            if (actualTask) {
              parsedResponse.reasoning[
                String(position)
              ] = `Task '${actualTask.title}' is prioritized ${position} because its deadline and priority level.`;
            }
          });
        }

        // Validate that reasoning matches the actual tasks
        const reasoning = {};
        parsedResponse.prioritizedTaskIds.forEach((taskId, index) => {
          const actualTask = activeTasks[taskId - 1];
          if (actualTask) {
            const aiReasoning = parsedResponse.reasoning[String(index + 1)];

            // Check if the AI reasoning mentions the correct task title
            if (
              aiReasoning &&
              aiReasoning.toLowerCase().includes(actualTask.title.toLowerCase())
            ) {
              reasoning[String(index + 1)] = aiReasoning;
            } else {
              // Generate correct reasoning if AI provided wrong task description
              const deadline = actualTask.deadline
                ? new Date(actualTask.deadline).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : language === "fr"
                ? "Aucune échéance"
                : "No deadline";
              const priority = actualTask.priority || "Medium";
              const daysUntilDeadline = actualTask.deadline
                ? Math.ceil(
                    (new Date(actualTask.deadline) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;

              let urgencyText = "";
              if (daysUntilDeadline !== null) {
                if (daysUntilDeadline === 0) {
                  urgencyText =
                    language === "fr"
                      ? " (à rendre aujourd'hui)"
                      : " (due today)";
                } else if (daysUntilDeadline === 1) {
                  urgencyText =
                    language === "fr"
                      ? " (à rendre demain)"
                      : " (due tomorrow)";
                } else if (daysUntilDeadline <= 3) {
                  urgencyText =
                    language === "fr"
                      ? ` (à rendre dans ${daysUntilDeadline} jours)`
                      : ` (due in ${daysUntilDeadline} days)`;
                } else {
                  urgencyText =
                    language === "fr"
                      ? ` (à rendre dans ${daysUntilDeadline} jours)`
                      : ` (due in ${daysUntilDeadline} days)`;
                }
              }

              reasoning[String(index + 1)] =
                language === "fr"
                  ? `Échéance ${deadline}${urgencyText} avec niveau de priorité ${priority.toUpperCase()}.`
                  : `Due ${deadline}${urgencyText} with ${priority.toUpperCase()} priority level.`;
            }
          }
        });

        return {
          prioritizedTasks: parsedResponse.prioritizedTaskIds.map(
            (id) => activeTasks[id - 1]
          ),
          reasoning: reasoning,
          estimatedTimePerTask: parsedResponse.estimatedTimePerTask || {},
          timeColors: parsedResponse.timeColors || {},
        };
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw AI response:", text);

        // If JSON parsing fails, return a structured fallback with all tasks
        const fallbackPrioritizedTasks = activeTasks.map(
          (_, index) => index + 1
        );
        const fallbackReasoning = {};

        activeTasks.forEach((task, index) => {
          const deadline = task.deadline
            ? new Date(task.deadline).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : language === "fr"
            ? "Aucune échéance"
            : "No deadline";
          const priority = task.priority || "Medium";
          const daysUntilDeadline = task.deadline
            ? Math.ceil(
                (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              )
            : null;

          let urgencyText = "";
          if (daysUntilDeadline !== null) {
            if (daysUntilDeadline === 0) {
              urgencyText =
                language === "fr" ? " (à rendre aujourd'hui)" : " (due today)";
            } else if (daysUntilDeadline === 1) {
              urgencyText =
                language === "fr" ? " (à rendre demain)" : " (due tomorrow)";
            } else if (daysUntilDeadline <= 3) {
              urgencyText =
                language === "fr"
                  ? ` (à rendre dans ${daysUntilDeadline} jours)`
                  : ` (due in ${daysUntilDeadline} days)`;
            } else {
              urgencyText =
                language === "fr"
                  ? ` (à rendre dans ${daysUntilDeadline} jours)`
                  : ` (due in ${daysUntilDeadline} days)`;
            }
          }

          fallbackReasoning[String(index + 1)] =
            language === "fr"
              ? `Échéance ${deadline}${urgencyText} avec niveau de priorité ${priority.toUpperCase()}.`
              : `Due ${deadline}${urgencyText} with ${priority.toUpperCase()} priority level.`;
        });

        return {
          prioritizedTasks: activeTasks,
          reasoning: fallbackReasoning,
          estimatedTimePerTask: {},
          timeColors: {},
        };
      }
    } catch (error) {
      console.error("Error in Gemini service:", error);
      throw new Error(`Failed to prioritize tasks: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
