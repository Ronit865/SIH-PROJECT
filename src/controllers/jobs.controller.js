import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Job from '../models/jobs.model.js';

const addJob = asyncHandler(async (req, res) => {

    const { title, description, location, jobType, category, experienceRequired, salary } = req.body;

    if (!title || !description || !location || !jobType || !category || experienceRequired === undefined || salary === undefined) {
        throw new ApiError(400, "All fields are required");
    }

    const userId = req.user.id;

    const newJob = new Job({
        title,
        description,
        location,
        jobType,
        category,
        experienceRequired,
        salary,
        postedBy: userId,
    })

    await newJob.save();

    return res
    .status(201)
    .json(new ApiResponse(201, 'Job added successfully', newJob));
});

const editJob = asyncHandler(async (req, res) => {

    const { title, description, location, jobType, category, experienceRequired, salary } = req.body;

    const job = await Job.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title,
                description,
                location,
                jobType,
                category,
                experienceRequired,
                salary,
            }
        },
        { new: true, runValidators: true }
    );

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Job updated successfully', job));
});

const deleteJob = asyncHandler(async (req, res) => { 

    const job = await Job.findByIdAndDelete(
        req.params.id
    );

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Job deleted successfully', {}));
});

const getAllJobs = asyncHandler(async (req, res) => { 
    const jobs = await Job.find();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Jobs fetched successfully', jobs));
});

const verifyJob = asyncHandler(async (req, res) => {

    const job = await Job.findByIdAndUpdate(
        req.params.id,
        {
            $set: { 
                isVerified: true
            }
        },
        { new: true }
    );

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, 'Job verified successfully', job));
});

const jobApply = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const job = await Job.findById(req.params.id);

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    if (job.applicants.includes(userId)){
        throw new ApiError(400, 'You have already applied for this job');
    }
    // job.applicants.push is used to add the userId to the applicants array
    job.applicants.push(userId);
    await job.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Job applied successfully', job));

});

export {
    addJob,
    editJob,
    deleteJob,
    getAllJobs,
    verifyJob,
    jobApply
}