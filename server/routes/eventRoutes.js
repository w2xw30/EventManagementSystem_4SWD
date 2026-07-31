const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Attendee = require("../models/Attendee");
const { Op } = require("sequelize");
const upload = require("../config/multer");

router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    const whereClause = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const events = await Event.findAll({ where: whereClause });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
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
    const eventData = { ...req.body };

    if (req.file) {
      eventData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = { ...req.body };
    if (req.file) {
      eventData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await event.update(eventData);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/:id/register", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendee = await Attendee.findByPk(req.body.attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    await event.addAttendee(attendee);

    res.status(201).json({ message: "Attendee registered to event" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/attendees", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    const attendees = await event.getAttendees();
    res.json(attendees);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/attendees/:attendeeId", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendee = await Attendee.findByPk(req.params.attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    await event.removeAttendee(attendee);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
