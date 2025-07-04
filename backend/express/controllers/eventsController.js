const eventsService = require("../services/eventsService");

class EventsController {
  async saveEvent(req, res) {
    try {
      const { type, entities } = req.body;
      const userId = req.user.id;

      const event = await eventsService.saveEvent(userId, type, entities);

      return res.status(201).json(event);
    } catch (error) {
      console.error("Error saving event:", error);
      res.status(500).json({ error: "Failed to save: " + error.message });
    }
  }

  async getEventsByUserId(req, res) {
    try {
      const { userId } = req.params;

      const events = await eventsService.getEventsByUserId(userId);

      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch events: " + error.message });
    }
  }

  async saveManualEvent(req, res) {
    try {
      const { title, date_time } = req.body;
      const userId = req.user.id;

      const event = await eventsService.saveManualEvent(
        userId,
        title,
        date_time
      );

      return res.status(201).json(event);
    } catch (error) {
      console.error("Error saving manual event:", error);
      res.status(500).json({ error: "Failed to save: " + error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { title, date_time } = req.body;
      const userId = req.user.id;

      const updatedEvent = await eventsService.updateEvent(
        userId,
        eventId,
        title,
        date_time
      );

      return res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      if (error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to update event: " + error.message });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const result = await eventsService.deleteEvent(userId, eventId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to delete event: " + error.message });
    }
  }
}

module.exports = new EventsController();
