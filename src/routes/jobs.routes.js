import express from 'express';
import { addJob, editJob, deleteJob, getAllJobs, verifyJob, jobApply, jobUnapply, jobApplicants, getMyPostedJobs, jobRejectByAdmin } from '../controllers/jobs.controller.js';
import { verifyAdminJWT , verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.route('/addJob').post(verifyJWT, addJob);

router.route('/editJob/:id').patch(verifyJWT, editJob);

router.route('/deleteJob/:id').delete(verifyJWT, deleteJob);

router.route('/rejectJob/:id').delete(verifyAdminJWT, jobRejectByAdmin);

router.route('/getAllJobs').get(getAllJobs);

router.route('/getMyPostedJobs').get(verifyJWT, getMyPostedJobs);

router.route('/verifyJob/:id').patch(verifyAdminJWT, verifyJob);

router.route('/jobApply/:id').post(verifyJWT, jobApply);

router.route('/jobUnapply/:id').delete(verifyJWT, jobUnapply);

router.route('/jobApplicants/:id').get(jobApplicants);

export default router;
