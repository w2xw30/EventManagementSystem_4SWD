const Event = require("./Event");
const Attendee = require("./Attendee");

Event.belongsToMany(Attendee, { through: "EventAttendees" });
Attendee.belongsToMany(Event, { through: "EventAttendees" });

module.exports = { Event, Attendee };
