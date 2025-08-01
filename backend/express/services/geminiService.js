const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async prioritizeTasks(tasks) {
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
        return {
          prioritizedTasks: [],
          reasoning:
            "No active tasks to prioritize. All tasks are either completed or overdue.",
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
            : "No deadline";
          const priority = task.priority || "Medium";
          const daysUntilDeadline = task.deadline
            ? Math.ceil(
                (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              )
            : null;

          let urgencyIndicator = "";
          if (daysUntilDeadline !== null) {
            if (daysUntilDeadline < 0) urgencyIndicator = " (OVERDUE)";
            else if (daysUntilDeadline === 0) urgencyIndicator = " (DUE TODAY)";
            else if (daysUntilDeadline === 1)
              urgencyIndicator = " (DUE TOMORROW)";
            else if (daysUntilDeadline <= 3)
              urgencyIndicator =
                " (URGENT - due in " + daysUntilDeadline + " days)";
            else if (daysUntilDeadline <= 7)
              urgencyIndicator = " (due in " + daysUntilDeadline + " days)";
            else urgencyIndicator = " (due in " + daysUntilDeadline + " days)";
          }

          return `${index + 1}. ${task.title}
   - PRIORITY: ${priority.toUpperCase()}
   - DEADLINE: ${deadline}${urgencyIndicator}
   - Description: ${task.description || "No description"}
   - Status: ${task.status || "Pending"}`;
        })
        .join("\n\n");

      const prompt = `You are a task prioritization expert. Analyze the following tasks and prioritize them based on DUE TIME and PRIORITY LEVELS.

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
  * Use common sense based on task titles`;

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
                if (daysUntilDeadline === 0) urgencyText = " (due today)";
                else if (daysUntilDeadline === 1)
                  urgencyText = " (due tomorrow)";
                else if (daysUntilDeadline <= 3)
                  urgencyText = ` (due in ${daysUntilDeadline} days)`;
                else urgencyText = ` (due in ${daysUntilDeadline} days)`;
              }

              reasoning[
                String(index + 1)
              ] = `Due ${deadline}${urgencyText} with ${priority.toUpperCase()} priority level.`;
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
            : "No deadline";
          const priority = task.priority || "Medium";
          const daysUntilDeadline = task.deadline
            ? Math.ceil(
                (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              )
            : null;

          let urgencyText = "";
          if (daysUntilDeadline !== null) {
            if (daysUntilDeadline === 0) urgencyText = " (due today)";
            else if (daysUntilDeadline === 1) urgencyText = " (due tomorrow)";
            else if (daysUntilDeadline <= 3)
              urgencyText = ` (due in ${daysUntilDeadline} days)`;
            else urgencyText = ` (due in ${daysUntilDeadline} days)`;
          }

          fallbackReasoning[
            String(index + 1)
          ] = `Due ${deadline}${urgencyText} with ${priority.toUpperCase()} priority level.`;
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
