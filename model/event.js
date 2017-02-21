const mongoose = require('../db/mongoose');
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    ID: Number,
    CustomerID: Number,
    ParentID: Number,
    Status: String,
    Title: String,
    StartDate: Date,
    EndDate: Date
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;