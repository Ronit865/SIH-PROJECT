import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    
});

const Event = mongoose.model("Event", eventSchema);

export default Event;