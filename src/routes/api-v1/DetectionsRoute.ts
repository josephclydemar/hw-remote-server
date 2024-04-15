import express, { Router } from 'express';

import DetectionsController from '../../controllers/DetectionController';

const router: Router = express.Router();

router.route('/detections').get(DetectionsController.getDetections).post(DetectionsController.insertOneDetection);

export default router;
