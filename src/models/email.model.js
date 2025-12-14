import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    // all Alumni/Donor/Users
    to: {
        type: String,
        enum: ['alumni', 'donor', 'student', 'all'],
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
    type: {
        type: String,
        enum: ['quick_message', 'event', 'job', 'donation', 'announcement'],
        default: 'quick_message',
    },
    totalSent: {
        type: Number,
        default: 0,
    },
    totalFailed: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'partial'],
        default: 'sent',
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{timestamps: true});

const Email = mongoose.model('Email', emailSchema);

export default Email;