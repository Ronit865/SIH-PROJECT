import express from 'express';
import { addJob, editJob, deleteJob, getAllJobs, verifyJob, jobApply } from '../controllers/jobs.controller.js';
import { verifyAdminJWT , verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.route('/addJob').post(verifyJWT, addJob);

router.route('/editJob/:id').patch(verifyJWT, editJob);

router.route('/deleteJob/:id').delete(verifyAdminJWT, deleteJob);

router.route('/getAllJobs').get(getAllJobs);

router.route('/verifyJob/:id').patch(verifyAdminJWT, verifyJob);

router.route('/jobApply/:id').post(verifyJWT, jobApply);

export default router;
