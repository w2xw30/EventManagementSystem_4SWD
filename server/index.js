const express = require("express");
const sequelize = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
