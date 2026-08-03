const express = require("express");
const router = express.Router();
const { get, all, run } = require("../config/database");

router.get("/", async (req, res, next) => {
  try {
    const attendees = await all("SELECT * FROM Attendees");
    res.json(attendees);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const attendee = await get("SELECT * FROM Attendees WHERE id = ?", [
      req.params.id,
    ]);
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
    const { name, email, phoneNumber } = req.body;

    if (!name?.trim() || !email?.trim() || !phoneNumber?.trim()) {
      return res
        .status(400)
        .json({ error: "Name, email, and phone number are required" });
    }

    let result;
    try {
      result = await run(
        "INSERT INTO Attendees (name, email, phoneNumber) VALUES (?, ?, ?)",
        [name, email, phoneNumber],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ error: "An attendee with this email already exists" });
      }
      throw err;
    }

    const newAttendee = await get("SELECT * FROM Attendees WHERE id = ?", [
      result.lastInsertRowid,
    ]);
    res.status(201).json(newAttendee);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existing = await get("SELECT * FROM Attendees WHERE id = ?", [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    const name = req.body.name ?? existing.name;
    const email = req.body.email ?? existing.email;
    const phoneNumber = req.body.phoneNumber ?? existing.phoneNumber;

    try {
      await run(
        `UPDATE Attendees SET name = ?, email = ?, phoneNumber = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, email, phoneNumber, req.params.id],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ error: "An attendee with this email already exists" });
      }
      throw err;
    }

    const updatedAttendee = await get("SELECT * FROM Attendees WHERE id = ?", [
      req.params.id,
    ]);
    res.json(updatedAttendee);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await get("SELECT * FROM Attendees WHERE id = ?", [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    await run("DELETE FROM Attendees WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
