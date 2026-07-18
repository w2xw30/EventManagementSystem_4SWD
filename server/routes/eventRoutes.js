const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Attendee = require("../models/Attendee");

router.get("/", async (req, res, next) => {
  try {
    const events = await Event.findAll();
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

router.post("/", async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    await event.update(req.body);
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

// POST /events/:id/register
// Purpose: register an attendee to a specific event
router.post("/:id/register", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // req.body.attendeeId — the id of the attendee we want to register
    const attendee = await Attendee.findByPk(req.body.attendeeId);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    // .addAttendee() is a special method Sequelize auto-generates
    // because of the belongsToMany association — it inserts a row
    // into the EventAttendees join table linking this event + attendee.
    await event.addAttendee(attendee);

    res.status(201).json({ message: "Attendee registered to event" });
  } catch (error) {
    next(error);
  }
});

// GET /events/:id/attendees
// Purpose: list all attendees registered for a specific event
router.get("/:id/attendees", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // .getAttendees() — another auto-generated method, fetches
    // all attendees linked to this event via the join table.
    const attendees = await event.getAttendees();
    res.json(attendees);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
