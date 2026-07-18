const express = require("express");
const sequelize = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const errorHandler = require("./middleware/errorHandler");
require("./models/Associations");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/events", eventRoutes);
app.use("/attendees", attendeeRoutes);

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
