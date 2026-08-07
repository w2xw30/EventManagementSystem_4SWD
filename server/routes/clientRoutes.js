const express = require("express");
const router = express.Router();
const { get, all, run } = require("../config/database");
const clientAuthMiddleware = require("../middleware/clientAuthMiddleware");

router.use(clientAuthMiddleware);

router.get("/events", async (req, res, next) => {
  try {
    const { search } = req.query;
    let events;
    if (search) {
      events = await all("SELECT * FROM Events WHERE name LIKE ?", [
        `%${search}%`,
      ]);
    } else {
      events = await all("SELECT * FROM Events");
    }
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.get("/events/:id", async (req, res, next) => {
  try {
    const event = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.post("/events/:id/interest", async (req, res, next) => {
  try {
    const event = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    try {
      await run(
        "INSERT INTO EventInterests (EventId, ClientId, status) VALUES (?, ?, ?)",
        [req.params.id, req.clientId, "pending"],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ error: "You have already expressed interest in this event" });
      }
      throw err;
    }

    res.status(201).json({ message: "Interest submitted" });
  } catch (error) {
    next(error);
  }
});

router.get("/my-interests", async (req, res, next) => {
  try {
    const interests = await all(
      `SELECT EventInterests.id, EventInterests.status, EventInterests.createdAt,
              Events.id AS eventId, Events.name, Events.date, Events.time, Events.location, Events.imageUrl
       FROM EventInterests
       JOIN Events ON Events.id = EventInterests.EventId
       WHERE EventInterests.ClientId = ?
       ORDER BY EventInterests.createdAt DESC`,
      [req.clientId],
    );
    res.json(interests);
  } catch (error) {
    next(error);
  }
});

router.delete("/events/:id/interest", async (req, res, next) => {
  try {
    await run(
      `DELETE FROM EventInterests WHERE EventId = ? AND ClientId = ? AND status = 'pending'`,
      [req.params.id, req.clientId],
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
