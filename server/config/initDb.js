const { run } = require("./database");

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS Events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      imageUrl TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phoneNumber TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS EventAttendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      EventId INTEGER NOT NULL,
      AttendeeId INTEGER NOT NULL,
      FOREIGN KEY (EventId) REFERENCES Events(id) ON DELETE CASCADE,
      FOREIGN KEY (AttendeeId) REFERENCES Attendees(id) ON DELETE CASCADE,
      UNIQUE(EventId, AttendeeId)
    )
  `);

  console.log("Database tables ready");
}

module.exports = initDb;
