const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get, run } = require("../config/database");
const clientAuthMiddleware = require("../middleware/clientAuthMiddleware");

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phoneNumber?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        error: "Name, email, phone number, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    try {
      result = await run(
        "INSERT INTO Clients (name, email, phoneNumber, password) VALUES (?, ?, ?, ?)",
        [name, email, phoneNumber, hashedPassword],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res
          .status(400)
          .json({ error: "An account with this email already exists" });
      }
      throw err;
    }

    const existingAttendee = await get(
      "SELECT * FROM Attendees WHERE email = ?",
      [email],
    );
    if (!existingAttendee) {
      try {
        await run(
          "INSERT INTO Attendees (name, email, phoneNumber) VALUES (?, ?, ?)",
          [name, email, phoneNumber],
        );
      } catch (err) {}
    }

    const token = jwt.sign(
      { id: result.lastInsertRowid, type: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ token, name, email });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const client = await get("SELECT * FROM Clients WHERE email = ?", [email]);
    if (!client) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: client.id, type: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token, name: client.name, email: client.email });
  } catch (error) {
    next(error);
  }
});

router.get("/me", clientAuthMiddleware, async (req, res, next) => {
  try {
    const client = await get(
      "SELECT id, name, email, phoneNumber FROM Clients WHERE id = ?",
      [req.clientId],
    );
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
});

router.put("/update-profile", clientAuthMiddleware, async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name?.trim() || !phoneNumber?.trim()) {
      return res
        .status(400)
        .json({ error: "Name and phone number are required" });
    }

    await run("UPDATE Clients SET name = ?, phoneNumber = ? WHERE id = ?", [
      name,
      phoneNumber,
      req.clientId,
    ]);

    const client = await get("SELECT * FROM Clients WHERE id = ?", [
      req.clientId,
    ]);
    await run(
      "UPDATE Attendees SET name = ?, phoneNumber = ? WHERE email = ?",
      [name, phoneNumber, client.email],
    );

    res.json({ message: "Profile updated" });
  } catch (error) {
    next(error);
  }
});

router.put("/change-password", clientAuthMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const client = await get("SELECT * FROM Clients WHERE id = ?", [
      req.clientId,
    ]);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, client.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await run("UPDATE Clients SET password = ? WHERE id = ?", [
      hashedPassword,
      req.clientId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
