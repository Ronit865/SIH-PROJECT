import express from 'express';
import { addJob, editJob, deleteJob, getAllJobs, verifyJob } from '../controllers/jobs.controller.js';
import { verifyAdminJWT , verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.route('/addJob').post(verifyJWT, addJob);

router.route('/editJob/:id').patch(verifyJWT, editJob);

router.route('/deleteJob/:id').delete(verifyJWT, deleteJob);

router.route('/getAllJobs').get(getAllJobs);

router.route('/verifyJob/:id').patch(verifyAdminJWT, verifyJob);

export default router;
