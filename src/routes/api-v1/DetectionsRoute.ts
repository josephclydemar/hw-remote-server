import express, { Router } from 'express';

import DetectionsController from '../../controllers/DetectionController';

import { uploadFiles } from '../../middlewares/Uploader';

const DetectionsV1Router: Router = express.Router();

DetectionsV1Router.route('/detections').get(DetectionsController.getDetections).post(uploadFiles, DetectionsController.insertOneDetection);

DetectionsV1Router.route('/detections/:id').get(DetectionsController.streamOneDetectionVideo);

export default DetectionsV1Router;
