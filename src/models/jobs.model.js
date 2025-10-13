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
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Software Engineering',
            'Frontend Engineering',
            'Backend Engineering',
            'Full-stack Engineering',
            'DevOps / Site Reliability',
            'Data Engineering',
            'Machine Learning / AI Engineering',
            'Cloud Engineering',
            'Security Engineering',
            'Network Engineering',
            'Systems Engineering',
            'Embedded Systems',
            'Firmware Engineering',
            'Electrical Engineering',
            'Electronics Engineering',
            'Mechanical Engineering',
            'Automotive Engineering',
            'Aerospace Engineering',
            'Civil Engineering',
            'Structural Engineering',
            'Environmental Engineering',
            'Chemical Engineering',
            'Process Engineering',
            'Biomedical / Medical Engineering',
            'Biotechnology Engineering',
            'Industrial / Manufacturing Engineering',
            'Quality Assurance / Test Engineering',
            'Robotics Engineering',
            'Materials Engineering',
            'Nanotechnology Engineering',
            'Petroleum Engineering',
            'Marine / Ocean Engineering',
            'Controls / Automation Engineering',
            'Telecommunications Engineering',
            'Renewable Energy / Solar / Wind Engineering',
            'Acoustic Engineering',
            'Optical Engineering',
            'Agricultural Engineering'
        ]
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
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;