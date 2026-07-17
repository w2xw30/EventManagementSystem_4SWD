const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

router.get("/", async (req, res, next) => {
  try {
    const attendees = await Attendee.findAll();
    res.json(attendees);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.json(attendee);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newAttendee = await Attendee.create(req.body);
    res.status(201).json(newAttendee);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    await attendee.update(req.body);
    res.json(attendee);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    await attendee.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
