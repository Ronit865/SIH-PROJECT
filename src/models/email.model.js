import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    // all Alumni/Donor/Users
    to: {
        type: String,
        enum: ['Alumni', 'Donor', 'Student', 'All'],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
},{timestamps: true});

const Email = mongoose.model('Email', emailSchema);

export default Email;