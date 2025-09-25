import mongoose from "mongoose";


const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    goal: {
        type: Number,
        required: true,
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    donors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;