require("dotenv").config();

const express = require("express");
const sequelize = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");
require("./models/associations");

const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/events", authMiddleware, eventRoutes);
app.use("/attendees", authMiddleware, attendeeRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
