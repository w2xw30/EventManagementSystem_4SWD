const express = require("express");
const router = express.Router();
const { get, all, run } = require("../config/database");
const upload = require("../config/multer");
const { uploadImage } = require("../config/blob");
router.get("/", async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
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

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { name, description, date, time, location } = req.body;

    if (!name?.trim() || !date?.trim() || !time?.trim() || !location?.trim()) {
      return res
        .status(400)
        .json({ error: "Name, date, time, and location are required" });
    }
    const imageUrl = req.file ? await uploadImage(req.file) : null;

    const result = await run(
      `INSERT INTO Events (name, description, date, time, location, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, date, time, location, imageUrl],
    );

    const newEvent = await get("SELECT * FROM Events WHERE id = ?", [
      result.lastInsertRowid,
    ]);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const existing = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    const name = req.body.name ?? existing.name;
    const description = req.body.description ?? existing.description;
    const date = req.body.date ?? existing.date;
    const time = req.body.time ?? existing.time;
    const location = req.body.location ?? existing.location;

    const imageUrl = req.file ? await uploadImage(req.file) : existing.imageUrl;

    await run(
      `UPDATE Events SET name = ?, description = ?, date = ?, time = ?, location = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, date, time, location, imageUrl, req.params.id],
    );

    const updatedEvent = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    await run("DELETE FROM Events WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/:id/register", async (req, res, next) => {
  try {
    const event = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendee = await get("SELECT * FROM Attendees WHERE id = ?", [
      req.body.attendeeId,
    ]);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    try {
      await run(
        "INSERT INTO EventAttendees (EventId, AttendeeId) VALUES (?, ?)",
        [req.params.id, req.body.attendeeId],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ error: "Attendee is already registered to this event" });
      }
      throw err;
    }

    res.status(201).json({ message: "Attendee registered to event" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/attendees", async (req, res, next) => {
  try {
    const event = await get("SELECT * FROM Events WHERE id = ?", [
      req.params.id,
    ]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendees = await all(
      `SELECT Attendees.* FROM Attendees
       JOIN EventAttendees ON Attendees.id = EventAttendees.AttendeeId
       WHERE EventAttendees.EventId = ?`,
      [req.params.id],
    );

    res.json(attendees);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/attendees/:attendeeId", async (req, res, next) => {
  try {
    await run(
      "DELETE FROM EventAttendees WHERE EventId = ? AND AttendeeId = ?",
      [req.params.id, req.params.attendeeId],
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
