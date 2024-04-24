import express, { Router } from 'express';

import DetectionsController from '../../controllers/DetectionController';

import { uploadFiles } from '../../middlewares/Uploader';

const router: Router = express.Router();

router.route('/detections')
.get(DetectionsController.getDetections)
.post(uploadFiles, DetectionsController.insertOneDetection);

export default router;
