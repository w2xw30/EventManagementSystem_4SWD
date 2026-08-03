const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get, run } = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    try {
      result = await run(
        "INSERT INTO Users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
      );
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        return res.status(400).json({ error: "Username already taken" });
      }
      throw err;
    }

    res.status(201).json({ id: result.lastInsertRowid, username });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await get("SELECT * FROM Users WHERE username = ?", [
      username,
    ]);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await get("SELECT id, username FROM Users WHERE id = ?", [
      req.userId,
    ]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/change-password", authMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await get("SELECT * FROM Users WHERE id = ?", [req.userId]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await run("UPDATE Users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
