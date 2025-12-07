import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    experienceRequired: {
        type: String,
        required: true,
        trim: true,
    },
    salary:{
        type: Number,
        required: true,
        min: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;