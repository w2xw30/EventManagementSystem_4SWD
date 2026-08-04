require("dotenv").config();

const express = require("express");
const cors = require("cors");
const initDb = require("./config/initDb");
const eventRoutes = require("./routes/eventRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", authMiddleware, eventRoutes);
app.use("/api/attendees", authMiddleware, attendeeRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

initDb()
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

module.exports = app;
