const prisma = require("../config/prisma");

class EventsService {
  async saveEvent(userId, type, entities) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    if (!type || !entities) {
      throw new Error("Missing required data");
    }

    if (type === "Événement") {
      // Create event
      const title = entities.TITRE?.[0] || "Untitled Event";
      let date_time = null;
      let date_time_text = null;

      // Handle date and time
      if (entities.DATE_HEURE?.[0]) {
        // The input text should be saved as date_time_text
        date_time_text = entities.DATE_HEURE[0];

        // Check if we have an interpretation (parsedDate)
        if (entities.DATE_HEURE_PARSED?.[0]) {
          try {
            // Convert the parsed date string to a JavaScript Date object
            date_time = new Date(entities.DATE_HEURE_PARSED[0]);

            // Check if the date is valid
            if (isNaN(date_time.getTime())) {
              console.warn(
                "Invalid date parsed:",
                entities.DATE_HEURE_PARSED[0]
              );
              date_time = null;
            }
          } catch (e) {
            console.error("Error parsing date:", e);
            date_time = null;
          }
        } else {
          // Fallback to the previous JSON parsing logic
          try {
            const parsed = JSON.parse(entities.DATE_HEURE[0]);
            if (parsed.originalText && parsed.parsedDate) {
              date_time_text = parsed.originalText;

              try {
                // Convert parsedDate to Date object
                date_time = new Date(parsed.parsedDate);

                // Validate the date
                if (isNaN(date_time.getTime())) {
                  console.warn("Invalid date from JSON:", parsed.parsedDate);
                  date_time = null;
                }
              } catch (e) {
                console.error("Error parsing JSON date:", e);
                date_time = null;
              }
            }
          } catch (e) {
            // Not JSON, already handled date_time_text above
            date_time = null;
          }
        }
      }

      // Check if user exists in the database
      let dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      // If user doesn't exist in database, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: userId, // This might need to be adjusted based on your user structure
          },
        });
      }

      const event = await prisma.event.create({
        data: {
          title,
          date_time,
          date_time_text,
          user_id: userId,
        },
      });

      return event;
    } else {
      throw new Error("Invalid type");
    }
  }

  async getEventsByUserId(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const events = await prisma.event.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        date_time: "asc",
      },
    });

    return events;
  }

  async saveManualEvent(userId, title, date_time) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    if (!title || !date_time) {
      throw new Error("Title and date_time are required");
    }

    // Check if user exists in the database
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist in database, create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: userId, // This might need to be adjusted based on your user structure
        },
      });
    }

    // Parse date_time if it's a string
    const parsedDateTime =
      typeof date_time === "string" ? new Date(date_time) : date_time;

    // Validate date
    if (isNaN(parsedDateTime.getTime())) {
      throw new Error("Invalid date format");
    }

    const event = await prisma.event.create({
      data: {
        title,
        date_time: parsedDateTime,
        user_id: userId,
      },
    });

    return event;
  }

  async updateEvent(userId, eventId, title, date_time) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    if (!title || !date_time) {
      throw new Error("Title and date_time are required");
    }

    // Check if event exists and belongs to the user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        user_id: userId,
      },
    });

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    // Parse date_time if it's a string
    const parsedDateTime =
      typeof date_time === "string" ? new Date(date_time) : date_time;

    // Validate date
    if (isNaN(parsedDateTime.getTime())) {
      throw new Error("Invalid date format");
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        date_time: parsedDateTime,
      },
    });

    return updatedEvent;
  }

  async deleteEvent(userId, eventId) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    // Check if event exists and belongs to the user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        user_id: userId,
      },
    });

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return { message: "Event deleted successfully" };
  }
}

module.exports = new EventsService();
